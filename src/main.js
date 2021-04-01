import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/screen.styl';
import AV from 'leancloud-storage';
import { LC_APP_ID, LC_APP_SECRET } from '@/config/leancloud';

AV.init({
  appId: LC_APP_ID,
  appKey: LC_APP_SECRET,
  serverURL: 'https://api.bb.meathill.com',
});

createApp(App)
  .use(router)
  .use(store)
  .mount('#app');
