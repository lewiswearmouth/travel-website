import { TRIPS_WITH_DISTANCE } from "./flights_with_distances.js";
import { ENGINES } from "./engines.js";
import { generateEmissionsTable } from "./emissions.js";

export function buildOptimizerInput() {
    return {
        routes: TRIPS_WITH_DISTANCE,
        engines: ENGINES,
        emissionsTable: generateEmissionsTable(),
    };
}