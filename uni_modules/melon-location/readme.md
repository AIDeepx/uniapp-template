# melon-location
### 开发文档
使用方式参考unapp的getLocation、openLocation、chooseLocation
### 注意事项
1. 需要在manifest.json内写入天地图的key
2. 微信公众号定位只实现了定位，获取配置需自行实现

### 如何配置天地图的Key
1. 在uniapp项目根目录找到manifest.json文件
2. 选择“源码地图”
```json
"h5" : {
    "sdkConfigs" : {
        "maps" : {
            "tianditu" : {
                "key" : "xxxx"
            }
        }
    }
}
```

### map组件
目前暂时支持示例中的props，传参参考uniapp的map组件，不支持createMapContext
```html
<melon-map 
	ref="map" 
	id="map" 
	class="map" 
	:markers="markers" 
	:z-index="99" 
	:latitude="29.575916" 
	:longitude="106.573167" 
	@markertap="markertap">
</melon-map>

```

### 如何获取mapContext
参考天地图api，[API 4.0 类参考](http://lbs.tianditu.gov.cn/api/js4.0/class.html)
```javascript
const mapContext = this.$refs.map;
```


```javascript
// 配置公众号jweixin对象名称（别名，不能是wx，否则与uniapp冲突）
// 参考https://ask.dcloud.net.cn/article/35380
const jweixin = jwx;

const maps: MapServices = {
  tianditu: {
    key: "",
  },
  qqmap: {
    key: "",
  },
  amap: {
    key: "",
  },
  google: {
    key: "",
  },
  baidu: {
    key: "",
  },
};
```
### 如何使用API定位
```javascript
import { getLocation } from '@/uni_modules/melon-location';
getLocation({
		type: 'gcj02',
		geocode: true,
		success: async res => {
			// 注意腾讯地图、天地图、高德返回不一致，需自行判断
			console.log(res)
		},
		fail() {
			console.error("定位失败");
		}
	});
}
```