import { createApp } from 'vue';
import App from './App.vue';
import  router  from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import ApiService from "@/services/ApiServices";
import store from '@/store/index';
import Maska from 'maska';
import moment from 'moment';
const app = createApp(App);

ApiService.init(app);

app.use(router);
app.use(store);
app.use(PerfectScrollbar);
app.use(VueTablerIcons);
app.use(Maska);
app.use(VueApexCharts);
app.config.globalProperties.$moment = moment;
app.use(vuetify).mount('#app');
