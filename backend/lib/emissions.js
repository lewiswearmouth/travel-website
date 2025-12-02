import { TRIPS_WITH_DISTANCE } from "./flights_with_distances.js";
import { getEligibleEngines } from "./engines_filter.js";

export function generateEmissionsTable() {
    const rows = [];

    for (const trip of TRIPS_WITH_DISTANCE) {
        const eligible = getEligibleEngines(trip.distanceKm);

        for (const engine of eligible) {
            // Per passenger emissions
            const emissionsKg = (trip.distanceKm * engine.aircraftBurnKgPerKm * 3.16) / engine.passengers;

            rows.push({
                origin: trip.origin,
                destination: trip.destination,
                distanceKm: trip.distanceKm,
                engine: engine.name,
                aircraftBurnKgPerKm: engine.aircraftBurnKgPerKm,
                emissionsKg: Math.round(emissionsKg),
            });
        }
    }

    return rows;
}