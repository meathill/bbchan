import { createApp } from 'vue';
import App from './App.vue';
import './style/base.css';
import AV from 'leancloud-storage';
import {LC_APP_ID, LC_APP_SECRET} from '@/config/leancloud';

AV.init({
  appId: LC_APP_ID,
  appKey: LC_APP_SECRET,
  serverURL: "https://api.bb.meathill.com"
});

createApp(App).mount('#app');
