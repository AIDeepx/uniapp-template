import { MapServices } from './interface'
// 配置公众号jweixin对象名称（别名，不能是wx，否则与uniapp冲突）
// 参考https://ask.dcloud.net.cn/article/35380
// @ts-ignore
const jweixin = false;

const maps: MapServices = {
  tianditu: {
    key: "6f230f96429c5a0bb7f61c7056c4cc40",
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

export function getConfig(): any {
  if (!maps) return false;
	for (let k in maps) {
		let map = maps[k as keyof typeof maps];
		if (map.key) {
			return {...map, map: k, jweixin};
		}
	}
	return false;
}
