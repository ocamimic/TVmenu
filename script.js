const tvscreen = document.getElementById('screen');
//ウィンドウの幅を基準にスクリーンの大きさとダイヤルの直径を調整
function resizeTV() {
var scr = tvscreen.style;
scr.width = (window.innerWidth * 0.6) + 'px';
scr.height = (window.innerWidth * 0.4) + 'px';
document.querySelector("#dial").style.setProperty('--d', (window.innerWidth * 0.15) + 'px');
}
//ListPagesで表示するページの名前と表示メッセージ
const urls = [['ダイヤルからページを選べます', 'top'], ['著作リスト', 'listofworks'], ['自著語り', 'aboutworks'], ['人事', 'personnel'], ['コンテスト情報', 'event'], ['ocamiについて', 'aboutme']];
const step = 360 / urls.length;
//与えられたangleをスナップの段階に合わせる
const snap = (angle) => {
return Math.round(angle / step) * step;
};
// HTMLの方に中身を追加
for (var i = 0; i < urls.length; i++) {
    var link = "'" + 'http://scp-jp.wikidot.com/author:ocami/offset/1/' + urls[i][1] + '_limit/1' + "'";
tvscreen.insertAdjacentHTML('beforeend', '<a class="pages" onclick="parent.location.href = ' + link + '"">' + urls[i][0] + '</a>');
}
//ページの一覧を取得し、最初のページを表示
const pages = document.querySelectorAll('#screen a.pages');
pages[0].classList.add('selected');
//スナップ時にスクリーンの中身を切り換え
function changeChannel(n) {
pages[n].classList.add('selected');
}
/*
ここからダイヤル関係
まずをスクロールの切り換える関数
*/
function handle(event) {
event.preventDefault();
}
(function () {
/*
dial=ダイヤル
tvw=テレビ全体。イベント管理用
rotate=今のダイヤルの角度(deg)
*/
var dial = document.querySelector("#dial");
var tvw = document.querySelector("#tvWrapper");
var rotate = Number(dial.style.rotate.replace(/[^\d.-]/g, ''));
var initAngle;
dial.addEventListener("mousedown", mdown, false);
dial.addEventListener("touchstart", mdown, false);
//ダイヤルをクリックしたときのイベント
function mdown(e) {
//タップもクリックにする
if (e.type === "mousedown") {
var event = e;
} else {
var event = e.changedTouches[0];
}
//今出てるページを見えなくする
document.querySelector('#screen a.pages.selected').classList.remove('selected');
//ダイヤルの中心を取得。centerXとcenterY
const rect = dial.getBoundingClientRect();
const cx = rect.left + rect.width / 2;
const cy = rect.top + rect.height / 2;
//スクロールできなくする
document.addEventListener('touchmove', handle, { passive: false });
document.addEventListener('mousewheel', handle, { passive: false });
//クリック位置を中心から見た角度
initAngle = Math.atan2(e.pageY - cy, e.pageX - cx) * 180 / Math.PI - (rotate || 0);
/*
イベントリスナーの追加
mmoveはダイヤルの回転、mupはダイヤルから手を離したときのイベント
*/
document.body.addEventListener("mousemove", mmove, false);
document.body.addEventListener("touchmove", mmove, false);
dial.addEventListener("mouseup", mup, false);
document.addEventListener("mouseup", mup, false);
document.body.addEventListener("mouseleave", mup, false);
dial.addEventListener("touchend", mup, false);
document.body.addEventListener("touchleave", mup, false);
tvw.addEventListener("mouseup", mup, false);
tvw.addEventListener("touchend", mup, false);
}
function mmove(e) {
//タップもクリックにする
if (e.type === "mousemove") {
var event = e;
} else {
var event = e.changedTouches[0];
}
//ダイヤルの中心を取得。mdownと同じ
const rect = dial.getBoundingClientRect();
const cx = rect.left + rect.width / 2;
const cy = rect.top + rect.height / 2;
//マウスの移動量を角度に変換
var deg = Math.atan2(cy - event.clientY, cx - event.clientX) * 180 / Math.PI - initAngle;
//スナップしたときの角度に合わせる
deg = snap(deg) + "deg";
dial.style.rotate = deg;
}
function mup(e) {
//スクロールを許可
document.removeEventListener('touchmove', handle, { passive: false });
document.removeEventListener('mousewheel', handle, { passive: false });
//イベントを消す
document.body.removeEventListener("mousemove", mmove, false);
dial.removeEventListener("mouseup", mup, false);
document.body.removeEventListener("touchmove", mmove, false);
dial.removeEventListener("touchend", mup, false);
tvw.removeEventListener("mouseup", mup, false);
tvw.removeEventListener("touchend", mup, false);
document.body.removeEventListener("mouseleave", mup, false);
document.body.removeEventListener("touchleave", mup, false);
//ダイヤルの角度から何番目を選んでるか判定し、表示するリンクを変更。
var number = ((Number(dial.style.rotate.replace(/[^\d.-]/g, '')) + 360) % 360) / step;
changeChannel(number);
}
})()
