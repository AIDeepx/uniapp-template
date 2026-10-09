<template>
	<view class="container">
		<view class="head">
			<view class="head-cancel" @click="cancel">取消</view>
			<view class="head-confirm" @click="confirm">确定</view>
		</view>
		<view class="map" id="map"></view>
		<view class="search">
			<view class="search-ctrl">
				<image class="search-ctrl-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAz5JREFUWEftl01oVFcUx//nkQ6kCxeRCEIKFqVdJBQkdZWqlAoqFKGlmUbuuXkb6SaWammsuGlASrF+RES7aDZx7r1pjFIRN4JxYUBxYUQ31pqxqxoQayHYRUgm9zg3JGUS52Um6RtE6IXH480795zfO/d8DeEVL3rF9vH6ATjnWgG0eu9boyhqAvAAwO8A/giXUircq15VecAYs5aITgPYCmB1Be23AJxk5nPVUFQEsNa2ATAA3iaiq+FrvffhultfX393cnKyMYqiZgAtItJCRJ8AeBPARWb+tBLEkgDW2i8BnJpTspeZz1RS6Jzb4r0/SUQbg6z3flNnZ+ftpH2JANbaywA+JqLxQqHwYRzHDysZL31vjDlLRJ3ht0wmU5fNZmfK7S8L4JxrF5EhAH8Vv7pxOYZLZZ1z20XkCoABZlZVA1hrxwGsFZE2rfXNlQKEfcaY74noEBF1K6WOLdb1kgestb0A9gHoY+Yv/ovx+b3W2hEAm0Vkp9Y6eOTftQAgl8utiaLoCYB7ExMTH3R1df2TBkAITBG5XsyOH5n520QAa+1HAIZFpFdr/XUaxku88EBEnmutNyUCGGO+IqKQQlml1PmUAS4B2DUzM9MUx/Hjed0LjsA5d1ZEQuq8xcx/pgzwA4CDIhJrrXNlAay1v4nIG1rrDWkaD7pyuVxHFEW/APiGmY8nAUyIyNNaAhARK6VcEkBIke21PAIA25j5WlkAY0wPEX1XyyAE0MzM95M8EDrZr7VKQwDvZjKZ1dls9u+yAP39/evr6uryNSxEF5i5PbEOzNVuS0ShcaRdikN73sHMN5YEGBoaapiamhorzgENKTejY0qp7orNKAg455SI2BTb8R0iai83LyYOJMaY2aNIYyAJgZ3P5z/v6ekpVOWBkgZyAMCRueeVjGSjIjJGRB1hniwUCrvjOH62ZAwsJhwYGHjPe/8TgLblDKUiciSKop+D251zfSKypxiEt4JXS4+i4lQ8D2SMOUpEnwFYV6FPjBDRYaXUcKmcMeYEEe0HMMrM75etA9U0oMHBwXemp6dbiWj2DwqAUNXuF2t83nv/SGsd6kjZFSotgFWls0bVHqgGbiUy/wO8AMXajjC8mbkhAAAAAElFTkSuQmCC" />
				<input class="search-ctrl-input" placeholder-class="search-ctrl-placeholder" placeholder="搜索地点" @input="onSearch"/>
			</view>
			<scroll-view class="search-results" scroll-y>
				<view class="search-result" v-for="(item,i) in suggetList" :key="i" @click="chosenPoi(i)">
					<view class="search-result-info">
						<view class="search-result-title">{{item.name}}</view>
						<view class="search-result-desc">{{item.address}}</view>
					</view>
					<image v-if="chosen==i" class="search-result-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAh1JREFUWEftlj9oE2EYxn9P6h9Ewaku4iYuji7FSdyy3R04qVCwUqXJNQWNY4qTUlTughXjYKOdlOZS/4EuLi7q4KSDk4uI4OCgiITcaxNaSGvTXIlJB3Pbcd/7PD+e9/ve78QWP9pifwYAgwT+rwTc0B6Y8aE6qemV09e3BNzA7iNOSZQqWY33FcANrQScRTwZ3oFXGletbwBuaAHgAy+tjled0vfW4dfTFrihXQEuAW+2bcd7eF6f107engE4RSvIaGy296Twoow+rjf2ewLgBJaXuAp8SoG34OtduzvnnwN4gWVNhMA3Ytwop1cbXXirANzArpNiJK4ztZjT683elF5gYybuLPX9VxzjLub0vJPGKgAnsGmJAvBVcKbi62kngZXvbmgngfnGu1J4lYyiJLV/tcAJLSe4gajLGKv4musk5IbmAQuNdSZOV7NqgiR51t0DTmijgrvLAvnI10w7MadoaRmPgSHBuYqv20mMOw4ip2hOypg32A3MRL7ya4Wdoh1bNt9jcKHq69pmzJvt2qjALdpxwT0z9gvmfvwm8+KifjZqvNBGDB4Bw0vJFyJflzdr3hGgscAJ7IhSlDEOm/GMmAkNsReasR9ol05SmERz4MRNO1irUxYcBd5CE+CQGbPVSU0kNetqErq3bB81Gici3RQS5Sir0W7ME7Wg1SAd2s5dIoxjvrT+VHQDkagF3Rh0qh0ADBIYJPAHkWCoIVdxC/IAAAAASUVORK5CYII=" />
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	onLoad(options) {
		this.options = options;
	},
	onShow() {
		if (this.map) return;
		this.$nextTick(() => {
			this.init(this.options, () => {
				this.map = new T.Map('map', {
					projection: 'EPSG:4326'
				});
				this.map.centerAndZoom(new T.LngLat(this.options.longitude, this.options.latitude), 18);
				this.map.addEventListener('drag', this.mapDrag);
				this.map.addEventListener('dragend', this.mapDragEnd);
				this.setMarket();
				this.localSearch = new T.LocalSearch(this.map, {
					pageCapacity: 50,	//每页显示的数量
					onSearchComplete: this.localSearchResult	//接收数据的回调函数
				});
			});
		})
	},
	onUnload() {
		clearInterval(this.initItv);
		this.initItv = false;
		if (this.map) {
			this.map.removeEventListener('drag', this.mapDrag);
			this.map.removeEventListener('dragend', this.mapDragEnd);
		}
	},
	data() {
		return {
			map: null,
			initItv: false,
			searchItv: false,
			localSearch: false,
			dragEndItv: false,
			suggetList: [],
			options: {},
			chosen: -1,
		}
	},
	methods: {
		init(options, callback) {
			// 创建SDK
			if (!document.querySelector('script[name="tianditu"]')) {
				const script = document.createElement('script');
				script.setAttribute("name", "tianditu");
				script.type = "text/javascript";
				script.src = `http://api.tianditu.gov.cn/api?v=4.0&tk=${options.key}`;
				document.body.appendChild(script);
			}
			this.initItv = setInterval(() => {
				if (T) {
					clearInterval(this.initItv);
					this.initItv = false;
					callback();
				}
			}, 300);
		},
		setMarket() {
		 //创建图片对象
			const icon = new T.Icon({
				iconUrl: "data:image/png;base64,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",
				iconSize: new T.Point(64, 64),
				iconAnchor: new T.Point(32, 32)
			});
			//向地图上添加自定义标注
			const marker = new T.Marker(new T.LngLat(this.options.longitude, this.options.latitude), {icon: icon});
			this.map.addOverLay(marker);
		},
		mapDrag(e) {
			if (this.dragEndItv) {
				clearTimeout(this.dragEndItv);
				this.dragEndItv = false;
			}
			let center = e.target.getCenter();
			this.options.latitude = center.lat;
			this.options.longitude = center.lng;
			this.map.clearOverLays();
			this.setMarket();
		},
		mapDragEnd(e) {
			if (this.dragEndItv) {
				clearTimeout(this.dragEndItv);
				this.dragEndItv = false;
			}
			this.dragEndItv = setTimeout(() => {
				let center = e.target.getCenter();
				uni.request({
					url: `http://api.tianditu.gov.cn/geocoder?postStr={'lon':${center.lng},'lat':${center.lat},'ver':1}&type=geocode&tk=${this.options.key}`,
					success: res => {
						if (res.statusCode != 200 || !res.data) {
							return;
						}
						let data = res.data;
						if (!data.status || data.status != '0') {
							return;
						}
						console.log(data);
						this.localSearch.search(data.result.addressComponent.poi);
					},
					fail: err => {
						console.error(err);
						return;
					}
				});
			}, 800);
		},
		chosenPoi(i) {
			this.chosen = i;
			let row = this.suggetList[i];
			let lnglat = row.lonlat.split(",")
			this.options.latitude = lnglat[1];
			this.options.longitude = lnglat[0];
			this.map.clearOverLays();
			this.setMarket();
			this.map.centerAndZoom(new T.LngLat(Number(lnglat[0]), Number(lnglat[1])), this.map.getZoom());
		},
		onSearch(e) {
			if (this.searchItv) {
				clearTimeout(this.searchItv);
				this.searchItv = false;
			}
			if (e.detail.value.length < 1) return;
			this.searchItv = setTimeout(() => {
				this.localSearch.search(e.detail.value)
			}, 500);
		},
		localSearchResult(e) {
			this.suggetList = e.result.pois || [];
		},
		cancel() {
			uni.navigateBack();
		},
		confirm() {
			if (this.chosen < 0) {
				uni.showToast({
					title: "请选择地点",
					icon: 'none'
				});
				return;
			}
			uni.$emit('choose-location', this.suggetList[this.chosen]);
			uni.navigateBack();
		}
	}
}
</script>

