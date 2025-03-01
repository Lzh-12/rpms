import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus' // 导入element-plus
import 'element-plus/dist/index.css' // 导入 element-plus的样式
import locale from 'element-plus/dist/locale/zh-cn.js' // 导入中文
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 防抖处理
const debounce = (callback, delay) => {
    let tid;
    return function (...args) {
      const ctx = this;
      if (tid) clearTimeout(tid);
      tid = setTimeout(() => {
        callback.apply(ctx, args);
      }, delay);
    };
  };
  
  const _ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
      const debouncedCallback = debounce(callback, 20);
      super(debouncedCallback);
    }
  };

const app = createApp(App);

// 一定要分开单独写
app.use(ElementPlus, {locale});
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app');