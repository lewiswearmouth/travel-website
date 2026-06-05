'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Map as MapboxMap } from 'mapbox-gl';
import { useEffect, useMemo, useState } from 'react';

import { Layer, MapRef, Marker, Source } from '@vis.gl/react-mapbox';

import { COUNTRY_PHOTO_ALBUMS, CountryPhoto } from '@/lib/photos';
import {
  LOCATION_BY_ID,
  LOCATIONS,
  MODE_STYLES,
  ROUTE_SEGMENTS,
  RouteSegment,
} from '@/lib/travelData';

const Map = dynamic(() => import('@vis.gl/react-mapbox').then((m) => m.Map), {
  ssr: false,
});

type ActiveView = 'globe' | 'gallery';

type GalleryPhoto = CountryPhoto & {
  src: string;
  caption: string;
  locationName?: string;
};

function locationLabel(location: { name: string; country: string }) {
  return `${location.name}, ${location.country}`;
}

function connectedRoutes(locationId: string) {
  return ROUTE_SEGMENTS.filter(
    (route) => route.origin === locationId || route.destination === locationId
  );
}

function routeLabel(route: RouteSegment) {
  const origin = LOCATION_BY_ID[route.origin]?.name ?? route.origin;
  const destination = LOCATION_BY_ID[route.destination]?.name ?? route.destination;
  return `${origin} to ${destination}`;
}

function applyMapAtmosphere(map: MapboxMap) {
  map.setFog({
    color: 'rgb(215, 234, 241)',
    'high-color': 'rgb(188, 220, 235)',
    'horizon-blend': 0.04,
    'space-color': 'rgb(215, 234, 241)',
    'star-intensity': 0,
  });
}

