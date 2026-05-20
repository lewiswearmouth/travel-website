'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Map as MapboxMap } from 'mapbox-gl';
import { useMemo, useState } from 'react';

import { Layer, MapRef, Marker, Source } from '@vis.gl/react-mapbox';

import {
  JOURNEYS,
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

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('globe');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('Spain');
  const [detailsExpanded, setDetailsExpanded] = useState(false);
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
        photoCount: locations.reduce(
          (count, location) =>
            count + location.visits.reduce((visitCount, visit) => visitCount + visit.photos.length, 0),
          0
        ),
        coverPhoto: locations.find((location) => location.coverPhoto)?.coverPhoto,
      }))
      .sort((a, b) => a.country.localeCompare(b.country));
  }, []);

  const galleryCountry =
    countries.find((country) => country.country === selectedCountry) ?? countries[0];

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
                A small collection of my travels
              </h1>
            </div>

            <div className="grid w-full grid-cols-2 rounded-lg border border-[#CFC7BA] bg-white p-1 shadow-sm md:w-[280px]">
              {(['globe', 'gallery'] as ActiveView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setActiveView(view)}
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
                initialViewState={{ longitude: 18, latitude: 24, zoom: 1.35 }}
                style={{ width: '100%', height: '100%' }}
                interactiveLayerIds={['selected-routes-hit']}
                cursor="grab"
                onLoad={(event) => applyMapAtmosphere(event.target)}
                onClick={() => {
                  setSelectedLocationId(null);
                  setDetailsExpanded(false);
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
                          setDetailsExpanded(false);
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
                    {selectedLocation ? selectedLocation.name : 'Select a location'}
                  </h2>
                </div>
                {selectedLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocationId(null);
                      setDetailsExpanded(false);
                    }}
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
                      setActiveView('gallery');
                    }}
                    className="w-full rounded-md bg-[#1F5E55] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#174B44]"
                  >
                    View Gallery
                  </button>

                  <div className="rounded-md border border-[#E0D8CC] bg-white p-3">
                    <div className="space-y-1 text-sm text-[#52605A]">
                      <div className="font-semibold text-[#1C2A26]">{selectedLocation.country}</div>
                      <div>{selectedLocation.visitMonth}</div>
                      <div>{selectedRoutes.length} connected routes</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDetailsExpanded((expanded) => !expanded)}
                      className="mt-3 w-full rounded-md border border-[#CFC7BA] px-3 py-2 text-sm font-semibold text-[#34413C] hover:bg-[#F0ECE4]"
                    >
                      {detailsExpanded ? 'Hide details' : 'Expand details'}
                    </button>

                    {detailsExpanded && (
                      <div className="mt-3 space-y-2">
                        {selectedRoutes.map((route) => (
                          <div
                            key={route.id}
                            className="flex items-start gap-3 rounded-md border border-[#E0D8CC] bg-[#FDFBF6] px-3 py-2"
                          >
                            <span
                              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: MODE_STYLES[route.mode].color }}
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-[#1C2A26]">{routeLabel(route)}</div>
                              <div className="text-xs text-[#69746E]">
                                {MODE_STYLES[route.mode].label}
                                {route.month ? ` · ${route.month}` : ''}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                  onClick={() => setSelectedCountry(country.country)}
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
                      curated photos
                    </div>
                    <div>
                      <strong className="block text-lg text-[#1C2A26]">
                        {
                          JOURNEYS.filter((journey) =>
                            journey.countries.includes(galleryCountry?.country ?? '')
                          ).length
                        }
                      </strong>
                      journeys
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {galleryCountry?.locations.map((location) => {
                const photos = location.visits.flatMap((visit) => visit.photos);

                return (
                  <article
                    key={location.id}
                    className="overflow-hidden rounded-lg border border-[#CFC7BA] bg-[#FDFBF6] shadow-sm"
                  >
                    <div className="relative aspect-[16/10] bg-[#EFE8DC]">
                      {location.coverPhoto ? (
                        <Image
                          src={location.coverPhoto}
                          alt={location.coverCaption ?? location.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="grid h-full place-items-center px-6 text-center text-sm text-[#69746E]">
                          Cover photo pending
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-[#16221F]">{location.name}</h3>
                          <p className="mt-1 text-sm text-[#52605A]">{location.visitMonth}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLocationId(location.id);
                            setActiveView('globe');
                          }}
                          className="rounded-md border border-[#CFC7BA] px-3 py-1.5 text-xs font-semibold text-[#34413C] hover:bg-[#F0ECE4]"
                        >
                          Map
                        </button>
                      </div>

                      {photos.length > 0 ? (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {photos.map((photo) => (
                            <div key={photo.src} className="relative aspect-square overflow-hidden rounded-md">
                              <Image
                                src={photo.src}
                                alt={photo.caption}
                                fill
                                className="object-cover"
                                sizes="140px"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-md border border-dashed border-[#CFC7BA] px-3 py-4 text-sm text-[#69746E]">
                          Photos can be added manually under this location without changing the data model.
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
