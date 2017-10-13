let $$ = function( select, parent ) {
	return !!parent ? parent.querySelectorAll( select ) : document.querySelectorAll( select );
};
let filter = {};
const hz = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const filterMusic = {
	defind			: [ 0, 0, 0, 0,  0, 0, 0, 0, 0, 0 ],	// 自定义
	slowSong 		: [ 5, 4, 2, 0, -2, 0, 3, 6, 7, 8 ],	// 慢歌
	jazz 			: [ 0, 0, 0, 5, 5, 5, 0, 3, 4, 5 ],		// 爵士
	classical 		: [ 0, 0, 0, 0, 0, 0, -6, -6, -6, -8 ],	// 古典
	blues 			: [ 3, 6, 8, 3, -2, 0, 4, 7, 9, 10 ],	// 蓝调
	dance 			: [ 7, 6, 3, 0, 0, -4, -6, -6, 0, 0 ],	// 舞曲
	popular			: [ 4, 2, 0, -3, -6, -6, -3, 0, 1, 3 ],	// 流行
	electronicMusic : [ 6, 5, 0, -5, -4, 0, 6, 8, 8, 7 ],	// 电子乐
	rocking 		: [ 7, 4, -4, 7, -2, 1, 5, 7, 9, 9 ],	// 摇滚
	rural 			: [ 5, 6, 2, -5, 1, 1, -5, 3, 8, 5 ]	// 乡村
};

$$.alert = function( text , duration ) {
	duration = !isNaN( duration ) ? duration : 1000;

    let showBox = document.createElement('div');
    showBox.innerHTML = text;

    showBox.style.cssText =   'width:60%;'
    						+ 'min-width:150px;' 
    						+ 'background:#000;' 
    						+ 'opacity:0.5;' 
    						+ 'height:40px;' 
    						+ 'color:#fff;' 
    						+ 'line-height:40px;'
    						+ 'text-align:center;' 
    						+ 'border-radius:5px;' 
    						+ 'position:fixed;' 
    						+ 'top:30%;' 
    						+ 'left:20%;' 
    						+ 'z-index:999999;' 
    						+ 'font-weight:bold;';

    document.body.appendChild( showBox );

    setTimeout( function () {
        showBox.style.webkitTransition = '-webkit-transform 0.5s ease-in, opacity 0.5s ease-in';
        showBox.style.opacity = '0';
        setTimeout( function () {
            document.body.removeChild( showBox );
        }, 500 );
    }, duration );
};

// 过滤器
$$.createFilter = function( ac, value, gainValue ) {
	const ra = ac.createBiquadFilter();
	ra.type = 'peaking';
	ra.Q.value = 10;
	ra.frequency.value = value;
	ra.gain.value = gainValue || 0;

	filter[value] = ra;
	return ra;
};

$$.isEmptyObject = function( obj ) {
	let name;
	for ( name in obj ) {
		return false;
	}
	return true;
};

// 封装 ajax
$$.ajax = function( opt ) {
	let xhr = new XMLHttpRequest();
	xhr.open( opt.method, opt.url );
	!!opt.dataType && ( xhr.responseType = opt.dataType );
	xhr.onload = opt.success;
	xhr.send( opt.parma );
}

// 音响效果	
// effect( 'hat.wav' );		// 感觉没效果
// effect( 'irHall.ogg' );	// 音乐厅里面的效果
// effect( 'kick.wav' );	// 很难听
// effect( 'snare.wav' );	// 感觉和音乐厅差不错
// effect( 'tin.wav' );		// 也很难听			

$$.loop = false;


// 混响文件获取
function effect( name ) {
	$$.ajax({
		url : `./getEffect?name=${name}`,
		method: 'GET',
		dataType : 'arraybuffer',
		success: function( res ) {
			const file = res.target.response;
			console.log( file )
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			const ac = new AudioContext();
			ac.decodeAudioData( file,  buffer => {
				$$.sound = buffer;
			});
		}
	})
};

// 暂停/播放按钮切换
$$.togglePlay = function( ac ) {
	if( !ac ) return;

	if( !this.open ) {
		this.open = true;
		this.innerHTML = '播放';
		ac.suspend();
	}else {
		this.open = false;
		this.innerHTML = '暂停';
		ac.resume();
	};
}