function captionFromFile(file: string) {
  return file
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('globe');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('United States');
  const [selectedGalleryLocationId, setSelectedGalleryLocationId] = useState<string | null>(null);
  const [expandedPhotoIndex, setExpandedPhotoIndex] = useState<number | null>(null);
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<MapRef | null>(null);

  const selectedLocation = selectedLocationId ? LOCATION_BY_ID[selectedLocationId] : null;
  const selectedRoutes = useMemo(
    () => (selectedLocationId ? connectedRoutes(selectedLocationId) : []),
    [selectedLocationId]
  );

  const routeGeojson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: selectedRoutes
        .map((route) => {
          const origin = LOCATION_BY_ID[route.origin];
          const destination = LOCATION_BY_ID[route.destination];
          if (!origin || !destination) return null;

          return {
            type: 'Feature',
            id: route.id,
            geometry: {
              type: 'LineString',
              coordinates: [origin.coords, destination.coords],
            },
            properties: {
              id: route.id,
              label: routeLabel(route),
              mode: route.mode,
              modeLabel: MODE_STYLES[route.mode].label,
              color: MODE_STYLES[route.mode].color,
              month: route.month ?? '',
            },
          };
        })
        .filter(Boolean),
    }),
    [selectedRoutes]
  );

  const countries = useMemo(() => {
    const grouped = LOCATIONS.reduce<Record<string, typeof LOCATIONS>>((acc, location) => {
      acc[location.country] = acc[location.country] ?? [];
      acc[location.country].push(location);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([country, locations]) => ({
        country,
        locations: locations.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .map(({ country, locations }) => {
        const album = COUNTRY_PHOTO_ALBUMS[country];
        const photos: GalleryPhoto[] = (album?.photos ?? []).map((photo) => {
          const location = photo.locationId ? LOCATION_BY_ID[photo.locationId] : null;

          return {
            ...photo,
            src: `/photos/${album?.folder ?? country}/${photo.file}`,
            caption: photo.caption ?? captionFromFile(photo.file),
            locationName: photo.locationLabel ?? location?.name,
          };
        });

        return {
          country,
          locations,
          photos,
          photoCount: photos.length,
          coverPhoto:
            photos.find((photo) => photo.cover)?.src ??
            photos[0]?.src,
        };
      })
      .sort((a, b) => a.country.localeCompare(b.country));
  }, []);

  const galleryCountry =
    countries.find((country) => country.country === selectedCountry) ?? countries[0];
  const galleryPhotos =
    selectedGalleryLocationId && galleryCountry
      ? galleryCountry.photos.filter((photo) => photo.locationId === selectedGalleryLocationId)
      : galleryCountry?.photos ?? [];
  const expandedPhoto =
    expandedPhotoIndex !== null ? galleryPhotos[expandedPhotoIndex] : null;

  useEffect(() => {
    setExpandedPhotoIndex(null);
  }, [selectedCountry, selectedGalleryLocationId]);

  useEffect(() => {
    if (activeView !== 'globe' || !mapRef || !selectedLocation) return;

    mapRef.flyTo({
      center: selectedLocation.coords,
      zoom: Math.max(mapRef.getZoom(), 2.2),
      duration: 900,
      essential: true,
    });
  }, [activeView, mapRef, selectedLocation]);

  useEffect(() => {
    if (!expandedPhoto) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExpandedPhotoIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        setExpandedPhotoIndex((current) =>
          current === null ? current : (current - 1 + galleryPhotos.length) % galleryPhotos.length
        );
      }

      if (event.key === 'ArrowRight') {
        setExpandedPhotoIndex((current) =>
          current === null ? current : (current + 1) % galleryPhotos.length
        );
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedPhoto, galleryPhotos.length]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <main
      className={`bg-[#F7F4ED] text-[#18211F] ${activeView === 'globe' ? 'h-screen overflow-hidden' : 'min-h-screen'
        }`}
    >
      <header className="border-b border-[#D8D0C3] bg-[#FDFBF6]/95">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#69746E]">
                Personal travel atlas
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#16221F] sm:text-4xl">
                A collection of my travels
              </h1>
            </div>

            <div className="grid w-full grid-cols-2 rounded-lg border border-[#CFC7BA] bg-white p-1 shadow-sm md:w-[280px]">
              {(['globe', 'gallery'] as ActiveView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => {
                    if (view === 'globe' && selectedGalleryLocationId) {
                      setSelectedLocationId(selectedGalleryLocationId);
                    }

                    setActiveView(view);
                  }}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition ${activeView === view
                    ? 'bg-[#1F5E55] text-white shadow-sm'
                    : 'text-[#4E5A55] hover:bg-[#F0ECE4]'
                    }`}
                >
                  {view === 'globe' ? 'Globe' : 'Gallery'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#52605A]">
            <div>
              <strong className="text-[#1C2A26]">{countries.length}</strong> countries
            </div>
            <div>
              <strong className="text-[#1C2A26]">{LOCATIONS.length}</strong> locations
            </div>
          </div>
        </div>
      </header>

      {activeView === 'globe' ? (
        <section className="mx-auto grid h-[calc(100vh-154px)] w-full max-w-7xl min-h-0 gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="min-h-0 overflow-hidden rounded-lg border border-[#CFC7BA] bg-[#D7EAF1] shadow-sm">
            {token ? (
              <Map
                ref={setMapRef}
                mapboxAccessToken={token}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                projection="globe"
                initialViewState={{ longitude: -77.0369, latitude: 38.9072, zoom: 1.55 }}
                style={{ width: '100%', height: '100%' }}
                interactiveLayerIds={['selected-routes-hit']}
                cursor="grab"
                onLoad={(event) => applyMapAtmosphere(event.target)}
                onClick={() => {
                  setSelectedLocationId(null);
                  setHoveredRouteId(null);
                }}
                onMouseMove={(event) => {
                  if (!mapRef) return;
                  if (!mapRef.getStyle()?.layers?.some((layer) => layer.id === 'selected-routes-hit')) {
                    return;
                  }

                  const features = mapRef.queryRenderedFeatures(event.point, {
                    layers: ['selected-routes-hit'],
                  });
                  const routeId = features[0]?.properties?.id as string | undefined;
                  setHoveredRouteId(routeId ?? null);
                  mapRef.getCanvas().style.cursor = routeId ? 'pointer' : 'grab';
                }}
                onMouseLeave={() => {
                  setHoveredRouteId(null);
                  mapRef?.getCanvas().style.setProperty('cursor', 'grab');
                }}
              >
                <div className="absolute left-3 top-3 z-10 rounded-lg border border-white/70 bg-white/90 p-3 shadow-sm backdrop-blur">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#52605A]">
                    Route modes
                  </h2>
                  <div className="mt-2 grid gap-1.5">
                    {Object.entries(MODE_STYLES).map(([mode, style]) => (
                      <div key={mode} className="flex items-center gap-2 text-xs font-semibold text-[#34413C]">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: style.color }} />
                        {style.label}
                      </div>
                    ))}
                  </div>
                </div>

                {LOCATIONS.map((location) => {
                  const active = selectedLocationId === location.id;

                  return (
                    <Marker
                      key={location.id}
                      longitude={location.coords[0]}
                      latitude={location.coords[1]}
                      anchor="bottom"
                    >
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedLocationId(location.id);
                        }}
                        className={`group relative grid h-8 w-8 place-items-center text-2xl drop-shadow-lg transition ${active
                          ? 'scale-125'
                          : 'hover:scale-125'
                          }`}
                        aria-label={`Select ${location.name}`}
                      >
                        📍
                        <span className="absolute left-1/2 top-9 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#16221F] px-2 py-1 text-xs font-medium text-white shadow-md group-hover:block">
                          {location.name}
                        </span>
                      </button>
                    </Marker>
                  );
                })}

                <Source id="selected-routes" type="geojson" data={routeGeojson as never} />
                <Layer
                  id="selected-routes-line"
                  type="line"
                  source="selected-routes"
                  paint={{
                    'line-color': ['get', 'color'],
                    'line-opacity': 0.88,
                    'line-width': ['case', ['==', ['get', 'id'], hoveredRouteId ?? ''], 6, 4],
                  }}
                />
                <Layer
                  id="selected-routes-hit"
                  type="line"
                  source="selected-routes"
                  paint={{
                    'line-color': '#000000',
                    'line-opacity': 0,
                    'line-width': 18,
                  }}
                />
              </Map>
            ) : (
              <div className="grid h-[560px] place-items-center px-6 text-center text-sm text-[#F3D0C7]">
                Missing NEXT_PUBLIC_MAPBOX_TOKEN
              </div>
            )}
          </div>

          <aside className="min-h-0 overflow-hidden">
            <div className="max-h-full overflow-y-auto rounded-lg border border-[#CFC7BA] bg-[#FDFBF6] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#69746E]">
                    Location
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[#16221F]">
                    {selectedLocation ? locationLabel(selectedLocation) : 'Select a location'}
                  </h2>
                </div>
                {selectedLocation && (
                  <button
                    type="button"
                    onClick={() => setSelectedLocationId(null)}
                    className="rounded-md border border-[#CFC7BA] px-2 py-1 text-xs font-semibold text-[#52605A] hover:bg-[#F0ECE4]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {selectedLocation ? (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#69746E]">
                      Photo
                    </p>
                    <div className="overflow-hidden rounded-md border border-[#DDD5CA] bg-[#EFE8DC]">
                      {selectedLocation.coverPhoto ? (
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={selectedLocation.coverPhoto}
                            alt={selectedLocation.coverCaption ?? selectedLocation.name}
                            fill
                            className="object-cover"
                            sizes="360px"
                          />
                        </div>
                      ) : (
                        <div className="grid aspect-[4/3] place-items-center px-6 text-center text-sm text-[#69746E]">
                          Cover photo pending
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCountry(selectedLocation.country);
                      setSelectedGalleryLocationId(selectedLocation.id);
                      setActiveView('gallery');
                    }}
                    className="w-full rounded-md bg-[#1F5E55] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#174B44]"
                  >
                    View Gallery
                  </button>

                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-[#52605A]">
                  Rotate the globe and choose a pin. Routes stay hidden until a location is selected.
                </p>
              )}
            </div>

          </aside>
        </section>
      ) : (
        <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
          <aside className="rounded-lg border border-[#CFC7BA] bg-[#FDFBF6] p-3 shadow-sm lg:sticky lg:top-5 lg:self-start">
            <h2 className="px-2 pb-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#69746E]">
              Countries
            </h2>
            <div className="space-y-1">
              {countries.map((country) => (
                <button
                  key={country.country}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(country.country);
                    setSelectedGalleryLocationId(null);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${selectedCountry === country.country
                    ? 'bg-[#1F5E55] text-white'
                    : 'text-[#34413C] hover:bg-[#F0ECE4]'
                    }`}
                >
                  <span className="font-semibold">{country.country}</span>
                  <span className="text-xs opacity-80">
                    {country.locations.length} places · {country.photoCount} photos
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-lg border border-[#CFC7BA] bg-[#FDFBF6] shadow-sm">
              <div className="grid gap-0 md:grid-cols-[280px_minmax(0,1fr)]">
                <div className="relative min-h-[220px] bg-[#EFE8DC]">
                  {galleryCountry?.coverPhoto ? (
                    <Image
                      src={galleryCountry.coverPhoto}
                      alt={`${galleryCountry.country} cover`}
                      fill
                      className="object-cover"
                      sizes="280px"
                    />
                  ) : (
                    <div className="grid h-full min-h-[220px] place-items-center px-6 text-center text-sm text-[#69746E]">
                      Country cover pending
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#69746E]">
                    Country gallery
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#16221F]">
                    {galleryCountry?.country}
                  </h2>
                  <div className="mt-4 grid gap-3 text-sm text-[#52605A] sm:grid-cols-3">
                    <div>
                      <strong className="block text-lg text-[#1C2A26]">
                        {galleryCountry?.locations.length ?? 0}
                      </strong>
                      locations
                    </div>
                    <div>
                      <strong className="block text-lg text-[#1C2A26]">
                        {galleryCountry?.photoCount ?? 0}
                      </strong>
                      photos
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#CFC7BA] bg-[#FDFBF6] p-4 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#69746E]">
                    Places
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[#16221F]">
                    {galleryCountry?.country} album
                  </h3>
                </div>
                <span className="text-sm text-[#52605A]">
                  {galleryCountry?.locations.length ?? 0} places
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGalleryLocationId(null)}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold shadow-sm transition ${selectedGalleryLocationId === null
                    ? 'border-[#1F5E55] bg-[#1F5E55] text-white'
                    : 'border-[#CFC7BA] bg-white text-[#34413C] hover:bg-[#F0ECE4]'
                    }`}
                >
                  All photos
                </button>
                {galleryCountry?.locations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => setSelectedGalleryLocationId(location.id)}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold shadow-sm transition ${selectedGalleryLocationId === location.id
                      ? 'border-[#1F5E55] bg-[#1F5E55] text-white'
                      : 'border-[#CFC7BA] bg-white text-[#34413C] hover:bg-[#F0ECE4]'
                      }`}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#CFC7BA] bg-[#FDFBF6] p-4 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#69746E]">
                    Photos
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[#16221F]">
                    Country album photos
                  </h3>
                </div>
                <span className="text-sm text-[#52605A]">
                  {galleryPhotos.length} photos
                </span>
              </div>

              {galleryPhotos.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryPhotos.map((photo) => (
                    <button
                      key={`${photo.locationId ?? 'country'}-${photo.src}`}
                      type="button"
                      onClick={() => setExpandedPhotoIndex(galleryPhotos.indexOf(photo))}
                      className="group overflow-hidden rounded-lg border border-[#DDD5CA] bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative aspect-[4/3] bg-[#EFE8DC]">
                        <Image
                          src={photo.src}
                          alt={photo.caption}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-[#101816]/0 transition group-hover:bg-[#101816]/20">
                          <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-md border border-white/70 bg-white/90 text-2xl font-semibold leading-none text-[#16221F] opacity-0 shadow-sm transition group-hover:opacity-100">
                            ↗
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                        <span className="font-semibold text-[#16221F]">{photo.caption}</span>
                        {photo.locationName && (
                          <span className="text-xs text-[#69746E]">{photo.locationName}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-md border border-dashed border-[#CFC7BA] px-3 py-6 text-sm text-[#69746E]">
                  Add photos to this country album and they will appear here.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {expandedPhoto && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#101816]/90 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={expandedPhoto.caption}
          onClick={() => setExpandedPhotoIndex(null)}
        >
          <div
            className="relative flex h-full w-full max-w-6xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3 text-white">
              <div>
                <h2 className="text-lg font-semibold">{expandedPhoto.caption}</h2>
                {expandedPhoto.locationName && (
                  <p className="text-sm text-white/70">{expandedPhoto.locationName}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setExpandedPhotoIndex(null)}
                className="rounded-md border border-white/30 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-black">
              <Image
                src={expandedPhoto.src}
                alt={expandedPhoto.caption}
                fill
                className="object-contain"
                sizes="100vw"
              />

              {galleryPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedPhotoIndex((current) =>
                        current === null
                          ? current
                          : (current - 1 + galleryPhotos.length) % galleryPhotos.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-[#16221F] shadow-sm hover:bg-white"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedPhotoIndex((current) =>
                        current === null ? current : (current + 1) % galleryPhotos.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-[#16221F] shadow-sm hover:bg-white"
                  >
                    Next
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
