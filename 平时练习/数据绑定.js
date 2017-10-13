Observer.prototype = {
  walk: function ( obj ) {
    let self = this;
    Object.keys( obj ).forEach( key => {
      self.observeProperty( obj, key, obj[key] );
    });
  },
  observeProperty: function ( obj, key, val ) {
    let dep = new Dep();
    let childOb = observe( val );
    Object.defineProperty( obj, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        if ( Dep.target ) {
          dep.depend();
        }
        if ( childOb ) {
          childOb.dep.depend();
        }
        return val;
      },
      set: function( newVal ) {
        if (val === newVal || (newVal !== newVal && val !== val)) {
          return;
        }
        val = newVal;
        // 监听子属性
        childOb = observe( newVal );
        // 通知数据变更
        dep.notify();
      }
    })
  }
}