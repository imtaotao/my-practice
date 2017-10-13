import Vue from 'vue'
import Router from 'vue-router'
import routeConfig from '@/router/routeConfig'
import util from '@/common/util'

// 一级模块路由
import home from '@/components/HomePage/homeMain'							// 主页
import notice from '@/components/Notice/noticeMain'						// 通知公告
import pollution from '@/components/Pollution/pollutionMain'			// 污染防治
import environment from '@/components/Environment/environmentMain'		// 环境质量
import dataShare from '@/components/Datashare/datashareMain'			// 资料共享
import dataStatis from '@/components/DataStatistics/datastatisticsMain'	// 数据统计
import contacts from '@/components/Contacts/contactsMain'				// 通讯录

Vue.use( Router )

export default function( option ) {
	const routes = [
		{
			path: '/home',
			component: home,
			name: 'home',
			children: routeConfig.home
		},
		{path: '/notice',		component: notice,		name: 'notice'},
		{path: '/pollution',	component: pollution,	name: 'pollution'},
		{path: '/environment',	component: environment,	name: 'environment'},
		{path: '/dataShare',	component: dataShare,	name: 'dataShare'},
		{path: '/dataStatis',	component: dataStatis,	name: 'dataStatis'},
		{path: '/contacts',		component: contacts,	name: 'contacts'},
	]
	
	const route = new Router({
		linkActiveClass: 'clk',
		scrollBehavior: () => ({y: 0}),
		routes
	})

	// 默认路由，以及刷新在原来的路由
	util.router = route
	
	route.beforeEach( (to, from, next) => {
		util.savePath( to.path )
		next()
	})
	util.open()
	return route
}
