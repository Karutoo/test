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
    if(peer!=undefined){
        peer.disconnect();
        peer.destroy();
    }
    peer = new Peer(document.getElementById("typeID").value,{
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

function copyURL(){
    navigator.clipboard.writeText(peer.id);
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
    webSocket = new WebSocket("ws://localhost:9998")
    setInterval(() => {
        if (webSocket.readyState!=1){//通信ができていない時
            webSocket = new WebSocket("ws://localhost:9998")
            console.log("通信できていません")
            document.getElementById("pyconnected").textContent="ソフトとの連携が行われていません☓";
            document.getElementById("pyconnected").style.color ="#da192f"
        }else{
            document.getElementById("pyconnected").textContent="ソフトとの連携ができています○";
            document.getElementById("pyconnected").style.color ="#06ff82"
            console.log("通信できています！")
        }
    }, 2500);
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
    document.getElementById("setided").style.display ="none";
}

function handleLocalMediaStreamError(error) {
    console.log("navigator.getUserMedia error: ", error);
}