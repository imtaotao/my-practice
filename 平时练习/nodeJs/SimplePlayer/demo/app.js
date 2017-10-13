// fork getUserMedia为多个浏览器版本，为那些
// 需要前缀

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

// 为多个浏览器设置分支的Web音频上下文
// window. 是否需要Safari扩展

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var voiceSelect = document.getElementById("voice");
var source;
var stream;

// 抓住静音按钮使用下面
var mute = document.querySelector('.mute');

//设置我们将用于该应用的不同音频节点

var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();

// 扭曲曲线为波导，感谢凯文恩尼斯
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
};

//通过 XHR 为卷积器节点抓取音轨

var soundSource, concertHallBuffer;

ajaxRequest = new XMLHttpRequest();

ajaxRequest.open('GET', '../getMusic?name=融化', true);

ajaxRequest.responseType = 'arraybuffer';


ajaxRequest.onload = function( res ) {
    var audioData = res.target.response;

    audioCtx.decodeAudioData(audioData, function(buffer) {
        console.log( buffer )
        concertHallBuffer = buffer;
        soundSource = audioCtx.createBufferSource();
        soundSource.buffer = concertHallBuffer;
        convolver.buffer = concertHallBuffer;
        
        // 连接
        soundSource.connect(biquadFilter);
        biquadFilter.connect(convolver);
        convolver.connect( gainNode );
        gainNode.connect( audioCtx.destination );

        soundSource.loop = true;
        soundSource.start(0);
    }, function(e){"Error with decoding audio data" + e.err});
}

ajaxRequest.send();

// 为可视化设置画布上下文

var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

var intendedWidth = document.querySelector('.wrapper').clientWidth;

canvas.setAttribute('width',intendedWidth);

var visualSelect = document.getElementById("visual");

var drawVisual;

//进行录音的主要方块

if ( navigator.getUserMedia ) {
    console.log('getUserMedia supported.');
    navigator.getUserMedia (
        // constraints - 这个应用程序只需要音频
        {
            audio: true
        },

        // Success 回调
        function(stream) {
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.connect(distortion);
            distortion.connect(biquadFilter);
            biquadFilter.connect(convolver);
            convolver.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            visualize();
            voiceChange();

        },

        // Error 回调
        function(err) {
            console.log('The following gUM error occured: ' + err);
        }
    );
} else {
    console.log('getUserMedia not supported on your browser!');
}

function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;


    var visualSetting = visualSelect.value;
    console.log( visualSetting );

    if(visualSetting == "sinewave") {
        analyser.fftSize = 2048;
        var bufferLength = analyser.fftSize;
        console.log(bufferLength);
        var dataArray = new Uint8Array(bufferLength);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        var draw = function() {

            drawVisual = requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'rgb(200, 200, 200)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            canvasCtx.beginPath();

            var sliceWidth = WIDTH * 1.0 / bufferLength;
            var x = 0;

            for( var i = 0; i < bufferLength; i++ ) {

                var v = dataArray[i] / 128.0;
                var y = v * HEIGHT/2;

                if(i === 0) {
                  canvasCtx.moveTo(x, y);
                } else {
                  canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height/2);
            canvasCtx.stroke();
        };

        draw();

    } else if( visualSetting == "frequencybars" ) {
        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        var dataArray = new Uint8Array(bufferLength);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        var draw = function() {
            drawVisual = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            var barWidth = (WIDTH / bufferLength) * 2.5;
            var barHeight;
            var x = 0;

            for(var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

            x += barWidth + 1;
            }
        };

        draw();

    } else if(visualSetting == "off") {
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.fillStyle = "red";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    }

}

function voiceChange() {

    distortion.oversample = '4x';
    biquadFilter.gain.value = 0;
    convolver.buffer = undefined;

    var voiceSetting = voiceSelect.value;
    console.log(voiceSetting);

    if(voiceSetting == "distortion") {
        distortion.curve = makeDistortionCurve(400);

    } else if(voiceSetting == "convolver") {
        convolver.buffer = concertHallBuffer;

    } else if(voiceSetting == "biquad") {
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = 25;

    } else if(voiceSetting == "off") {
        console.log("Voice settings turned off");
    }

}

// 事件侦听器来改变可视化和语音设置

visualSelect.onchange = function() {
    window.cancelAnimationFrame(drawVisual);
    visualize();
}

voiceSelect.onchange = function() {
    voiceChange();
}

mute.onclick = voiceMute;

function voiceMute() {
    if(mute.id == "") {
        gainNode.gain.value = 0;
        mute.id = "activated";
        mute.innerHTML = "Unmute";
    } else {
        gainNode.gain.value = 1;
        mute.id = "";
        mute.innerHTML = "Mute";
    }
}