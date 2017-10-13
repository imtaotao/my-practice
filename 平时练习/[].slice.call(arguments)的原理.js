//查看 V8 引擎 array.js 的源码，可以将 slice 的内部实现简化为：

function slice( start, end ) {   
	var len = ToUint32(this.length), //得到length，不能转化为数值时，返回0
		result = [];   

	for( var i = start; i < end ; i++ ) {   
    	result.push( this[i] );   
	}   

    return result;   
} 

/*
	可以看出，slice 并不需要 this 为 array 类型，只需要有 length 属性即可。
	并且 length 属性可以不为 number 类型，当不能转换为数值时，
	ToUnit32(this.length) 返回 0.
	而类数组对象恰恰有length属性。
*/
