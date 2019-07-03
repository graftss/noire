export const sign = (x: number) => x > 0 ? 1 : x < 0 ? -1 : 0;

export const clone = (o: Object): any => JSON.parse(JSON.stringify(o));
