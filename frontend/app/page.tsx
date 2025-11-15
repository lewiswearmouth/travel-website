// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useMemo } from 'react';

import { AIRPORTS } from '@/lib/airports';
import { Source, Layer, Marker, Popup, MapRef } from '@vis.gl/react-mapbox';

const Map = dynamic(() => import('@vis.gl/react-mapbox').then(m => m.Map), {
  ssr: false,
});

type Flight = {
  origin: string;
  destination: string;
  distance?: number;
  summary?: string;
};

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [form, setForm] = useState({ origin: '', destination: '' });
  const [loading, setLoading] = useState(false);

  // Airport currently clicked
  const [activeAirport, setActiveAirport] = useState<string | null>(null);

  // Hovered arc id
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Map reference (for highlight API)
  const [mapRef, setMapRef] = useState<MapRef | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/insight`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      setFlights(prev => [...prev, { ...form, summary: data.summary }]);
      setForm({ origin: '', destination: '' });
    } finally {
      setLoading(false);
    }
  }

  // Build all arcs related to selected airport
  const airportRoutes = useMemo(() => {
    if (!activeAirport) return [];

    return flights
      .filter(
        f => f.origin === activeAirport || f.destination === activeAirport
      )
      .map((f, index) => {
        const c1 = AIRPORTS[f.origin]?.coords;
        const c2 = AIRPORTS[f.destination]?.coords;
        if (!c1 || !c2) return null;

        return {
          type: 'Feature',
          id: index, // needed for hover highlighting
          geometry: { type: 'LineString', coordinates: [c1, c2] },
          properties: {
            origin: f.origin,
            destination: f.destination,
          },
        };
      })
      .filter(Boolean);
  }, [activeAirport, flights]);

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

      {/* Add Flight Form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-6 bg-slate-800 p-4 rounded-xl shadow-lg"
      >
        <input
          type="text"
          placeholder="Origin (IATA)"
          value={form.origin}
          onChange={e =>
            setForm({ ...form, origin: e.target.value.toUpperCase() })
          }
          className="p-2 rounded text-black"
          required
        />
        <input
          type="text"
          placeholder="Destination (IATA)"
          value={form.destination}
          onChange={e =>
            setForm({ ...form, destination: e.target.value.toUpperCase() })
          }
          className="p-2 rounded text-black"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
        >
          {loading ? 'Generating...' : 'Add Flight'}
        </button>
      </form>

      {/* Map */}
      <div className="w-full max-w-5xl h-[450px] mb-6 rounded-xl overflow-hidden border border-slate-700">
        {token ? (
          <Map
            ref={ref => setMapRef(ref)}
            interactiveLayerIds={['airport-routes-line']}
            mapboxAccessToken={token}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            initialViewState={{ longitude: 0, latitude: 20, zoom: 1.2 }}
            style={{ width: '100%', height: '100%' }}
            onMouseMove={event => {
              if (!mapRef) return;

              const features = mapRef.queryRenderedFeatures(event.point, {
                layers: ['airport-routes-line'],
              });

              if (!features.length) {
                // remove hover when not over any route
                if (hoveredId !== null) {
                  mapRef.setFeatureState(
                    { source: 'airport-routes', id: hoveredId },
                    { hover: false }
                  );
                  setHoveredId(null);
                }
                return;
              }

              // new hovered feature
              const feature = features[0];
              const id = feature.id as number;

              if (hoveredId !== id) {
                // turn off old hover
                if (hoveredId !== null) {
                  mapRef.setFeatureState(
                    { source: 'airport-routes', id: hoveredId },
                    { hover: false }
                  );
                }

                // turn on new hover
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
                  onClick={e => {
                    e.stopPropagation();
                    setActiveAirport(code);
                  }}
                  className="text-2xl cursor-pointer hover:scale-125 transition"
                >
                  📍
                </div>
              </Marker>
            ))}

            {/* Popup for selected airport */}
            {activeAirport && (
              <Popup
                longitude={AIRPORTS[activeAirport].coords[0]}
                latitude={AIRPORTS[activeAirport].coords[1]}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setActiveAirport(null)}
              >
                <div className="text-black w-56">
                  <h2 className="font-bold text-lg mb-1">
                    {AIRPORTS[activeAirport].name}
                  </h2>
                  <p className="text-sm text-gray-700 mb-2">
                    ({activeAirport})
                  </p>

                  <p className="font-semibold mb-1">
                    Trips involving this airport:
                  </p>

                  <ul className="text-sm space-y-1">
                    {flights
                      .filter(
                        f =>
                          f.origin === activeAirport ||
                          f.destination === activeAirport
                      )
                      .map((f, idx) => (
                        <li key={idx} className="text-gray-800">
                          {f.origin} → {f.destination}
                        </li>
                      ))}
                  </ul>
                </div>
              </Popup>
            )}

            {/* Arc routes */}
            <Source id="airport-routes" type="geojson" data={geojson as any} />

            <Layer
              id="airport-routes-line"
              type="line"
              source="airport-routes"
              paint={{
                'line-width': [
                  'case',
                  ['==', ['feature-state', 'hover'], true],
                  5, // thicker on hover
                  3,
                ],
                'line-color': [
                  'case',
                  ['==', ['feature-state', 'hover'], true],
                  '#FFEA00', // yellow on hover
                  '#00E0FF', // cyan default
                ],
                'line-opacity': 0.9,
              }}
            />
          </Map>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-red-300">
            Missing NEXT_PUBLIC_MAPBOX_TOKEN
          </div>
        )}
      </div>

      {/* Flight Summaries */}
      <div className="max-w-3xl w-full">
        {flights.length === 0 ? (
          <p className="text-gray-400 text-center">No flights logged yet.</p>
        ) : (
          flights.map((f, idx) => (
            <div
              key={idx}
              className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700"
            >
              <h2 className="text-xl font-semibold">
                {f.origin} → {f.destination}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Generated by Gemini ✳️
              </p>
              <p className="mt-2">{f.summary}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
