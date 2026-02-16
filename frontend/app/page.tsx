'use client';

import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useMemo } from 'react';

import { AIRPORTS } from '@/lib/airports';
import { TRIPS } from '@/lib/flights';
import { haversineDistance } from '@/lib/distances';

import { Source, Layer, Marker, MapRef } from '@vis.gl/react-mapbox';
import Image from 'next/image';
import { getPhotosForAirport, getCityForAirport } from "@/lib/photoIndex.generated";

const Map = dynamic(() => import('@vis.gl/react-mapbox').then((m) => m.Map), {
  ssr: false,
});

export default function Home() {
  const [activeAirport, setActiveAirport] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mapRef, setMapRef] = useState<MapRef | null>(null);

  // Build routes for flights involving selected airport
  const airportRoutes = useMemo(() => {
    if (!activeAirport) return [];

    return TRIPS.map((f, index) => {
      if (f.origin !== activeAirport && f.destination !== activeAirport) return null;

      const c1 = AIRPORTS[f.origin]?.coords;
      const c2 = AIRPORTS[f.destination]?.coords;
      if (!c1 || !c2) return null;

      const distanceKm = haversineDistance(c1, c2);

      return {
        type: 'Feature',
        id: index,
        geometry: {
          type: 'LineString',
          coordinates: [c1, c2],
        },
        properties: {
          origin: f.origin,
          destination: f.destination,
          distanceKm: Math.round(distanceKm),
        },
      };
    }).filter(Boolean);
  }, [activeAirport]);

  const geojson = useMemo(
    () => ({ type: 'FeatureCollection', features: airportRoutes as any }),
    [airportRoutes]
  );

  const photos = useMemo(() => {
    if (!activeAirport) return [];
    return getPhotosForAirport(activeAirport);
  }, [activeAirport]);

  const activeCity = useMemo(() => {
    if (!activeAirport) return null;
    return getCityForAirport(activeAirport);
  }, [activeAirport]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0A0F2D] text-[#C0C6D9] p-6">
      <h1 className="text-3xl font-bold mb-4">Travel Map ✈️</h1>

      <div className="w-full max-w-6xl mt-2">
        <div className="rounded-xl overflow-hidden border border-[#181D4E] w-full h-[500px]">
          {token ? (
            <Map
              ref={setMapRef}
              interactiveLayerIds={['airport-routes-base']}
              mapboxAccessToken={token}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              initialViewState={{ longitude: -80, latitude: 40, zoom: 1.2 }}
              style={{ width: '100%', height: '100%' }}
              cursor="pointer"
              onClick={() => setActiveAirport(null)}
              onMouseDown={() => {
                if (mapRef?.getCanvas) {
                  mapRef.getCanvas().style.cursor = 'grabbing';
                }
              }}
              onMouseUp={() => {
                if (mapRef?.getCanvas) {
                  mapRef.getCanvas().style.cursor = 'pointer';
                }
              }}
              onMouseMove={(event) => {
                if (!mapRef) return;

                if (!mapRef.getStyle()?.layers?.some((l) => l.id === 'airport-routes-base')) {
                  return;
                }

                const features = mapRef.queryRenderedFeatures(event.point, {
                  layers: ['airport-routes-base'],
                });

                // not over a route → clear hover
                if (!features.length) {
                  if (hoveredId !== null) {
                    mapRef.setFeatureState({ source: 'airport-routes', id: hoveredId }, { hover: false });
                    setHoveredId(null);
                  }
                  if (mapRef.getCanvas) {
                    mapRef.getCanvas().style.cursor = 'pointer';
                  }
                  return;
                }

                const feature = features[0];
                const id = feature.id as number;

                if (mapRef.getCanvas) {
                  mapRef.getCanvas().style.cursor = 'pointer';
                }

                if (hoveredId !== id) {
                  if (hoveredId !== null) {
                    mapRef.setFeatureState({ source: 'airport-routes', id: hoveredId }, { hover: false });
                  }
                  mapRef.setFeatureState({ source: 'airport-routes', id }, { hover: true });
                  setHoveredId(id);
                }
              }}
            >
              {/* 📍 Airport Pins */}
              {Object.entries(AIRPORTS).map(([code, ap]) => (
                <Marker key={code} longitude={ap.coords[0]} latitude={ap.coords[1]} anchor="bottom">
                  <div
                    className="relative cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAirport(code);
                    }}
                  >
                    <div className="text-2xl hover:scale-125 transition">📍</div>
                    {activeAirport === code && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 mt-1
                        px-2 py-1 bg-black/70 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none"
                      >
                        {ap.name} ({code})
                      </div>
                    )}
                  </div>
                </Marker>
              ))}

              {/* ✈ Routes */}
              <Source id="airport-routes" type="geojson" data={geojson as any} />

              <Layer
                id="airport-routes-base"
                type="line"
                source="airport-routes"
                paint={{
                  'line-width': ['case', ['==', ['feature-state', 'hover'], true], 6, 4],
                  'line-color': ['case', ['==', ['feature-state', 'hover'], true], '#C0C6D9', '#4C8AFF'],
                  'line-opacity': 0.9,
                }}
              />

              {/* Tooltip */}
              {hoveredId !== null && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none z-50">
                  {(() => {
                    const feature = (airportRoutes as any).find((f: any) => f?.id === hoveredId);
                    if (!feature) return null;
                    const p = feature.properties;
                    return (
                      <div className="text-center space-y-0.5">
                        <div className="font-bold text-sm">
                          {p.origin} → {p.destination}
                        </div>
                        <div>{p.distanceKm} km</div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </Map>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-red-300">
              Missing NEXT_PUBLIC_MAPBOX_TOKEN
            </div>
          )}
        </div>

        {/* ✅ FIXED WRAPPER HERE */}
        {activeAirport && (
          <div className="w-full mt-6">
            <div className="rounded-xl border border-[#181D4E] bg-[#0B1238] p-4">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold">{activeCity ?? 'Unknown city'} — Photos</h2>
                <div className="text-xs text-[#9AA3BC]">Click another pin to switch</div>
              </div>

              {photos.length === 0 ? (
                <div className="mt-3 text-sm text-[#9AA3BC]">No photos added yet for this city.</div>
              ) : (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {photos.map((p, i) => (
                    <div
                      key={p.src + i}
                      className="rounded-lg overflow-hidden border border-[#181D4E] bg-black/20"
                    >
                      <div className="relative w-full aspect-square">
                        <Image
                          src={p.src}
                          alt={p.caption ?? 'travel photo'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>

                      {(p.caption || p.date) && (
                        <div className="p-2 text-xs text-[#C0C6D9]">
                          {p.caption && <div className="font-medium">{p.caption}</div>}
                          {p.date && <div className="text-[#9AA3BC]">{p.date}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}