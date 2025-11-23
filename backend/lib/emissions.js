import { TRIPS_WITH_DISTANCE } from "./flights_with_distances.js";
import { getEligibleEngines } from "./engines_filter.js";

export function generateEmissionsTable() {
    const rows = [];

    for (const trip of TRIPS_WITH_DISTANCE) {
        const eligible = getEligibleEngines(trip.distanceKm);

        for (const engine of eligible) {
            const emissionsKg = trip.distanceKm * engine.burnKgPerKm * 3.16;

            rows.push({
                origin: trip.origin,
                destination: trip.destination,
                distanceKm: trip.distanceKm,
                engine: engine.name,
                burnKgPerKm: engine.burnKgPerKm,
                emissionsKg: Math.round(emissionsKg),
            });
        }
    }

    return rows;
}