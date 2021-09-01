"user strict";
let localStream;
var peer
const localVideo = document.querySelector("video");
const mediaStreamConstraints = {
    audio: {
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 2
    },
    video: {
      //width: 1280,
      //height: 720, 
      mediaSource: "screen",
      "frameRate": {"max": 60}
    } 
};

var ID
var dataConnection
var iswebsocket=0
var webSocket
document.getElementById("start").style.display ="none";
document.getElementById("setided").style.display ="none";
//ランダムなIDで開始する
document.getElementById('start_r').onclick = function() {
    peer = new Peer({
        key: 'c2ad39ff-ed02-41e1-b1f1-c918871c1f28',
        debug: 3
    });
    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream, {videoBandwidth: 14000, audioBandwidth: 4000});
        setEventListener(mediaConnection);
    });
    peer.on('open', () => {
        alert("画面共有開始します！")
        navigator.mediaDevices
            .getDisplayMedia(mediaStreamConstraints)
            .then(gotLocalMediaStream)
            .catch(handleLocalMediaStreamError);
    });
    peer.on("connection", (conn) => {
        //document.getElementById('getconnected').textContent = "接続されました";
        //dataが送られたとき発火
        conn.on("data", (data) => {
            //console.log(`${name}: ${msg}`);
            // => 'SkyWay: Hello, World!'
            try {
                webSocket.send(data);
                document.getElementById('dame').style.display ="none"
            } catch (error) {
                document.getElementById('dame').style.display ="block"
            }
        });
    });
}

document.getElementById('start_id').onclick = function() {
    document.getElementById("setided").style.display ="block";
    document.getElementById("2start").style.display ="none";
}

document.getElementById('start_set_id').onclick = function() {
    document.getElementById("start").style.display ="block";
    document.getElementById("setided").style.display ="none";
}


var resizeFlg;    //setTimeoutの待機中かを判定するフラグ

function windowResizeFunc(){
    
    //resizeFlgに値が設定されている場合は、待ち時間中なのでリセットする
    if (resizeFlg !== false) {
        clearTimeout(resizeFlg);
    }
    //300ms待機後にリサイズ処理を実施する
    resizeFlg = setTimeout( function() {
        resizeElement();    //リサイズを実施する処理
    }, 0);
}

window.onload = function(){
    setInterval(() => {
        webSocket = new WebSocket("ws://localhost:9998")
    }, 5000);
}

window.addEventListener("resize", windowResizeFunc);
document.getElementById("prevideo").style.width=document.body.clientWidth/3*1.5+"px"
function resizeElement(){
    document.getElementById("prevideo").style.width=document.body.clientWidth/3*1.5+"px"
}

function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
    document.getElementById("start").style.display ="block";
    document.getElementById("bstart").style.display ="none";
}

function handleLocalMediaStreamError(error) {
    console.log("navigator.getUserMedia error: ", error);
}