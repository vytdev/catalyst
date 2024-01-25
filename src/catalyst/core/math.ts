/**
 * some useful math variable and functions related to the game
 */

/**
 * vec2 object interface
 */
export interface vec2 {
	/**
	 * x field of the vector
	 */
	x: number,
	/**
	 * y field of the vector
	 */
	y: number,
}

/**
 * vec3 object interface
 */
export interface vec3 {
	/**
	 * x field of the vector
	 */
	x: number,
	/**
	 * y field of the vector
	 */
	y: number,
	/**
	 * z field of the vector
	 */
	z: number,
}

/**
 * vec3 representation of north in Minecraft
 */
export const NORTH: vec3 = { x: 0, y: 0, z: -1 };
/**
 * vec3 representation of south in Minecraft
 */
export const SOUTH: vec3 = { x: 0, y: 0, z: 1 };
/**
 * vec3 representation of west in Minecraft
 */
export const WEST: vec3 = { x: -1, y: 0, z: 0 };
/**
 * vec3 representation of east in Minecraft
 */
export const EAST: vec3 = { x: 1, y: 0, z: 0 };
/**
 * vec3 representation of down in Minecraft
 */
export const DOWN: vec3 = { x: 0, y: -1, z: 0 };
/**
 * vec3 representation of up in Minecraft
 */
export const UP: vec3 = { x: 0, y: 1, z: 0 };

/**
 * convert degrees to radians
 * @param x the number to convert
 * @returns radians
 */
export function degToRad(x: number): number {
	return x * Math.PI / 180;
}

/**
 * convert radians to degrees
 * @param x the number to convert
 * @returns degrees
 */
export function radToDeg(x: number): number {
	return x * 180 / Math.PI;
}
/**
 * calculates the coordinates of a point along a ray, given a rotational angle
 * and distance.
 * @param offset the starting point's coordinates
 * @param angle the rotational angle on the sphere in degrees (pitch, yaw)
 * @param dist the distance along the ray from the starting point.
 * @returns the resulting coordinates as a vec3.
 */
export function computeRayCoords(offset: vec3, angle: vec2, dist: number): vec3 {
	const pitch = degToRad(angle.x);
	const yaw = degToRad(angle.y);

	return {
		x: offset.x + dist * -Math.cos(pitch) * Math.sin(yaw),
		y: offset.y + dist * -Math.sin(pitch),
		z: offset.z + dist * Math.cos(pitch) * Math.cos(yaw),
	};
}

/**
 * get the distance of given two 3d coordinates from each other
 * @param a the first point
 * @param b the second point
 * @returns the distance of point a from point b
 */
export function vdist(a: vec3, b: vec3): number {
	return Math.sqrt(
		(a.x - b.x) ** 2 +
		(a.y - b.y) ** 2 +
		(a.z - b.z) ** 2
	);
}

/**
 * make a copy of a vec3
 * @param v the source vec3
 * @returns new vec3 that is fully independent from the source
 */
export function vclone(v: vec3): vec3 {
	return {
		x: v.x,
		y: v.y,
		z: v.z,
	};
}

/**
 * add two vec3
 * @param a first
 * @param b second
 * @returns sum
 */
export function vadd(a: vec3, b: vec3): vec3 {
	return {
		x: a.x + b.x,
		y: a.y + b.y,
		z: a.z + b.z,
	};
}

/**
 * subtract two vec3
 * @param a first
 * @param b second
 * @returns difference
 */
export function vsub(a: vec3, b: vec3): vec3 {
	return {
		x: a.x - b.x,
		y: a.y - b.y,
		z: a.z - b.z,
	};
}

/**
 * multiply two vec3
 * @param a first
 * @param b second
 * @returns product
 */
export function vmul(a: vec3, b: vec3): vec3 {
	return {
		x: a.x * b.x,
		y: a.y * b.y,
		z: a.z * b.z,
	};
}

/**
 * divide two vec3
 * @param a first
 * @param b second
 * @returns quotient
 */
export function vdiv(a: vec3, b: vec3): vec3 {
	return {
		x: a.x / b.x,
		y: a.y / b.y,
		z: a.z / b.z,
	};
}

/**
 * minimum of two vec3
 * @param a first
 * @param b second
 * @returns min coords
 */
export function vmin(a: vec3, b: vec3): vec3 {
	return {
		x: Math.min(a.x, b.x),
		y: Math.min(a.y, b.y),
		z: Math.min(a.z, b.z),
	};
}

/**
 * maximum of two vec3
 * @param a first
 * @param b second
 * @returns max coords
 */
export function vmax(a: vec3, b: vec3): vec3 {
	return {
		x: Math.max(a.x, b.x),
		y: Math.max(a.y, b.y),
		z: Math.max(a.z, b.z),
	};
}

/**
 * floor the given vec3
 * @param v the vector
 * @returns flooring of v
 */
export function vfloor(v: vec3): vec3 {
	return {
		x: Math.floor(v.x),
		y: Math.floor(v.y),
		z: Math.floor(v.z),
	};
}

/**
 * ceil the given vec3
 * @param v the vector
 * @returns ceiling of v
 */
export function vceil(v: vec3): vec3 {
	return {
		x: Math.ceil(v.x),
		y: Math.ceil(v.y),
		z: Math.ceil(v.z),
	};
}

/**
 * round the given vec3
 * @param v the vector
 * @returns rounded v
 */
export function vround(v: vec3): vec3 {
	return {
		x: Math.round(v.x),
		y: Math.round(v.y),
		z: Math.round(v.z),
	};
}

/**
 * absolute vec3
 * @param v the vector
 * @returns abs of v
 */
export function vabs(v: vec3): vec3 {
	return {
		x: Math.abs(v.x),
		y: Math.abs(v.y),
		z: Math.abs(v.z),
	};
}