// 切换 class
$$.addActive = function( dom ) {
	dom.classList.add( 'active' );
	Array.from( $$( 'li.active', dom.parentElement ) ).forEach( ( li ) => {
		if( li !== dom ) {
			li.classList.remove( 'active' );
		};
	});
	
};

// 切换音效 class
$$.addFilterActive = function( dom ) {
	dom.classList.add( 'filter-active' );
	Array.from( $$( '.filter-model span', dom.parentElement ) ).forEach( ( span ) => {
		if( span !== dom ) {
			span.classList.remove( 'filter-active' );
		};
	});
};

// 解码 arraybuffer
$$.decode = function( file, callback ) {
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const ac = new AudioContext();
	const source = ac.createBufferSource();
	const gainNode = ac[ac.createGain ? 'createGain' : 'createGainNode']();
	const convolver = ac.createConvolver();

	// 赋值给 $$.-- 弄到全局
	$$.ac = ac;
	$$.source = source;

	ac.decodeAudioData( file, buffer => {
		$$.buffer = buffer;
		callback( buffer, ac, source, gainNode, convolver );
	});
};

$$.nextPlay = function( timeout ) {
	let li = this.nextElementSibling;
	if( !li ) {
		li = $$( '.music-box li:not(:first-child)' )[0];
	};

	// 开始下一首歌
	!$$.loop && $$.getLyrics.call( li );
};

// 音量控制器
$$.volumeCtrl = function( dom, gainNode ) {
	const sound = dom.value / dom.max
	gainNode.gain.value = sound * sound;

	dom.oninput = function( e ) {
		const percent = this.value / this.max;
		gainNode.gain.value = percent * percent;
	};
};

// 进度条切换进度
$$.progress = function( duration ) {
	return function( e ) {
		// 清除定时器，避免进度条操作混淆
		clearTimeout( $$.timeout );
		$$.timeout = null;
		// 因为快进是重新创建音频节点，等于是从第一次播放
		$$.times = 0;

		const currentime = this.value / 100 * duration;
		const text = Math.floor(( currentime / 60 )) + ':' + Math.floor(( currentime % 60 ));
		$$( '#js_currentTime' )[0].innerHTML = text;
		this.style.backgroundSize = `${this.value}% 100%`;
	}
};

$$.addProgress = function( dom, duration ) {
	if( !$$.progress.first ) {
		$$.progress = $$.progress( duration )
		$$.progress.first = true;
	};

	dom.addEventListener( 'input', $$.progress );
};

$$.removeProgress = function( dom ) {
	dom.removeEventListener( 'input', $$.progress );
};


$$.parse = function( arr, info ) {
	let obj;
	if( !!info ) {
		!!arr && ( obj = {} );
		!!arr &&　arr.forEach( val => {
			val = val.replace( ']', '' );
			// 歌曲名字
			if( val.includes( 'ti' ) ) {
				obj.name = val.replace( '[ti:', '' );
			};
			// 演唱者
			if( val.includes( 'ar' ) ) {
				obj.author = val.replace( '[ar:', '' );
			};
		});
	} else {
		!!arr && ( obj = {} );
		!!arr &&　arr.forEach( val => {
			val = val.split( ']' );
			const time = val[0].slice( 0, val[0].length - 3 ).replace( '[', '' ).split( ':' );
			const num = time[0] * 60 + Number( time[1] );
			obj[num] = val[1];
		});

	};
	return obj;
};

$$.astLyrics = function( text ) {
	const ast = {};
	const info = /\[\w+:([\u4e00-\u9fa5]+|.+)\]/g;
	const content = /\[\d+:\d+.\d+].+/g;

	ast.infomation = $$.parse( text.match( info ), true ) ;
	ast.content = $$.parse( text.match( content ) );

	return ast;
};

