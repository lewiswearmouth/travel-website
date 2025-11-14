export const IATA: Record<string, [number, number]> = {
    LHR: [-0.4543, 51.4700],   // London
    BCN: [2.0785, 41.2974],   // Barcelona
    IAD: [-77.4565, 38.9531],  // DC
    EDI: [-3.3615, 55.9508],   // Edinburgh
};

export const getCoord = (code: string) => {
    const c = IATA[code.toUpperCase()];
    if (!c) throw new Error(`Unknown IATA code: ${code}`);
    const [lng, lat] = c;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        throw new Error(`Out-of-range coord for ${code}`);
    }
    return c;
};
