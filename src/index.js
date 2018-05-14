import Proxy from './components/Proxy.vue';
import generateVuexModule from './generateVuexModule';
import config from './config';

var isConfiged = false;

export default {
  install (Vue) {
    Vue.component('clay-proxy', Proxy);
    Vue.filter('asArr', function (obj) {
      return Object.values(obj);
    });
  },
  config ({schema, storage}) {
    config.setSchema(schema);
    config.setStorage(storage);

    isConfiged = true;

    // 开发调试
    console.log(`window.location.search.indexOf('openProxy'):`, window.location.search.indexOf('openProxy'));
    if (window.location.search.indexOf('openProxy') !== -1) {
      config.getStorage().setData('openProxy', true);
    }

    // 线上开关
    window.addEventListener('message', (e) => {
      console.log('config index:', e);
      // if (/taovip\.com/.test(e.origin) && e.data === 'openProxy') {
      if (e.data === 'openProxy') {
        config.getStorage().setData('openProxy', true);
        e.source.postMessage('done', '*');
      }
    });
  },
  clayState () {
    return generateVuexModule();
  },
}
