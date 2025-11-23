import { ENGINES } from "./engines.js";

export function getEligibleEngines(distanceKm) {
    return ENGINES.filter(
        (engine) => distanceKm >= engine.minKm && distanceKm <= engine.maxKm
    );
}