<template>
	<view ref="map" class="map" id="map"></view>
</template>

<script>
import props from './props';
import manifest from '@/manifest.json';
import { getLocation } from '@/uni_modules/melon-location';
export default {
	name: 'melonMap',
	props,
	mounted() {
		this.initMap();
	},
	onUnload() {
		clearInterval(this.initItv);
		this.initItv = false;
	},
	data() {
		return {
			map: null,
			initItv: false,
		}
	},
	watch: {
		enableZoom(v) {
			this.setZoom(v);
		},
		enableScroll(v) {
			this.setDrag(v);
		},
		markers(v) {
			this.setMarkers(v);
		},
	},
	methods: {
		getBasepath() {
			try {
				return manifest.h5.router.base;
			} catch(e) {
				return "/";
			}
		},
		getKey() {
			try {
				return manifest.h5.sdkConfigs.maps.tianditu.key;
			} catch(e) {
				console.error("请在manifest.json文件内配置天地图key，配置方法请参考文档")
			}
		},
		// initLocation() {
		// 	getLocation({
		// 		success: res => {
		// 			this.initMap(res.latitude, res.longitude, 18);
		// 		},
		// 		fail(error) {
		// 			console.error("定位失败",error)
		// 		}
		// 	});
		// },
		initMap() {
			if (!this.map) {
				// 创建SDK
				const key = this.getKey();
				if (!key) return;
				if (!document.querySelector('script[name="tianditu"]')) {
					const script = document.createElement('script');
					script.setAttribute("name", "tianditu");
					script.type = "text/javascript";
					script.src = `http://api.tianditu.gov.cn/api?v=4.0&tk=${key}`;
					document.body.appendChild(script);
				}
				this.mapReady();
			}
		},
		mapReady() {
			this.initItv = setInterval(() => {
				if (window.T) {
					clearInterval(this.initItv);
					this.initItv = false;
					this.map = new T.Map('map', {
						projection: 'EPSG:4326',
						minZoom: this.minScale,
						maxZoom: this.maxScale,
					});
					if (!isNaN(this.zIndex)) {
						this.$refs.map.$el.querySelector('.tdt-pane.tdt-map-pane').style.zIndex = this.zIndex;
					}
					this.setZoom(this.enableZoom);
					this.setDrag(this.enableScroll);
					this.setMapCenter(
						this.latitude, 
						this.longitude, 
						this.scale
					);
				}
			}, 300);
		},
		setMapCenter(latitude, longitude, zoom) {
			this.map.centerAndZoom(new T.LngLat(longitude, latitude), zoom);
		},
		setZoom(v) {
			if (v) {
				this.map.enableScrollWheelZoom();
				this.map.enableDoubleClickZoom();
				this.map.enableContinuousZoom();
				this.map.enablePinchToZoom();
				this.map.enableAutoResize();
			} else {
				this.map.disableScrollWheelZoom();
				this.map.disableDoubleClickZoom();
				this.map.disableContinuousZoom();
				this.map.disablePinchToZoom();
				this.map.disableAutoResize();
			}
		},
		setDrag(v) {
			if (v) {
				this.map.enableDrag();
			} else {
				this.map.disableDrag();
			}
		},
		setMarkers(v) {
			this.map.clearOverLays();
			let basePath = this.getBasepath();
			for(let item of v) {
				if (!item.longitude || !item.latitude) continue;
				
				let markerOpt = {}
				if (item.title) markerOpt.title = item.title;
				if (item.iconPath) {
					if (!item.iconPath.startsWith('http')) item.iconPath = `${location.origin}${basePath}${item.iconPath}`;
					let iconOpt = {iconUrl: item.iconPath};
					if (item.width && item.height) iconOpt.iconSize = new T.Point(item.width, item.height);
					if (item.anchor) iconOpt.iconAnchor = new T.Point(item.anchor.x, item.anchor.y)
					
					markerOpt.icon = new T.Icon(iconOpt)
				};
				
				
				const marker = new T.Marker(new T.LngLat(item.longitude, item.latitude),markerOpt);
				marker.addEventListener('click', this.onMarkertap.bind(this, item));
				this.map.addOverLay(marker);
			}
		},
		onMarkertap(e) {
			this.$emit('markertap', {
				detail: {
					...e,
					markerId: e.id
				}
			});
		},
	}
}
</script>

<style lang="scss" scoped>
#map {
	height: 100%;
}
</style>