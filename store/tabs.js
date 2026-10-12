/**
 * 多标签页状态（Pinia）—— store 分片示例
 *
 * 定位：底部标签栏 / 横向多标签（订单列表的「全部/待办/已办」等）的选中态，
 * 以及各标签的未读徽标数。这类状态需要「跨页面共享 + 局部更新 + 可持久化」，
 * 放在组件 data 里会在跳转后丢失，正是 store 的典型用例。
 *
 * 注意：底部固定 tabBar 若走 pages.json 原生 tabBar，页面切换由框架管理，
 * 无需本页；本页面向的是「页面内标签」与「非 tabBar 场景」。
 *
 * 用法（Options API，已全局注入 this.store，但 store 实例需按需取）：
 *   import { useTabsStore } from '@/store/index.js'
 *   const tabs = useTabsStore()
 *   tabs.setActive('todo')
 */
import { defineStore } from 'pinia'

/** 内置一套常见的审批类标签 */
const DEFAULT_TABS = [
  { key: 'all', text: '全部' },
  { key: 'todo', text: '待办' },
  { key: 'done', text: '已办' },
]

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabs: DEFAULT_TABS,
    activeKey: 'all',
    // 每个标签的未读/待处理数量，用于徽标
    badge: { todo: 0, done: 0 },
  }),

  getters: {
    activeTab: (state) => state.tabs.find((t) => t.key === state.activeKey) || null,
    activeIndex: (state) => state.tabs.findIndex((t) => t.key === state.activeKey),
    // 渲染用：把徽标数挂到 tab 上，列表组件直接取
    tabsWithBadge: (state) =>
      state.tabs.map((t) => ({ ...t, badge: state.badge[t.key] || 0 })),
    totalBadge: (state) =>
      Object.keys(state.badge).reduce((sum, k) => sum + (state.badge[k] || 0), 0),
  },

  actions: {
    /** 切换选中项 */
    setActive(key) {
      if (!this.tabs.some((t) => t.key === key)) return
      this.activeKey = key
    },
    /** 覆盖标签集（不同页面可能标签不同） */
    setTabs(list) {
      if (!Array.isArray(list) || !list.length) return
      this.tabs = list
      if (!this.tabs.some((t) => t.key === this.activeKey)) {
        this.activeKey = this.tabs[0].key
      }
    },
    /** 设置徽标数；传 -1 可清空为不显示 */
    setBadge(key, n) {
      this.badge = { ...this.badge, [key]: Math.max(0, n || 0) }
    },
    /** 累加（如收到新消息） */
    addBadge(key, n = 1) {
      this.setBadge(key, (this.badge[key] || 0) + n)
    },
    /** 切到指定标签并清掉它的徽标（典型：点进列表后已读） */
    visit(key) {
      this.setActive(key)
      if (this.badge[key]) this.setBadge(key, 0)
    },
    reset() {
      this.tabs = DEFAULT_TABS
      this.activeKey = 'all'
      this.badge = { todo: 0, done: 0 }
    },
  },

  // 选中项与徽标跨页面共享，持久化后回到应用仍保持上次位置
  persist: { paths: ['activeKey', 'badge'] },
})
