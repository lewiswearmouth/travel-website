// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useMemo } from 'react';

import { AIRPORTS } from '@/lib/airports';
import { TRIPS } from '@/lib/flights';
import { haversineDistance } from '@/lib/distances';
import { defaultEngineForDistance } from '@/lib/default_engine';

import { Source, Layer, Marker, MapRef } from '@vis.gl/react-mapbox';

const Map = dynamic(() => import('@vis.gl/react-mapbox').then(m => m.Map), {
  ssr: false,
});

export default function Home() {
  const [activeAirport, setActiveAirport] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mapRef, setMapRef] = useState<MapRef | null>(null);

  // Build arcs for flights involving the selected airport
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

      const distanceKm = haversineDistance(c1, c2);
      const engine = defaultEngineForDistance(distanceKm);

      return {
        type: "Feature",
        id: index,
        geometry: { type: "LineString", coordinates: [c1, c2] },
        properties: {
          origin: f.origin,
          destination: f.destination,
          distanceKm,
          engine
        }
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

  // 🖱️ Cursor behavior handlers
  const handleMouseDown = () => {
    if (mapRef?.getCanvas) {
      mapRef.getCanvas().style.cursor = "grabbing";
    }
  };

  const handleMouseUp = () => {
    if (mapRef?.getCanvas) {
      mapRef.getCanvas().style.cursor = hoveredId !== null ? "pointer" : "grab";
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0A0F2D] text-[#C0C6D9] p-6">
      <h1 className="text-3xl font-bold mb-4 text-[#C0C6D9]">Travel Map ✈️</h1>

      <div className="w-full max-w-5xl h-[450px] mb-6 rounded-xl overflow-hidden border border-[#181D4E]">
        {token ? (
          <Map
            ref={ref => setMapRef(ref)}
            interactiveLayerIds={['airport-routes-line']}
            mapboxAccessToken={token}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            initialViewState={{ longitude: 0, latitude: 20, zoom: 1.2 }}
            style={{ width: '100%', height: '100%' }}
            cursor="pointer"

            // 👇 cursor becomes grabbing only during drag
            onMouseDown={() => {
              if (mapRef?.getCanvas) mapRef.getCanvas().style.cursor = "grabbing";
            }}
            onMouseUp={() => {
              if (mapRef?.getCanvas) mapRef.getCanvas().style.cursor = "pointer";
            }}

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
                  <div className="text-2xl hover:scale-125 transition">📍</div>

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

            {/* ✈️ Arcs */}
            <Source id="airport-routes" type="geojson" data={geojson as any} />
            <Layer
              id="airport-routes-line"
              type="line"
              source="airport-routes"
              paint={{
                "line-width": [
                  "case",
                  ["==", ["feature-state", "hover"], true],
                  7,
                  4
                ],
                "line-color": [
                  "case",
                  ["==", ["feature-state", "hover"], true],
                  "#C0C6D9",
                  "#42D9F4"
                ],
                "line-opacity": 0.9
              }}
            />

            {/* 🏷️ Hover Tooltip */}
            {hoveredId !== null && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2
                  bg-black/80 text-white text-xs px-3 py-2 rounded-lg shadow-lg
                  pointer-events-none z-50">
                {(() => {
                  const feature = (airportRoutes as any).find((f: any) => f?.id === hoveredId);
                  if (!feature) return null;
                  const p = feature.properties;
                  return (
                    <div className="text-center space-y-0.5">
                      <div className="font-bold text-sm">{p.origin} → {p.destination}</div>
                      <div>{p.distanceKm} km</div>
                      <div className="opacity-80">Engine: {p.engine}</div>
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
    </main>
  );
}