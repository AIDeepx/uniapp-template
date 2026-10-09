export type MapServiceKey = {
  key: string;
};

export type MapServices = {
  tianditu: MapServiceKey;
  qqmap: MapServiceKey;
  amap: MapServiceKey;
  google: MapServiceKey;
  baidu: MapServiceKey;
};

export type LocationConf = {
	key: string
	map: string
	jweixin?: any
}

export type LocationAddress = {
  country: string;
  province: string;
  city: string;
  district: string;
  street: string;
  streetNum: string;
  poiName: string;
  postalCode: string;
  cityCode: string;
};

export type GetLocationSuccess = {
  latitude: number;
  longitude: number;
  speed: number;
  accuracy: number;
  altitude: number;
  verticalAccuracy: number;
  horizontalAccuracy: number;
  address: LocationAddress;
};

export type GetLocationOptions = {
  type?: string;
  altitude?: boolean;
  geocode?: boolean;
  highAccuracyExpireTime?: number;
  timeout?: string;
  cacheTimeout?: number;
  accuracy?: string;
  isHighAccuracy?: boolean;
  success?: (res: GetLocationSuccess) => void;
  fail?: (res: any) => void;
  complete?: (res: any) => void;
};


export type ChooseLocationSuccess = {
	name?: string;
	address?: string;
	latitude: number;
	longitude: number;
}

export type ChooseLocationOptions = {
	latitude ?: number;
	longitude ?: number;
  success?: (res: ChooseLocationSuccess) => void;
  fail?: (res: any) => void;
  complete?: (res: any) => void;
}

export type OpenLocationOptions = {
	latitude : number;
	longitude : number;
	type?: string;
	scale ?: number;
	name ?: string;
	address ?: string;
  success?: (res: any) => void;
  fail?: (res: any) => void;
  complete?: (res: any) => void;
}

export type GetLocation = (options: GetLocationOptions) => void;
export type ChooseLocation = (options: ChooseLocationOptions) => void;
export type OpenLocation = (options: OpenLocationOptions) => void;

interface Uni {
  getLocation(options ?: GetLocationOptions): void;
	
	chooseLocation(options ?: ChooseLocationOptions): void;
	
	openLocation(options ?: OpenLocationOptions): void;
}