$$.getLyrics = function() {
	const self = this;
	// 判断是否在解码一首歌曲
	if( !$$.isdecode ) {
		!!$$.ac && $$.ac.close();
		!!$$.source && $$.source[$$.source.stop ? 'stop' : 'noteOff']();
		clearTimeout( $$.timeout );
		$$.timeout = null;

		const name = $$( 'span:first-child', this )[0].innerHTML;

		// 先请求音乐歌词文件
		$$( '#js_lyricsFont' )[0].innerHTML = '......';
		$$.ajax({
			method : 'GET',
			url : `./getMusicLyrics?name=${name}`,
			success : function( res ) {
				res = res.target.response;
				if( !res ) {
					// 没有歌词直接请求音频文件
					$$( '#js_lyricsFont' )[0].innerHTML = '暂无歌词';
					getData.call( self, name )
				}else{
					// 解析歌词
					const ast = $$.astLyrics( res );
					if( !!ast.infomation && !!ast.infomation.name && !!ast.infomation.author ) {
						$$( '#js_lyricsFont' )[0].innerHTML = ast.infomation.name + ' -- ' + ast.infomation.author;
					};
					getData.call( self, name, ast.content )	
				}
			}
		});
	};
};

// 逻辑处理
Array.from( $$( '.music-box li:not(:first-child)' ) ).forEach( ( li ) => {
	li.addEventListener( 'click', function( e ) {
		$$.getLyrics.call( this )
	});
});

// 点击歌曲列表
$$( '#js_play' )[0].addEventListener( 'click', function( e ) {
	$$.togglePlay.call( this, $$.ac );
});

// 手动点击进度条快进结束的时候
$$( '#js_progress' )[0].onchange = function( e ) {
	if( !$$.ac ) return;
	// 先前的歌曲停止，从同一套资源中创建一个source，指定播放时间
	$$.source[$$.source.stop ? 'stop' : 'noteOff']();
	$$.ac.close();

	// 重新创建一套节点，指定播放时间
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const ac = new AudioContext();
	const source = ac.createBufferSource();
	const gainNode = ac[ac.createGain ? 'createGain' : 'createGainNode']();
	$$.ac = ac;
	$$.source = source;


	// 相互连接
	gainNode.connect( ac.destination );

	if( !!$$.sound ) {
		convolver.connect( gainNode );
		convolver.buffer = $$.sound;	// 音响文件
		var preFilet = convolver;
	}else {
		var preFilet = gainNode;
	}

	for( let i = 0; i < 10; i++ ) {
		gainValue = document.getElementById( '' + hz[i] ).value - 14 
		const nowFilet = $$.createFilter( ac, hz[i], gainValue * 1.5 );
		nowFilet.connect( preFilet );
		preFilet = nowFilet;
	};

	source.connect( preFilet );

	// 设定当前播放时间
	source.buffer = $$.buffer;
	source.loop = $$.loop;
	const currentPlay = source.buffer.duration * ( this.value / 100 );
	source[source.start ? 'start' : 'noteOn']( 0, currentPlay );
	$$.volumeCtrl( $$( '#js_volume' )[0] , gainNode );
	source.loopStart = 0;	// 重复播放从0开始

	$$( '#js_play' )[0].innerHTML = '暂停';
	$$( '#js_play' )[0].open = false;
	$$.proBar( ac, currentPlay, true );
};

