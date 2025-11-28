export function defaultEngineForDistance(distanceKm: number) {
    if (distanceKm > 5000) return "RB211-535E4";
    if (distanceKm > 3000) return "Trent XWB-84";
    if (distanceKm > 2000) return "Pearl 15";
    return "AE 3007";
}