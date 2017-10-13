export default {
	// 路由部分
	router: '',
	savePath( path ) {
		const originPath = sessionStorage.getItem( 'routerPath' );
		!originPath && ( path = 'home/news' )
		sessionStorage.setItem( 'routerPath', path )
	},
	getPath() {
		return sessionStorage.getItem( 'routerPath' ) || 'home/news'
	},
	open( path ) {
		const newPath = !path ? this.getPath() : path
		// 刷新的时候跳转到指定的路由
		this.router.push( newPath )
	},
	isPage( str ) {
		return sessionStorage.getItem( 'routerPath' ).includes( str )
	},

	// dom 操作
	removeClass( el, className ) {
		el.parentElement.querySelector( `.${className}` ).classList.remove( className )
	},
	addClass( el, className ) {
		el.classList.add( className )
	},
	toggle( el, className ) {
		this.removeClass( el, className )
		this.addClass( el, className )
	}
}