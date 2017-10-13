// #672
		// jQuery.timers 当前正在运动的动画的tick函数堆栈
		// jQuery.fx.timer() 把tick函数推入堆栈。若已经是最终状态，则不加入
		// jQuery.fx.interval 唯一定时器的定时间隔
		// jQuery.fx.start() 开启唯一的定时器timerId
		// jQuery.fx.tick() 被定时器调用，遍历timers堆栈
		// jQuery.fx.stop() 停止定时器，重置timerId=null
		// jQuery.fx.speeds 指定了动画时长duration默认值，和几个字符串对应的值

		// jQuery.fx.off 是用在确定duration时的钩子，设为true则全局所有动画duration都会强制为0，直接到结束状态

		// 所有动画的"每步运动tick函数"都推入timers
		jQuery.timers = [];

		// 遍历timers堆栈
		jQuery.fx.tick = function() {
		    var timer,
		        timers = jQuery.timers,
		        i = 0;

		    // 当前时间毫秒
		    fxNow = jQuery.now();

		    for ( ; i < timers.length; i++ ) {
		        timer = timers[ i ];

		        // 每个动画的tick函数（即此处timer）执行时返回remaining剩余时间，结束返回false
		        // timers[ i ] === timer 的验证是因为可能有瓜娃子在tick函数中瞎整，删除jQuery.timers内项目
		        if ( !timer() && timers[ i ] === timer ) {
		            timers.splice( i--, 1 );
		        }
		    }

		    // 无动画了，则stop掉全局定时器timerId
		    if ( !timers.length ) {
		        jQuery.fx.stop();
		    }
		    fxNow = undefined;
		};

		// 把动画的tick函数加入$.timers堆栈
		jQuery.fx.timer = function( timer ) {
		    jQuery.timers.push( timer );
		    if ( timer() ) {
		        jQuery.fx.start();
		    // 若已经在终点了，无需加入
		    } else {
		        jQuery.timers.pop();
		    }
		};

		// 全局定时器定时间隔
		jQuery.fx.interval = 13;

		// 启动全局定时器，定时调用tick遍历$.timers
		jQuery.fx.start = function() {
		    // 若已存在，do nothing
		    if ( !timerId ) {
		        timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		    }
		};

		// 停止全局定时器timerId
		jQuery.fx.stop = function() {
		    window.clearInterval( timerId );
		    timerId = null;
		};

		// speeds（即duration）默认值，和字符串的对应值
		jQuery.fx.speeds = {
		    slow: 600,
		    fast: 200,

		    // Default speed，默认
		    _default: 400
		};