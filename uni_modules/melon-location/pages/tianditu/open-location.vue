<template>
	<view class="container">
		<view class="map" id="map"></view>
		<view class="info">
			<view class="info-title">{{options.name}}</view>
			<view class="info-desc">{{options.address}}</view>
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
				this.setMarket();
			});
		})
	},
	onUnload() {
		clearInterval(this.initItv);
		this.initItv = false;
	},
	data() {
		return {
			map: null,
			initItv: false,
			options: {},
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
				iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABilJREFUeF7tm1tsFFUYx//fbq2gXHeKVV8E8UFBTfTBGkgEjCZAZ1GI7KzBCz4IaKwXxMQLCvUWjRoQjFx8ASVxZ2sgsrPQKNHyUEJt4oOC0QSk+IAWdxeFKli2+8npxSyll/Odnd3G0PPSh/1/t9/5zsycM1PCRT7oIq8fwwBK1QGnHpx/xdn29jsZgSoCTwQwkQH1V81CC4AWBrUQck2XlJd/NfqTHcdLkVtRO+CvBxZc9Xd7+9IAYTqAu4QF7ckxGi8rL990+bbtvwptteVFAZBX+KMArtbOpm/hsRzjo2KB8B1AJmovY8bLPhTeG8cxIrwWinkbCwR6nrmvAFIRewMRlvmZYG9fzNhYEfce8yuGbwDSkfBuEM/2K7EB/TDVW/HEHD9i+QIg5VSvI1CNHwnp+mDw+go3+aSuvj9dwQAy0eolzLSp0ERM7Il4aSiW3Gxi22NTEIB01HbAiBWSQMG2hKgV81xTP8YAjiyeOWLM6VFNAG42De6T3XcnR7ZVTdrScMbEnzGAdDS8AszvmAT13YboOSuWeNfErxGAtvvnVf6Ty6nZv8YkaBFsjl4aCFSN+nRnq9S3EYB0pPpZEBkRB/AFgZsJgeZyouZcx9mzZ4LBqUGmKQw8BHCVtIhOPfMKK558T2prBsCxG88VMk0aDMRrrFhy+UB2KcfeRsAisW9gn+V6as8hGmIA6YX3TEGg46AoipogoKbC9T7Qscs44TkM3qWjPU+TC0616j7/QWInBvB7xF4dIKySBGHgrQrXe0FiY/JwlWPUToh7qyVxxADSjr0WwFOSIAHKThofq1d7fu1xYvG94zpOZ5sJuE7bCHjfcr2nBXr5iVDGsbd2Xax0B2+x3OQjuup8XSpir1Q7QF1bAj4Oud7DunqlE3dAxrF3MhDWDZIjzJoQ8xp09fm6jGM/wcB6XVsCEiHXm6erNwKQduwvJac7BQJYxMA2QUF7LNe7W6A36oAYA45ukMIAyO4GBLgh14vq5mbUARkn/CGDtQ8kCgFwwgnX5MDrdAsi0IaQm3hcV28IoPp1Br2kG4SZ366IJ5/X1efr0k54v+TJkMBvhNzkSkks8UUwFZ1bRRzYLwiSLQNNG+smmgU2OB6Ze0eQAnslNky52ytiu9QeRXuIASjPacf+HsCN+lE4bsWS2teNrhjhOMALtWMAByzXu0mg75SaAYjYq85Zip641GGmdbythhoasoMlaVC8etZebcW92sF89/7dCMAfTvjWDrBqtTJhwH1MueX9tWnKqb6BEKgVzrxKIRsEVY1zE98K8zHrgO4WXQOw6LGzKzlqA3M9BagFjEMdxD8FwPOIaSYDt0gL6Pa51nITz5jYGnWACtTqzJlcxsEmECyTwL7ZMNJZ6qiqdHcfNvFpDEAFM9kZmiQ5kI3JDjDfX0EAOpdCxN4Owny/C9Pyx9hhxb0FWtp+RAUDUH4zTvgQgycXkojUlkCHQ25CslXuM4QvALog2FkGgtJCTPQEdIRcT3oHKi6ArjuDfRLAaJOiBDanLNcbI9APKPWtA3qipB37NwCVfiXYy0+r5XpX+unbdwDdnfAzgEl+JgrgiOV61/rs0/xBaLBE0o59AMDUwXSavx+0XE9/76HpVMmK0gH/LYeo3QTGbYJ8LpQSvrFintnLEo3ARQXQfXf4moGZGrlcICGgIeR6s0xsdW2KDqD7mpAEMFc3qW7dLsv1qoU2YnlJAHRCiNh1INynlSHjMyvuSc4CtNz2JSoZgK5O0DnkoDrLTUSMKxIalhTA4BBKW3zR7wL9TUbfnVD64ocMwIWdMDTFDymA/LOEQvf0wmV/nrzk14Ce6MMA8r4zGO4Agw8bCmn7fNvhJeAXSamfi/4a0LqwurYsQK8ocNkcv1pZlxR9dyQF3p9+KJbACHVi1Dh7xovXjx29RCX245+nNk+v3/umet0AwOiTV1MgpQagilenOiMbZ89Y0guA+ur7NAB1mlQyCKUGUNHzeW0/ANRE/qLeuZjOqNSu1ADUa7TOf5UbYBwFkJIWYqovNQCVp1oC4/tJ+ET3EjCtR2w3FABUkmopqG5Q1wQ11JpPl3Lme0gNFQDxTBXLYBhAscj+X/z+C4f2Fl97sWg/AAAAAElFTkSuQmCC",
				iconSize: new T.Point(64, 64),
				iconAnchor: new T.Point(32, 32)
			});
			//向地图上添加自定义标注
			const marker = new T.Marker(new T.LngLat(this.options.longitude, this.options.latitude), {icon: icon});
			this.map.addOverLay(marker);
		},
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
	
	.map {
		flex: 1;
		min-height: 0;
	}
	
	.info {
		padding: 30rpx;
		height: 300rpx;
		box-sizing: border-box;
		.info-title {
			font-size: 36rpx;
			font-weight: 800;
		}
		.info-desc {
			margin-top: 20rpx;
			font-size: 24rpx;
			color: #999;
		}
	}
}
</style>