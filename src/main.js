import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import  qs from 'qs'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.config.productionTip = false
Vue.use(mavonEditor) 
Vue.prototype.$qs = qs
new Vue({
  render: h => h(App)
}).$mount('#app')
