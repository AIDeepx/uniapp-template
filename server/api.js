/**
 * 接口地址集中管理
 * 复制到具体项目后，按业务模块补充真实路径即可，组件统一通过 this.api.xxx 调用。
 * 与 utils/config.js 中的 AUTH_API 保持一致。
 */
export default {
  // 鉴权（对应 config.AUTH_API，按需调整）
  auth: {
    dingtalkLogin: '/auth/dingtalkLogin',
    wechatLogin: '/auth/wechatLogin',
    userInfo: '/auth/userInfo',
  },

  // 示例接口（演示用，可删除）
  demo: {
    list: '/demo/list',
    detail: '/demo/detail',
    upload: '/common/upload',
  },
}