<style lang="scss" scoped>
page {
	height: 100%;
}
.container {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	position: relative;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	
	.head {
		display: flex;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
		padding: 20rpx;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		.head-cancel {
			width: 120rpx;
			height: 56rpx;
			line-height: 56rpx;
			font-size: 32rpx;
			color: #555;
		}
		.head-confirm {
			width: 120rpx;
			height: 56rpx;
			line-height: 56rpx;
			text-align: center;
			font-size: 32rpx;
			color: #fff;
			border-radius: 10rpx;
			background-color: #5192FF;
		}
	}
	
	.map {
		flex: 1;
		min-height: 0;
	}

	.search {
		padding: 30rpx 0;
		display: flex;
		height: 50%;
		min-height: 0;
		flex-direction: column;
		overflow: hidden;
		box-sizing: border-box;
		
		.search-ctrl {
			margin: 0 auto;
			width: calc(100% - 60rpx);
			position: relative;
		}
		
		.search-ctrl-icon {
			position: absolute;
			top: 13rpx;
			left: 20rpx;
			width: 36rpx;
			height: 36rpx;
		}
		
		.search-ctrl-input {
			padding-left: 66rpx;
			height: 66rpx;
			border-radius: 10rpx;
			justify-content: center;
			background-color: #EDEDED;
			box-sizing: border-box;
			overflow: hidden;
		}
		
		.search-ctrl-placeholder {
			color: #AEAEAE;
		}
	}
	.search-results {
		margin-top: 20rpx;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		.search-result {
			padding: 10rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #E5E5E5;
			box-sizing: border-box;
			overflow: hidden;
			.search-result-icon {
				width: 36rpx;
				height: 36rpx;
			}
			.search-result-info {
				.search-result-title {
					font-size: 28rpx;
				}
				.search-result-desc {
					margin-top: 8rpx;
					font-size: 24rpx;
					color: #B9B9B9;
				}
			}
		}
	}
}
</style>