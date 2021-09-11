"user strict";
var issvideo
let localStream;
var ID
var dataConnection
var iswebsocket=0
var webSocket
var peer = new Peer(ID,{
    key: 'c2ad39ff-ed02-41e1-b1f1-c918871c1f28',
    debug: 3
});

var url = new URL(window.location.href);
var params = url.searchParams;

var ID
var dataConnection=0

keylists=
["dwad", "wadada","dwadawd", " ", "!", '"', "#",  "$", "%", "&", "'", "(",
")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7",
"8", "9", ":", ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "_", "wakarann",
"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
"p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~",
"accept", "add", "alt", "altleft", "altright", "apps", "Backspace",
"browserback", "browserfavorites", 'browserforward', 'browserhome',
'browserrefresh', 'browsersearch', 'browserstop', 'CapsLock', 'clear',
'convert', 'Control', 'ctrlleft', 'ctrlright', 'decimal', 'del', 'delete',
'divide', 'ArrowDown', 'End', 'Enter', 'esc', 'Escape', 'execute', 'F1', 'F10',
'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F2', 'F20',
'F21', 'F22', 'F23', 'F24', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9',
'final', 'fn', 'hanguel', 'hangul', 'Hankaku', 'help', 'home', 'insert', 'Zenkaku',
"Hiragana", "kanji", 'launchapp1', 'launchapp2', 'launchmail',
'launchmediaselect', 'ArrowLeft', 'modechange', 'multiply', 'nexttrack',
'nonconvert', 'num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6',
'num7', 'num8', 'num9', 'numlock', 'PageDown', 'PageUp', 'Pause', 'pgdn',
'pgup', 'playpause', 'prevtrack', 'print', 'PrintScreen', 'prntscrn',
'prtsc', 'prtscr', 'return', 'ArrowRight', 'scrolllock', 'select', 'separator',
'Shift', 'shiftleft', 'shiftright', 'sleep', 'space', 'stop', 'subtract', 'Tab',
'ArrowUp', 'volumedown', 'volumemute', 'volumeup', 'Meta', 'winleft', 'winright', "\\",
'command', 'option', 'optionleft', 'optionright'
]

document.getElementById("prevideo").addEventListener('mousewheel', Scroll);
function Scroll (event){
    event.preventDefault();
    dataConnection.send("scroll,"+event.wheelDelta)
    console.log(event.wheelDelta)
}
document.getElementById("prevideo").addEventListener('mousemove', Mousemove);
var _changeData = _.throttle(function (event) {
    var vwidth = document.getElementById("prevideo").videoWidth ;
    var vheight = document.getElementById("prevideo").videoHeight ;
    var dwidth = document.getElementById("prevideo").clientWidth ;
    var dheight = document.getElementById("prevideo").clientHeight ;
    if (dataConnection!=0){
        dataConnection.send("moveTo,"+event.offsetX/dwidth+","+event.offsetY/dheight)
    }
    console.log(event.offsetX*vwidth/dwidth)
    console.log(vwidth)
    console.log(event.offsetY*vheight/dheight)
  }, 150);
function Mousemove(event){
    _changeData(event)
}
document.getElementById("prevideo").addEventListener('mousedown', Mousedown);
function Mousedown(event){
    if(event.which==1){//左クリック
        dataConnection.send("mouseDown,left")
    }else if(event.which==2){//ホイールクリック
        dataConnection.send("mouseDown,middle")
    }else if(event.which==3){//右クリック
        dataConnection.send("mouseDown,right")
    }
    console.log("マウスダウン！")
}
document.getElementById("prevideo").addEventListener('mouseup', Mouseup);
function Mouseup(event){
    if(event.button==0){//左クリック離す
        dataConnection.send("MouseUp,left")
    }else if(event.button==1){//ホイールクリック離す
        dataConnection.send("MouseUp,middle")
    }else if(event.button==2){//右クリック離す
        dataConnection.send("MouseUp,right")
    }
    console.log("マウスアップ！")
}
document.getElementById("prevideo").addEventListener('keydown', Keydown);
function Keydown(event){
    event.keyCode = null;
    event.returnValue = false;
    var hikaku
    if(event.key.length==1){
        hikaku=event.key.toLowerCase()
    }else{
        hikaku=event.key
    }
    if(keylists.indexOf(hikaku)){
        //console.log(keylists.indexOf(hikaku))
        dataConnection.send("keyDown,"+keylists.indexOf(hikaku))
    }
    console.log("↓ダウン")
    console.log(event)
    console.log(keylists.indexOf(hikaku))
}
document.getElementById("prevideo").addEventListener('keyup', Keyup);
function Keyup(event){
    var hikaku
    var retan
    if(event.key.length==1){
        hikaku=event.key.toLowerCase()
    }else{
        hikaku=event.key
    }
    if(hikaku=="Hankaku"){
        hikaku="Zenkaku"
    }else if(hikaku=="Zenkaku"){
        hikaku="Hankaku"
    }
    if(keylists.indexOf(hikaku)){
        dataConnection.send("keyUp,"+keylists.indexOf(hikaku))
        //console.log(keylists.indexOf(hikaku))
    }
    console.log("↓アップ")
    console.log(event)
    console.log(keylists.indexOf(hikaku))
}
//スタートボタンが押されたときidboxに入ってるidでpeer connectを行う
function startB() {
    console.log(document.getElementById('typeID').value)
    dataConnection = peer.connect(document.getElementById('typeID').value);
    mediaConnection = peer.call(document.getElementById('typeID').value, localStream);
    setEventListener(mediaConnection);
}
//peerが接続できたときidを画面に表示する
peer.on('open', () => {
    console.log("connected")
});
//detachannelに接続できたとき
peer.on("connection", (conn) => {
    document.getElementById('getconnected').textContent = "接続されました";
    //dataが送られたとき発火
    conn.on("data", ({ name, msg }) => {
        //console.log(`${name}: ${msg}`);
        // => 'SkyWay: Hello, World!'
        webSocket.send(msg);
    });
});

