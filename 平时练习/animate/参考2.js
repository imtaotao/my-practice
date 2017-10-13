/* #7888 jQuery.speed
 * 设置参数统一为options对象
---------------------------------------------------------------------- */
// 支持的参数类型（均为可选参数，只有fn会参数提前。无speed设为默认值，无easing在Tween.prototype.init中设为默认值）
// (options)
// (speed [, easing | fn])
// (speed, easing, fn)
// (speed)、(fn)
jQuery.speed = function( speed, easing, fn ) {
    var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
        complete: fn || !fn && easing || jQuery.isFunction( speed ) && speed,
        duration: speed,
        easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
    };

    // jQuery.fx.off控制全局的doAnimation函数生成动画的时长开关
    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
        // 支持 "slow" "fast"，无值则取默认400
        opt.duration in jQuery.fx.speeds ?
            jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

    // true/undefined/null -> 设为默认队列"fx"
    // false不使用队列机制
    if ( opt.queue == null || opt.queue === true ) {
        opt.queue = "fx";
    }

    opt.old = opt.complete;

    // 对opt.complete进行再封装
    // 目的是该函数可以dequeue队列，让队列中下个doAnimation开始执行
    opt.complete = function() {
        // 非函数或无值则不调用
        if ( jQuery.isFunction( opt.old ) ) {
            opt.old.call( this );
        }

        // false不使用队列机制
        if ( opt.queue ) {
            jQuery.dequeue( this, opt.queue );
        }
    };

    return opt;
};


/* #7930 jQuery.fn.animate
 * 外观方法，对每个elem添加动画到队列（默认"fx"队列，为false不加入队列直接执行）
---------------------------------------------------------------------- */
jQuery.fn.animate = function( prop, speed, easing, callback ) {
    // 是否有需要动画的属性
    var empty = jQuery.isEmptyObject( prop ),
        // 参数修正到对象optall
        optall = jQuery.speed( speed, easing, callback ),
        doAnimation = function() {

            // 执行动画，返回一个animation对象（后面详细讲）
            var anim = Animation( this, jQuery.extend( {}, prop ), optall );

            // jQuery.fn.finish执行期间jQuery._data( this, "finish" )设置为"finish"，所有动画创建后都必须立即结束到end，即直接运动到最终状态（后面详细讲）
            if ( empty || jQuery._data( this, "finish" ) ) {
                anim.stop( true );
            }
        };
        // 用于jQuery.fn.finish方法内判断 queue[ index ] && queue[ index ].finish。比如jQuery.fn.delay(type)添加到队列的方法没有finish属性，不调用直接舍弃
        doAnimation.finish = doAnimation;

    return empty || optall.queue === false ?
        // 直接遍历执行doAnimation
        this.each( doAnimation ) :
        // 遍历元素把doAnimation加入对应元素的optall.queue队列
        this.queue( optall.queue, doAnimation );
};