function getData( name, ast ) {
	const self = this;
	// 正在解码
	$$.isdecode = true;
	// 切换 li 状态
	$$.addActive( self );

	$$.ajax({
		method : 'GET',
		dataType : 'arraybuffer',
		url : `./getMusic?name=${name}`,
		success : function( res ) {
			file = res.target.response;
			// 解码后处理
			$$.decode( file, ( buffer, ac, source, gainNode, convolver ) => {
				// 相互连接
				gainNode.connect( ac.destination );
				if( !!$$.sound ) {
					convolver.connect( gainNode );
					convolver.buffer = $$.sound;	// 音响文件
					var preFilet = convolver;
				}else {
					var preFilet = gainNode;
				}

				for( let i = 0; i < 10; i++ ) {
					const nowFilet = $$.createFilter( ac, hz[i] );
					nowFilet.connect( preFilet );
					preFilet = nowFilet;
				};
				
				source.connect( preFilet );

				// 播放
				source.buffer = buffer;
				source.loop = $$.loop;
				source[source.start ? 'start' : 'noteOn']( 0 );
				$$( '#js_play' )[0].innerHTML = '暂停';

				if( !$$.changeFilter.open ) {
					$$.changeFilter();	//均衡器
					$$.changeFilter.open  = true;
				}

				$$.isdecode = false;


				// 音频动画操作
				$$.times = 0;	// 重复播放计数
				const duration = source.buffer.duration;
				const sumTimeMin = Math.floor( ( duration / 60 ) ) + ':' + Math.floor( ( duration % 60 ) );
				
				// 音量控制器
				$$.volumeCtrl( $$( '#js_volume' )[0] , gainNode );
				// 进度条控制
				$$.addProgress( $$( '#js_progress' )[0], duration );


				// 显示时长
				$$( 'span:last-child', self )[0].innerHTML = sumTimeMin;
				$$( '#js_sumTime' )[0].innerHTML = sumTimeMin;
				$$( '#js_lyricsFont' )[0].innerHTML = !!ast ? ast[0] : '暂无歌词';

				const domcurrentTime = $$( '#js_currentTime')[0];
				const domprogress = $$( '#js_progress' )[0];

				/*
					ac 		: audioContext
					difTime : 时间差 ——> 用于快进和后退，在原来时间线上加的
				*/
				$$.proBar = function( ac, difTime, progress ) {
					$$.timeout = setTimeout( () => {
						// 放在前面也没事，只要不放在后面就好
						$$.proBar( ac, difTime, progress );
						// 歌曲重复播放时做的处理
						let currentTime = ( ac.currentTime - duration * $$.times ) + difTime;
						let currentTimeMin = Math.floor( ( currentTime / 60 ) ) + ':' + Math.floor( ( currentTime % 60 ) );
						
						if( currentTime >= duration ) {
							$$.times++;
							currentTime = duration;
							if( !!progress && !$$.loop ) {
								$$.nextPlay.call( self );
							};
						};

						// 计算百分比并且更新dom
						const procent = Math.floor( ( currentTime / duration ) * 100 );
						domcurrentTime.innerHTML = currentTimeMin + ' / ';
						domprogress.style.backgroundSize = `${procent}% 100%`;
						domprogress.value = Math.floor( procent );

						// 处理歌词同步
						if( !!ast ) {
							// 提前一秒把歌词显示出来
							const nowTime =  Math.floor( currentTime );
							if( !!ast[nowTime] ) {
								$$( '#js_lyricsFont' )[0].innerHTML = ast[nowTime];
							};
						};
					}, 17 );
				};
				$$.proBar( ac, 0 );

				// 歌曲结束的时候
				$$.source.onended = function( e ) {
					console.log( '结束了' );
					$$.nextPlay.call( self );
				};
			});
		}
	});
};


// 歌曲播放模式选择
Array.from( $$( '[data-select=true]>ul li' ) ).forEach( val => {
	val.addEventListener( 'click', function( e ) {
		if( this.innerHTML === '单曲循环' ) {
			$$.loop = true;
			$$.source.loop = true;
		};

		if( this.innerHTML === '顺序播放' ) {
			$$.loop = false;
			$$.source.loop = false;
		};
	});
});


// 音效选择（效果在qq音乐的基础上放大1.3倍，不然感觉效果不明显）
$$( '#js_filterModel' )[0].addEventListener( 'click', function( e ) {
	const target = e.target;
	// 如果没有播放是没有效果的
	if( $$.isEmptyObject( filter ) ) {
		$$.alert( '必须播放歌曲时才能切换' )
		return;
	};

	if( target.nodeName === 'SPAN' ) {
		const model = target.getAttribute( 'data-name' );
		const param = filterMusic[model];

		// 切换均衡器的 数据
		hz.forEach( ( val, i ) => {
			filter[val].gain.value = param[i] * 1.5;
			document.getElementById( '' + val ).value = param[i] + 14;
		});

		// 切换 class
		$$.addFilterActive( target );
	};
});

// 均衡器添加事件
$$.changeFilter = function() {
	hz.forEach( val => {
		document.getElementById( '' + val ).addEventListener( 'input', function( e ) {
			const value = ( this.value - 14 )  * 1.5;
			filter[val].gain.value = value;
		});
	});
};