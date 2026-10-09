export default {
	longitude: Number,
	latitude: Number,
	scale: {
		type: Number,
		default: () => 12
	},
	minScale: {
		type: Number,
		default: () => 3,
	},
	maxScale: {
		type: Number,
		default: () => 20,
	},
	enableZoom: {
		type: Boolean,
		default: () => true
	},
	markers: Array,
	polyline: Array,
	circles: Array,
	polygons: Array,
	controls: Array,
	includePoints: Array,
	zIndex: Number,
	rotate: {
		type: Number,
		default: () => 0
	},
	skew: {
		type: Number,
		default: () => 0
	},
	showLocation: Boolean,
	enableScroll: {
		type: Boolean,
		default: () => true
	},
}