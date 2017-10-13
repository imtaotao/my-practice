/**	注意：在调用off方法时，必须保证删除的回调在同一js文件中，
 *		  切换js文件时，回调函数在内存中的引用地址发生变化，
 *	      不能保证唯一性，因此不能删除。
 *
 *	on，fire，off三个接口对外开放
**/
class Events {
	constructor() {
		// 用于保存事件类型以及内存中的回调函数
		this.listener = {}
	}

	/**
	 *  注册事件

	 *	@param 		type ：   事件类型（ 必须的 ）
					fun ： 	  回调函数（ 必须的 ）

	 *	@result		Events
	 *	@example	Event.on( 'renderafter', function( e ){ ... } )
	**/
	on( type, fun ) {
		if( Tools.isString( type ) && Tools.isFun( fun ) ) {
			// 没有就创建数组并添加，有就push
			if( !this.listener[type] ) {
				this.listener[type] = [fun]
			}else {
				for( let i = 0 , arr = this.listener[type] ; i < arr.length ; i++ ) {
					if( arr[i] === fun ) return this
				}
				this.listener[type] .push( fun )
			}

			return this
		}
	}

	/**
	 *  触发事件

	 *	@param 		type ：   事件类型（ 必须的 ）
					fun ： 	  回调函数，当未指定回调时，触发全部回调

	 *	@result		Events
	 *	@example	Event.fire( 'renderafter', fun )
	 				Event.fire( 'renderafter' )
	**/
	fire( type, fun ) {
		if( !type || !Tools.isString( type ) ) return this

		let event = this.createEvent( type );
		if( !!this.listener[type] && Tools.isFun( fun ) ) {
			for( let i = 0 , arr = this.listener[type] ; i < arr.length ; i++ ) {
				if( arr[i] === fun ) {
					fun.call( this, event );
					return this
				} 	
			}
		}

		// 只传了类型，没有指定回调函数
		if( !!this.listener[type] && !Tools.isFun( fun ) ) {
			for( let i = 0 , arr = this.listener[type] ; i < arr.length ; i++ ) {
				arr[i].call( this,  event )
			}
		}
		return this
	}

	/**
	 *  删除事件回调
	 *	注意：回调函数的引用不一致导致无法删除

	 *	@param 		type ：   事件类型（ 必须的 ）
					fun ： 	  回调函数，当未指定回调时，删除全部回调

	 *	@result		Events
	 *	@example	Event.off( 'renderafter', fun )
	 				Event.off( 'renderafter' )
	**/
	off( type, fun ) {
		if( !type || !Tools.isString( type ) ) return this

		if( !!this.listener[type] && Tools.isFun( fun ) ) {
			for( let i = 0 , arr = this.listener[type] ; i < arr.length ; i++ ) {
				if( arr[i] === fun ) {
					arr.splice( i , 1 );
					return this
				} 	
			}
		}

		// 只传了类型，没有指定回调函数，全部置为空
		if( !fun || !Tools.isFun( fun ) ) {
			this.listener[type] = null;
		}

		return this
	}

	/**
	 *  事件对象方法，仅供内部使用

	 *	@param 		type ：   事件类型（ 必须的 ）
	 *	@result		event
	 *	@example	this.createEvent( 'renderafter' )
	**/
	createEvent( type ) {
		return {
			type : type,
		}
	}
};
// 注册到window
window.Event = new Events;