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
        alert("画面全体の画面(モニターが複数ある方は画面1)を選択し、共有をしてください")
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
    if(document.getElementById("typeID").value==""){
        alert("文字を入力して下さい！")
        return;
    }
    if(document.getElementById("typeID").value.match(/^[A-Za-z0-9_-]+(?:[ _-][A-Za-z0-9]+)*$/)==null){
        alert("半角英数字,半角スペース, _, - を許容し、最大63文字でIDを設定してください。")
        return;
    }
    peer = new Peer(document.getElementById("typeID").value,{
        key: 'c2ad39ff-ed02-41e1-b1f1-c918871c1f28',
        debug: 3
    });
    peer.on("error", (error) => {
        alert("エラーです違う文字列を設定してください")
        return;
    })
    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream, {videoBandwidth: 14000, audioBandwidth: 4000});
        setEventListener(mediaConnection);
    });
    peer.on('open', () => {
        alert("画面全体の画面(モニターが複数ある方は画面1を)選択し、共有をしてください")
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

function start_id_back (){
    document.getElementById("setided").style.display ="none";
    document.getElementById("2start").style.display ="block";
}

function copyURL(){
    navigator.clipboard.writeText("https://radiconscreen/controll/?id="+peer.id);
    document.getElementById("pyconnected").textContent="URLをコピーしました！";
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
            document.getElementById("pyconnected").textContent="❌ソフトが起動していません(操作できない)❌";
            document.getElementById("pyconnected").style.color ='#da192f'
            document.getElementById("divpyconnected").style.background ='#FFF'
        }else{
            document.getElementById("pyconnected").textContent="🟢遠隔操作が可能な状態です🟢";
            document.getElementById("pyconnected").style.color ='#FFF'
            document.getElementById("divpyconnected").style.background ='#90daa3'
            console.log("通信できています！")
        }
    }, 2500);
}


window.addEventListener("resize", windowResizeFunc);
document.getElementById("prevideo").style.width=document.body.clientWidth/3*1.1+"px"
function resizeElement(){
    document.getElementById("prevideo").style.width=document.body.clientWidth/3*1.1+"px"
}

function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
    document.getElementById("start").style.display ="block";
    document.getElementById("bstart").style.display ="none";
    document.getElementById("setided").style.display ="none";
    document.getElementById("my-id").textContent='あなたのIDは："'+peer.id+'"です';
}

function handleLocalMediaStreamError(error) {
    console.log("navigator.getUserMedia error: ", error);
}