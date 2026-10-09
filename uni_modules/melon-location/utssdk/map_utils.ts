function outOfChina(lng: number, lat: number) {
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

function delta(lng: number, lat: number) {
    let x = lng, y = lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    return {
        lng: z * Math.cos(theta),
        lat: z * Math.sin(theta)
    };
}

const x_pi = 3.14159265358979324 * 3000.0 / 180.0;

export const transformCoordinate = {
	wgs84togcj02(lng: number, lat: number) {
		if (outOfChina(lng, lat)) return [lng, lat];
		let d = delta(lng, lat);
		return [lng + d.lng, lat + d.lat];
	},
	gcj02towgs84(lng: number, lat: number) {
	    if (outOfChina(lng, lat)) return [lng, lat];
	    let d = delta(lng, lat);
	    return [lng - d.lng, lat - d.lat];
	},
	bd09togcj02(lng: number, lat: number) {
		let z = Math.sqrt(lng * lng + lat * lat) - 0.0065;
		let theta = Math.atan2(lat, lng) - 0.000003 * Math.cos(lng * x_pi);
		return [
			z * Math.cos(theta),
			z * Math.sin(theta)
		];
	}
}