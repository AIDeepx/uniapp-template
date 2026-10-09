import { GetLocationSuccess, ChooseLocationOptions, OpenLocationOptions } from "./interface";

type TLocation = {
	lat: number
	lng: number
}
type AddressComponent = {
	address: string
	address_distance: number
	address_position: string
	city: string
	city_code: string
	county: string
	county_code: string
	nation: string
	poi: string
	poi_distance: string
	poi_position: string
	province: string
	province_code: string
	road: string
	road_distance: string
	town: string
	town_code: string
}
type GetLocationSucessTResult = {
	addressComponent: AddressComponent
	formatted_address: string
	location: TLocation
}
type GetLocationSucessTData = {
	msg: string
	result: GetLocationSucessTResult
	status: string
}

export function getGeocode(result: GetLocationSuccess, key: string): Promise<GetLocationSuccess>  {
  return new Promise((resolve, reject) => {
		uni.request({
			url: `https://api.tianditu.gov.cn/geocoder?postStr={'lon':${result.longitude},'lat':${result.latitude},'ver':1}&type=geocode&tk=${key}`,
			success: res => {
				if (res.statusCode != 200 || !res.data) {
					reject(res.errMsg);
					return;
				}
				let data = res.data as GetLocationSucessTData;
				if (!data.status || data.status != '0') {
					reject(data.msg);
					return;
				}
				let tResult = data.result;
				resolve({
					...result,
					address: {
						country: tResult.addressComponent.nation,
						province: tResult.addressComponent.province,
						city: tResult.addressComponent.city,
						district: tResult.addressComponent.county,
						street: tResult.addressComponent.town,
						streetNum: tResult.addressComponent.town_code.substring(3),
						poiName: tResult.addressComponent.poi,
						postalCode: "",
						cityCode: (tResult.addressComponent.county_code || tResult.addressComponent.city_code || tResult.addressComponent.province_code).substring(3),
					}
				})
			},
			fail: err => {
				console.error(err);
				reject(err);
				return;
			}
		})
	});
}

export function chooseLocation(options: ChooseLocationOptions, key: string) {
	uni.$once("choose-location", (e: any) => {
		let lonlat = e.lonlat.split(',')
		options.success && options.success({
			name: e.name,
			address: e.address,
			latitude: Number(lonlat[1]),
			longitude: Number(lonlat[0])
		})
	});
	uni.navigateTo({
		url: `/uni_modules/melon-location/pages/tianditu/choose-location?key=${key}&latitude=${options.latitude}&longitude=${options.longitude}`
	});
}

export function openLocation(options: OpenLocationOptions, key: string) {
	uni.navigateTo({
		url: `/uni_modules/melon-location/pages/tianditu/open-location?key=${key}&latitude=${options.latitude}&longitude=${options.longitude}&name=${options.name}&address=${options.address}`
	});
}