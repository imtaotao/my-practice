// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/common/iconfont/iconfont.css'
import '@/common/reset.css'
import '@/common/common.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	template: '<App/>',
	components: { App },
	router: router()	// 路由功能
})
