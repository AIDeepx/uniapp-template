declare namespace UniNamespace {

  interface GetLocationOptions {
    type ?: string
    altitude ?: boolean
    geocode ?: boolean
    highAccuracyExpireTime ?: number
    timeout ?: string
    cacheTimeout ?: number
    accuracy ?: string
    isHighAccuracy ?: boolean
    success ?: (res : GetLocationSuccess) => void
    fail ?: (res : any) => void
    complete ?: (res : any) => void
  }
}

declare interface Uni {
  /**
   * 获取设备电量
   *
   * 文档: [https://uniapp.dcloud.net.cn/api/system/batteryInfo.html](https://uniapp.dcloud.net.cn/api/system/batteryInfo.html)
   */
  getLocation(option?: UniNamespace.GetBatteryInfoOption): void;
}
