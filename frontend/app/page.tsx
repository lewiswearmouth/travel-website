// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useMemo, useEffect } from 'react';

import { AIRPORTS } from '@/lib/airports';
import { TRIPS } from '@/lib/flights';
import { haversineDistance } from '@/lib/distances';
import { defaultEngineForDistance } from '@/lib/default_engine';

import { Source, Layer, Marker, MapRef } from '@vis.gl/react-mapbox';

const ENGINE_COLORS: Record<string, string> = {
  "Trent XWB-84": "#4C8AFF",
  "Trent 7000": "#FF8C42",
  "Pearl 15": "#42D77D",
  "AE 3007": "#CC66FF",
};

type OptimizerData = {
  optimalAssignments: Record<string, string>;
  totals?: any;
  insights?: any;
};

const Map = dynamic(() => import('@vis.gl/react-mapbox').then(m => m.Map), {
  ssr: false,
});

function EngineLegend() {
  const items = [
    { name: "Trent XWB-84", color: "#4C8AFF" },
    { name: "Trent 7000", color: "#FF8C42" },
    { name: "Pearl 15", color: "#42D77D" },
    { name: "AE 3007", color: "#CC66FF" },
  ];

  return (
    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-[#181D4E] text-xs space-y-1 z-50">
      <div className="font-semibold text-[#C0C6D9] mb-1">Engine Types</div>
      {items.map(item => (
        <div key={item.name} className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          ></span>
          <span className="text-[#C0C6D9]">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeAirport, setActiveAirport] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mapRef, setMapRef] = useState<MapRef | null>(null);
  const [showEngines, setShowEngines] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);

  // backend optimization state
  const [optimizerData, setOptimizerData] = useState<OptimizerData | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optError, setOptError] = useState<string | null>(null);

  // 🔄 Phase for glow pulse (0 → 1 → 0 smoothly)
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 0.02) % 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 🔘 Backend call for optimized routes
  const handleToggleOptimized = async () => {
    if (!showEngines) return;

    // if we have cached data already just toggle the view
    if (optimizerData) {
      setShowOptimized(prev => !prev);
      return;
    }

    try {
      setIsOptimizing(true);
      setOptError(null);

      const res = await fetch('http://localhost:3001/api/optimizer-cached');

      if (!res.ok) {
        throw new Error(`Backend failed with ${res.status}`);
      }

      const data = await res.json();
      console.log("Loaded cached optimizer result:", data);

      // Normalize optimalAssignments to a { "ORIG-DEST": "Engine" } map
      let mappedAssignments: Record<string, string> = {};

      if (Array.isArray(data.optimalAssignments)) {
        data.optimalAssignments.forEach((r: any) => {
          if (r.origin && r.destination && r.engine) {
            const key = `${r.origin}-${r.destination}`;
            mappedAssignments[key] = r.engine;
          }
        });
      } else if (data.optimalAssignments) {
        // already a map
        mappedAssignments = data.optimalAssignments;
      }

      setOptimizerData({
        ...data,
        optimalAssignments: mappedAssignments,
      });

      setShowOptimized(true); // show optimized immediately

    } catch (err) {
      console.error(err);
      setOptError("Failed to load cached optimized data");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Build arcs for flights involving selected airport
  const airportRoutes = useMemo(() => {
    if (!activeAirport) return [];

    return TRIPS.map((f, index) => {
      if (f.origin !== activeAirport && f.destination !== activeAirport) {
        return null;
      }

      const c1 = AIRPORTS[f.origin]?.coords;
      const c2 = AIRPORTS[f.destination]?.coords;
      if (!c1 || !c2) return null;

      const distanceKm = haversineDistance(c1, c2);
      const routeId = `${f.origin}-${f.destination}`;

      // 1) Baseline engine: purely distance-based
      const baselineEngine = defaultEngineForDistance(distanceKm);

      // 2) Optimized engine: only use backend if it gave us one for this route
      const optimizedEngine =
        optimizerData?.optimalAssignments?.[routeId] ?? baselineEngine;

      // 3) What the map actually shows
      const engine =
        showEngines && showOptimized ? optimizedEngine : baselineEngine;

      // 4) Did this route *actually* change?
      const changed = baselineEngine !== optimizedEngine;

      const engineColor = showEngines
        ? ENGINE_COLORS[engine] || '#42D9F4'
        : '#42D9F4';

      return {
        type: 'Feature',
        id: index,
        geometry: { type: 'LineString', coordinates: [c1, c2] },
        properties: {
          origin: f.origin,
          destination: f.destination,
          distanceKm,
          engine,
          engineColor,
          changed,
        },
      };
    }).filter(Boolean);
  }, [activeAirport, showEngines, showOptimized, optimizerData]);

  const geojson = useMemo(
    () => ({ type: 'FeatureCollection', features: airportRoutes as any }),
    [airportRoutes]
  );

  // Changed-only dataset for glow layer
  const changedGeojson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: (airportRoutes as any).filter((f: any) => f.properties.changed),
    }),
    [airportRoutes]
  );

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0A0F2D] text-[#C0C6D9] p-6">
      <h1 className="text-3xl font-bold mb-4">Travel Map ✈️</h1>

      <div className="flex gap-3 mb-3">
        <button
          onClick={() => setShowEngines((p) => !p)}
          className="px-3 py-1 border border-[#181D4E] rounded-lg text-sm hover:bg-[#181D4E]"
        >
          {showEngines ? 'Hide Engines' : 'Show Engines'}
        </button>

        <button
          onClick={handleToggleOptimized}
          disabled={!showEngines || isOptimizing}
          className={`px-3 py-1 border border-[#181D4E] rounded-lg text-sm hover:bg-[#181D4E]
            ${(!showEngines || isOptimizing) ? 'opacity-40 cursor-not-allowed' : ''}
          `}
        >
          {isOptimizing
            ? 'Optimizing...'
            : showOptimized
              ? 'Hide Optimized Routes'
              : 'Show Optimized Routes'}
        </button>
      </div>

      {optError && (
        <div className="text-red-400 text-xs mb-2">
          {optError}
        </div>
      )}

      <div className="w-full max-w-5xl h-[450px] rounded-xl overflow-hidden border border-[#181D4E]">
        {token ? (
          <Map
            ref={setMapRef}
            interactiveLayerIds={['airport-routes-base', 'airport-routes-glow']}
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

              const features = mapRef.queryRenderedFeatures(event.point, {
                layers: ['airport-routes-base'],
              });

              // not over a route → clear hover, keep pointer
              if (!features.length) {
                if (hoveredId !== null) {
                  mapRef.setFeatureState(
                    { source: 'airport-routes', id: hoveredId },
                    { hover: false }
                  );
                  setHoveredId(null);
                }
                if (mapRef.getCanvas) {
                  mapRef.getCanvas().style.cursor = 'pointer';
                }
                return;
              }

              const feature = features[0];
              const id = feature.id as number;

              // over a route → pointer
              if (mapRef.getCanvas) {
                mapRef.getCanvas().style.cursor = 'pointer';
              }

              if (hoveredId !== id) {
                if (hoveredId !== null) {
                  mapRef.setFeatureState(
                    { source: 'airport-routes', id: hoveredId },
                    { hover: false }
                  );
                }
                mapRef.setFeatureState(
                  { source: 'airport-routes', id },
                  { hover: true }
                );
                setHoveredId(id);
              }
            }}
          >
            {/* 📍 Airport Pins */}
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

            {/* ✈ Base Route Layer */}
            <Source id="airport-routes" type="geojson" data={geojson as any} />

            <Layer
              id="airport-routes-base"
              type="line"
              source="airport-routes"
              paint={{
                'line-width': [
                  'case',
                  ['==', ['feature-state', 'hover'], true],
                  6,
                  4,
                ],
                'line-color': [
                  'case',
                  ['==', ['feature-state', 'hover'], true],
                  '#C0C6D9',
                  ['get', 'engineColor'],
                ],
                'line-opacity': 0.9,
              }}
            />

            {/* ✨ Glow Pulse Layer for Changed Routes */}
            {showEngines && showOptimized && (
              <>
                <Source
                  id="changed-routes"
                  type="geojson"
                  data={changedGeojson as any}
                />
                <Layer
                  id="airport-routes-glow"
                  type="line"
                  source="changed-routes"
                  paint={{
                    'line-width': 7,
                    'line-color': [
                      'interpolate',
                      ['linear'],
                      phase,
                      0,
                      '#ffffff',
                      0.5,
                      '#ffff99',
                      1,
                      '#ffffff',
                    ],
                    'line-opacity': [
                      'interpolate',
                      ['linear'],
                      phase,
                      0,
                      0.0,
                      0.5,
                      0.8,
                      1,
                      0.0,
                    ],
                  }}
                />
              </>
            )}

            {/* Tooltip */}
            {hoveredId !== null && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none z-50">
                {(() => {
                  const feature = (airportRoutes as any).find(
                    (f: any) => f?.id === hoveredId
                  );
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

            {showEngines && <EngineLegend />}
          </Map>

        ) : (
          <div className="flex items-center justify-center h-full text-sm text-red-300">
            Missing NEXT_PUBLIC_MAPBOX_TOKEN
          </div>

        )}
      </div>
      {optimizerData && showOptimized && (
        <div className="w-full max-w-5xl mt-4 bg-[#111631] text-[#C0C6D9] p-4 rounded-xl border border-[#181D4E] shadow-lg">
          <h2 className="text-xl font-bold mb-3">Optimization Summary</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-[#0D1328] p-3 rounded-lg border border-[#181D4E]">
              <div className="opacity-70">Worst Case Emissions</div>
              <div className="text-lg font-semibold">
                {optimizerData.totals.worstCaseTotalEmissionsKg?.toLocaleString()} kg CO₂
              </div>
            </div>

            <div className="bg-[#0D1328] p-3 rounded-lg border border-[#181D4E]">
              <div className="opacity-70">Optimized Emissions</div>
              <div className="text-lg font-semibold text-green-400">
                {optimizerData.totals.optimizedTotalEmissionsKg?.toLocaleString()} kg CO₂
              </div>
            </div>

            <div className="bg-[#0D1328] p-3 rounded-lg border border-[#181D4E]">
              <div className="opacity-70">Total Reduction</div>
              <div className="text-lg font-semibold text-yellow-300">
                {optimizerData.totals.absoluteReductionKg?.toLocaleString()} kg
              </div>
            </div>

            <div className="bg-[#0D1328] p-3 rounded-lg border border-[#181D4E]">
              <div className="opacity-70">% Reduction</div>
              <div className="text-lg font-semibold text-blue-300">
                {optimizerData.totals.percentageReduction?.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}