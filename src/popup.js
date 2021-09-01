import { createApp } from 'vue';
import App from './PopupApp.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/popup.styl';
import AV from 'leancloud-storage';
import { LC_APP_ID, LC_APP_SECRET } from '@/config/leancloud';
import '@/chrome';

AV.init({
  appId: LC_APP_ID,
  appKey: LC_APP_SECRET,
  serverURL: 'https://api.bb.meathill.com',
});

createApp(App)
  .mount('#app');
