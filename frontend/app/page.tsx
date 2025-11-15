// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useMemo } from 'react';

import { AIRPORTS } from '@/lib/airports';
import { TRIPS } from '@/lib/flights';

import { Source, Layer, Marker, Popup, MapRef } from '@vis.gl/react-mapbox';

const Map = dynamic(() => import('@vis.gl/react-mapbox').then(m => m.Map), {
  ssr: false,
});

export default function Home() {
  const [activeAirport, setActiveAirport] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const [mapRef, setMapRef] = useState<MapRef | null>(null);

  // Build arcs for all flights involving selected airport
  const airportRoutes = useMemo(() => {
    if (!activeAirport) return [];

    return TRIPS.map((f, index) => {
      if (
        f.origin !== activeAirport &&
        f.destination !== activeAirport
      ) return null;

      const c1 = AIRPORTS[f.origin]?.coords;
      const c2 = AIRPORTS[f.destination]?.coords;
      if (!c1 || !c2) return null;

      return {
        type: "Feature",
        id: index,
        geometry: { type: "LineString", coordinates: [c1, c2] },
        properties: {
          origin: f.origin,
          destination: f.destination
        },
      };
    }).filter(Boolean);
  }, [activeAirport]);

  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: airportRoutes as any,
    }),
    [airportRoutes]
  );

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <main className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Travel Map ✈️</h1>

      <div className="w-full max-w-5xl h-[450px] mb-6 rounded-xl overflow-hidden border border-slate-700">
        {token ? (
          <Map
            ref={ref => setMapRef(ref)}
            interactiveLayerIds={['airport-routes-line']}
            mapboxAccessToken={token}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            initialViewState={{ longitude: 0, latitude: 20, zoom: 1.2 }}
            style={{ width: '100%', height: '100%' }}
            onClick={() => setActiveAirport(null)}
            onMouseMove={(event) => {
              if (!mapRef) return;

              const features = mapRef.queryRenderedFeatures(event.point, {
                layers: ['airport-routes-line']
              });

              // Remove highlight when not over arc
              if (!features.length) {
                if (hoveredId !== null) {
                  mapRef.setFeatureState(
                    { source: 'airport-routes', id: hoveredId },
                    { hover: false }
                  );
                  setHoveredId(null);
                }
                return;
              }

              const feature = features[0];
              const id = feature.id as number;

              if (hoveredId !== id) {
                // unhover previous
                if (hoveredId !== null) {
                  mapRef.setFeatureState(
                    { source: 'airport-routes', id: hoveredId },
                    { hover: false }
                  );
                }

                // hover new
                mapRef.setFeatureState(
                  { source: 'airport-routes', id },
                  { hover: true }
                );

                setHoveredId(id);
              }
            }}
          >

            {/* 📍 Emoji Pins */}
            {Object.entries(AIRPORTS).map(([code, ap]) => (
              <Marker
                key={code}
                longitude={ap.coords[0]}
                latitude={ap.coords[1]}
                anchor="bottom"
              >
                <div
                  className="relative cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveAirport(code);
                  }}
                >
                  {/* Pin */}
                  <div className="text-2xl hover:scale-125 transition">
                    📍
                  </div>

                  {/* Floating label (absolute, so it doesn’t push anything!) */}
                  {activeAirport === code && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1
                      px-2 py-1 bg-black/70 text-white text-xs
                      rounded shadow-lg whitespace-nowrap
                      pointer-events-none">
                      {ap.name} <span className="opacity-70">({code})</span>
                    </div>
                  )}
                </div>
              </Marker>
            ))}

            {/* Arcs */}
            <Source id="airport-routes" type="geojson" data={geojson as any} />
            <Layer
              id="airport-routes-line"
              type="line"
              source="airport-routes"
              paint={{
                "line-width": [
                  "case",
                  ["==", ["feature-state", "hover"], true],
                  5,
                  3
                ],
                "line-color": [
                  "case",
                  ["==", ["feature-state", "hover"], true],
                  "#FFEA00", // yellow
                  "#00E0FF"  // cyan
                ],
                "line-opacity": 0.9
              }}
            />

          </Map>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-red-300">
            Missing NEXT_PUBLIC_MAPBOX_TOKEN
          </div>
        )}
      </div>
    </main>
  );
}