window.onload = function() {
    document.getElementById('typeID').value=params.get('id');
    if(params.get('id')!=null){
        startB()
    }
}
const setEventListener = mediaConnection => {
    mediaConnection.on('stream', stream => {
      // video要素にカメラ映像をセットして再生
      const videoElm = document.getElementById('prevideo')
      videoElm.srcObject = stream;
      videoElm.play();
    });
}
document.getElementById("prevideo").addEventListener('mouseenter', e => {
    issvideo=1
    console.log("videoに入ったよ！")
});
document.getElementById("prevideo").addEventListener('mouseleave', e => {
    issvideo=0
    console.log("videoから出たよ！")
});
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

//ランダムなIDで開始する
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

window.addEventListener("resize", windowResizeFunc);
document.getElementById("resize").style.width=document.body.clientWidth/3*1.7+"px"
document.getElementById("resize").style.height="auto"
function resizeElement(){
    document.getElementById("resize").style.width=document.body.clientWidth/3*1.7+"px"
    document.getElementById("resize").style.height="auto"
}

var mouserange=4
var bordersize=4
var pading = 5
var OVERMOUSEX
var OVERMOUSEY
var isdrag
var isupdown
document.body.addEventListener('mousemove', function(e) {
    var Vtag=document.getElementById('resize')
    var btag=document.body
    OVERMOUSEX=e.clientX
    OVERMOUSEY=e.clientY
    var vwidth = document.getElementById("prevideo").videoWidth ;
	var vheight = document.getElementById("prevideo").videoHeight ;
    if(isdrag){
        if(isupdown){
            if(btag.clientWidth>vwidth/vheight*Math.abs((OVERMOUSEY-document.body.clientHeight/2)*2)+(bordersize+pading)*2 && btag.clientHeight>Math.abs((OVERMOUSEY-document.body.clientHeight/2)*2)+(bordersize+pading)*2){
                Vtag.style.width=vwidth/vheight*Math.abs((OVERMOUSEY-document.body.clientHeight/2)*2)+"px"
                Vtag.style.height=Math.abs((OVERMOUSEY-document.body.clientHeight/2)*2)+"px"
            }
        }else{
            if(btag.clientWidth>Math.abs((OVERMOUSEX-document.body.clientWidth/2)*2)+(bordersize+pading)*2 && btag.clientHeight>vheight/vwidth*Math.abs((OVERMOUSEX-document.body.clientWidth/2)*2)+(bordersize+pading)*2){
                Vtag.style.width=Math.abs((OVERMOUSEX-document.body.clientWidth/2)*2)+"px"
                Vtag.style.height=vheight/vwidth*Math.abs((OVERMOUSEX-document.body.clientWidth/2)*2)+"px"
            }
        }
    }
})
document.body.addEventListener('mouseup', function(e) {
    console.log("話されまskた")
    isdrag=false
})
document.body.addEventListener('mouseleave', function(e) {
    console.log("話されまskた")
    isdrag=false
})
document.getElementById('resize').addEventListener('mousemove', function(e) {
    //console.log(e.pageX, e.pageY, e.clientX, e.clientY, e.offsetX, e.offsetY)
    var Ex=e.offsetX+bordersize
    var Ey=e.offsetY+bordersize
    var Vtag=document.getElementById('resize')
    var onlycor
    var left,right,up,down
    window.getSelection().removeAllRanges()
    if(Ex<mouserange){
        console.log("左端です！")
        left=true
        onlycor="left"
    }
    if(Ey<mouserange){
        console.log("上端です！")
        up=true
    }
    if(Ex>Vtag.clientWidth-mouserange){
        console.log("右端です！")
        right=true
    }
    if(Ey>Vtag.clientHeight-mouserange){
        console.log("下端です！")
        down=true
    }
    if((left && up) || (right && down)){//左上.右下
        Vtag.style.cursor="nwse-resize"
    }else if((right && up) || (left && down)){//右上.左下
        Vtag.style.cursor="nesw-resize"
    }else if(left || right){//左右
        Vtag.style.cursor="ew-resize"
    }else if(up || down){//上下
        Vtag.style.cursor="ns-resize"
    }else{
        Vtag.style.cursor="auto"
    }
})

document.getElementById('resize').addEventListener('mousedown', function(e) {
    var Ex=e.offsetX+bordersize
    var Ey=e.offsetY+bordersize
    var Vtag=document.getElementById('resize')
    if(Ex<mouserange||Ey<mouserange||Ex>Vtag.clientWidth-mouserange||Ey>Vtag.clientHeight-mouserange){
        isdrag=true
    }
    if(Ey<mouserange||Ey>Vtag.clientHeight-mouserange){
        isupdown=true
    }else{
        isupdown=false
    }
})