//20191217155150

// 環境に関する制御
var isSafari	= false;
var isPC		= false;

// CUR : カーソル（タップ位置）に関する制御
var CUR_fingers = 0;
var CUR_startId = "";
var CUR_startX	= 0;
var CUR_startY	= 0;
var CUR_lastX	= 0;
var CUR_lastY	= 0;
var CUR_lastD	= 0;		// 代表指～補助指間距離
var CUR_nowX	= 0;
var CUR_nowY	= 0;
var CUR_nowD	= 0;		// 代表指～補助指間距離
var CUR_rX;					// 代表指X座標（１指の場合はそれ。２指以上の場合は最右指）
var CUR_rY;					// 代表指Y座標（１指の場合はそれ。２指以上の場合は最右指）
var CUR_lX;					// 補助指X座標（１指の場合はそれ。２指以上の場合は最左指）
var CUR_lY;					// 補助指X座標（１指の場合はそれ。２指以上の場合は最左指）
var CUR_offsetX;
var CUR_offsetY;
var CUR_ratio = 0.2;		// ピンチズームのドラッグ距離に対する効き具合
var CUR_ratio_WF = 0.1;		// ホイールズームの回転距離に対する効き具合（FireFox）
var CUR_ratio_WI = 0.002;	// ホイールズームの回転距離に対する効き具合（IE）
var CUR_ratio_WC = 0.002;	// ホイールズームの回転距離に対する効き具合（Chrome）
var CUR_minMoment = 5;;		// ピンチに最低限必要な移動量（これ以下は並行移動とみなす）
var CUR_maxMoment = 50;		// スワイプ時の最大移動量（これ以上は不正ジャンプとみなす）
var CUR_maxScale = 4;
var CUR_minScale = 1;

var Z_Slide = 0;			/* 画像スライド */
var Z_Select = 1;			/* 範囲選択 */
var Z_DelSelect = 2;		/* 範囲消去 */

// ZOOMER : 右ペインでズームする部品のこと
var ZOOMER_wall;
var ZOOMER_obj;
var ZOOMER_lock = Z_Slide;
var ZOOMER_nowX = 0;
var ZOOMER_nowY = 0;
var ZOOMER_lastS = 1;
var ZOOMER_nowS = 1;
var ZOOMER_conW;
var ZOOMER_conH;
var ZOOMER_winW;
var ZOOMER_winH;
var ZOOMER_origin;
var SCALEL_obj;
var SCALER_obj;
var SCALEB_obj;
var DEFTYPE_obj;
var DEFTYPE_title_obj;
var DEFTYPE_ROTEI_obj;
var DEFTYPE_ROTEI_title_obj;
var TXTHIGHTOCCUPANCY=0.6;	// テキストSVGにおける高さ方向の占有率（それ以外は余白）。横方向はほぼ余白なし。

// MAP : 左ペイン下に表示する全体図
var MAP_wall;
var MAP_obj;
var MAP_w;
var MAP_h;

// SCOPE : マップ上に表示する現在表示中エリアを示すマーカ
var SCOPE_rateT;
var SCOPE_rateL;
var SCOPE_rateW;
var SCOPE_rateH;

// MENU : 左ペイン上のメニュー部のこと
var MENU_obj;
var MENU_lastY = 9999;

var AREA = "君津";
var JSON_FILE = "ckmaintain.json"
var JSON_DATA = null;
/* 入力モード 損傷="DAMAGE" 補修="REPAIR" */
var INPUT_MODE = null;
/* 保全モード  保全モード=true 以外=false */
var MAINTENANCE_MODE = null;

//------------------------------------------
// 初期化処理
//------------------------------------------
onload=function(){

	SaveHTML();
	DB_init();
	DISPLAY_init();
	EVENT_init();
}

var onresizeTimer = 0;		// リサイズ完了時に１度だけ実行するためのタイマー
onresize=function(){
	if (onresizeTimer > 0) {
		clearTimeout(onresizeTimer);
	}
	onresizeTimer = setTimeout(function() {
		doResize();
	}, 200);
}
function doResize() {
	resizeLeft();

	document.getElementById("PAGE_place").style.left = window.innerWidth * 0.3;
	document.getElementById("PAGE_damage_comment").style.left = window.innerWidth * 0.3;
	document.getElementById("PAGE_damage_end").style.left = window.innerWidth * 0.3;
	document.getElementById("PAGE_damage_kilnwidth").style.left = window.innerWidth * 0.3;
	document.getElementById("PAGE_repair_comment").style.left = window.innerWidth * 0.3;
	document.getElementById("PAGE_repair_end").style.left = window.innerWidth * 0.3;
	document.getElementById("PAGE_repair_kilnwidth").style.left = window.innerWidth * 0.3;
	document.getElementById("PAGE_repair_end_info").style.left = window.innerWidth * 0.3;
	document.getElementById("PAGE_repair_status").style.left = window.innerWidth * 0.3;
	
	document.getElementById("PAGE_mainmenu").style.top = window.innerHeight;
	document.getElementById("PAGE_deftype").style.top = window.innerHeight;
	document.getElementById("PAGE_deftype_rotei").style.top = window.innerHeight;

	document.getElementById("WINDOW_search").style.top = window.innerHeight * 1.15;
	document.getElementById("WINDOW_search_overlay").style.top = window.innerHeight;
	
	CUR_init();
	
	var lastH = ZOOMER_winH;
	ZOOMER_onResize();
	var zr = ZOOMER_winH / lastH;

	WALL_init();
	MENU_init();

	lastH = MAP_h;
	MAP_onResize();
	var mr = MAP_h / lastH;

	ZOOMER_adjust(zr, mr);

	ZOOMER_dispSCOPE();
	MASK1_rewrite();
}

function DISPLAY_init() {

	// グローバル変数の初期化
	isSafari	= false;
	isPC		= false;
	CUR_fingers = 0;
	CUR_startId = "";
	CUR_startX	= 0;
	CUR_startY	= 0;
	CUR_lastX	= 0;
	CUR_lastY	= 0;
	CUR_lastD	= 0;
	CUR_nowX	= 0;
	CUR_nowY	= 0;
	CUR_nowD	= 0;
	Z_Slide = 0;
	Z_Select = 1;
	Z_DelSelect = 2;
	ZOOMER_lock = Z_Slide;
	ZOOMER_nowX = 0;
	ZOOMER_nowY = 0;
	ZOOMER_lastS = 1;
	ZOOMER_nowS = 1;
	MENU_lastY = 9999;
	AREA = "君津";
	INPUT_MODE = "DAMAGE"
	MAINTENANCE_MODE = false;

	ENV_init();

	// NG フルスクリーン化→未完成だが完成したとしてもページ遷移で解除されてしまうとの事
	/*
	if (document.body.webkitRequestFullScreen) {
		document.body.webkitRequestFullScreen();
		alert("1");
	} else if (document.body.mozRequestFullScreen) {
		document.body.mozRequestFullScreen();
		alert("2");
	} else if (document.body.msRequestFullScreen) {
		document.body.msRequestFullScreen();
		alert("3");
	} else {
		alert("4");
	}
	*/

	// NG 横画面固定→フルスクリーン化が必須
	/*	
	window.addEventListener('orientationchange', function(){
		if(Math.abs(window.orientation) === 90) {
		} else {									// 縦になった場合
			//alert("1 " + window.orientation);
		}
	});
	*/

	// Android Chrome の PullToRefresh（プルダウンで更新してしまう）の抑止
	if(window.navigator.userAgent.toLowerCase().indexOf("chrome") != -1) {
		var s1, s2;
		document.getElementsByTagName('html')[0].style.height='100%';
		s1 = document.getElementsByTagName('body')[0].style; 
		s1.height = '100%';
		s1.overflowY = 'hidden';
		s2 = document.getElementById("PullToRefreshOfChromeFixer").style;
		s2.height = '100%';
		s2.overflow = 'auto';
	}
	
	/* JSONデータを読み込み且つHTMLに表示する */
	JSON_HTML_display();

	CUR_init();
	ZOOMER_init();
	WALL_init();
	MENU_init();
	MAP_init();
	
	WALL_drawZOOMER();
	WALL_drawMAP();
	
	SCALE_draw();
	ZOOMER_dispSCOPE();
	
	// 子画面を隠す
	var w = document.getElementById("left").clientWidth;
	document.getElementById("PAGE_place").style.left = w;
	document.getElementById("PAGE_damage_end").style.left = w;
	document.getElementById("PAGE_damage_comment").style.left = w;
	document.getElementById("PAGE_damage_kilnwidth").style.left = w;
	document.getElementById("PAGE_repair_end").style.left = w;
	document.getElementById("PAGE_repair_comment").style.left = w;
	document.getElementById("PAGE_repair_kilnwidth").style.left = w;
	document.getElementById("PAGE_repair_end_info").style.left = w;
	document.getElementById("PAGE_repair_status").style.left = w;
	var h = document.getElementById("whole").clientHeight;
	document.getElementById("PAGE_deftype").style.top = h;
	document.getElementById("PAGE_deftype_rotei").style.top = h;

	// ボタン処理の割付け
	DEFTYPE_obj.onclick											= DEFTYPE_clicked;
	DEFTYPE_obj.style.color										= "red";				// TBD : CSSが反映されない
	DEFTYPE_title_obj.onclick									= DEFTYPE_clicked;
	DEFTYPE_title_obj.style.color								= "red";				// TBD : CSSが反映されない
	DEFTYPE_ROTEI_obj.onclick									= DEFTYPE_rotei_clicked;
	DEFTYPE_ROTEI_obj.style.color								= "red";				// TBD : CSSが反映されない
	DEFTYPE_ROTEI_title_obj.onclick								= DEFTYPE_rotei_clicked;
	DEFTYPE_ROTEI_title_obj.style.color							= "red";				// TBD : CSSが反映されない
	document.getElementById("tab1_label_").onclick				= MENU_tab1;
	document.getElementById("tab2_label_").onclick				= MENU_tab2;
	document.getElementById("PLACE_back").onclick				= function(){PLACE_toggle(1);};
	document.getElementById("PLACE_cancel").onclick				= function(){PLACE_toggle(2);};
	document.getElementById("PLACE_rodan1").onclick				= function(){ChangeRodanColor(1);};
	document.getElementById("PLACE_rodan2").onclick				= function(){ChangeRodanColor(2);};
	document.getElementById("PLACE_rodan3").onclick				= function(){ChangeRodanColor(3);};
	document.getElementById("PLACE_rodan4").onclick				= function(){ChangeRodanColor(4);};
	document.getElementById("PLACE_rodan5").onclick				= function(){ChangeRodanColor(5);};
	document.getElementById("PLACE_wka").onclick				= function(){ChangeWakaMatuColor('若番');};
	document.getElementById("PLACE_matu").onclick				= function(){ChangeWakaMatuColor('末番');};
	document.getElementById("DAMAGE_end_back").onclick		= function(){DAMAGE_end_input_toggle(1);};
	document.getElementById("DAMAGE_end_cancel").onclick	= function(){DAMAGE_end_input_toggle(2);};
	document.getElementById("DAMAGE_comment_back").onclick		= function(){DAMAGE_comment_toggle(1,null);};
	document.getElementById("DAMAGE_comment_cancel").onclick	= function(){DAMAGE_comment_toggle(2,null);};
	document.getElementById("DAMAGE_end_input_in").onclick	= function(){ChangeDamageEndInputColor('in');};
	document.getElementById("DAMAGE_end_input_end").onclick	= function(){ChangeDamageEndInputColor('end');};
	document.getElementById("DAMAGE_kilnwidth_back").onclick			= function(){DAMAGE_kilnwidth_toggle(1,null);};
	document.getElementById("DAMAGE_kilnwidth_cancel").onclick			= function(){DAMAGE_kilnwidth_toggle(2,null);};
	document.getElementById("DAMAGE_kilnwidth_cs").onclick				= function(){ChangeDamageCsPsColor('cs');};
	document.getElementById("DAMAGE_kilnwidth_ps").onclick				= function(){ChangeDamageCsPsColor('ps');};
	document.getElementById("REPAIR_end_back").onclick		= function(){REPAIR_end_input_toggle(1);};
	document.getElementById("REPAIR_end_cancel").onclick	= function(){REPAIR_end_input_toggle(2);};
	document.getElementById("REPAIR_comment_back").onclick		= function(){REPAIR_comment_toggle(1,null);};
	document.getElementById("REPAIR_comment_cancel").onclick	= function(){REPAIR_comment_toggle(2,null);};
	document.getElementById("REPAIR_end_input_in").onclick	= function(){ChangeRepairEndInputColor('in');};
	document.getElementById("REPAIR_end_input_end").onclick	= function(){ChangeRepairEndInputColor('end');};
	document.getElementById("REPAIR_kilnwidth_back").onclick			= function(){REPAIR_kilnwidth_toggle(1,null);};
	document.getElementById("REPAIR_kilnwidth_cancel").onclick			= function(){REPAIR_kilnwidth_toggle(2,null);};
	document.getElementById("REPAIR_kilnwidth_cs").onclick				= function(){ChangeRepairCsPsColor('cs');};
	document.getElementById("REPAIR_kilnwidth_ps").onclick				= function(){ChangeRepairCsPsColor('ps');};
	document.getElementById("REPAIR_end_info_button").onclick			= function(){REPAIR_end_info_screen(0);};
	document.getElementById("REPAIR_end_info_back").onclick				= function(){REPAIR_end_info_screen(1);};
	document.getElementById("REPAIR_end_info_cancel").onclick			= function(){REPAIR_end_info_screen(2);};
	document.getElementById("REPAIR_status_back").onclick			= function(){REPAIR_status_toggle(1);};
	document.getElementById("REPAIR_status_cancel").onclick			= function(){REPAIR_status_toggle(2);};
	CAMERA_init();

	/* 損傷確認日に今日の日付を表示させる */
	document.getElementById("DATE_picker").value = ToDayDate();
	TAB1_CHENG_checked();

}







//------------------------------------------
// 環境検出処理
//------------------------------------------
function ENV_init() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.indexOf('iphone') > 0 || ua.indexOf('ipod') > 0 || ua.indexOf('android') > 0 && ua.indexOf('mobile') > 0) {
		// スマホ
		isPC = false;
	}else if(ua.indexOf('ipad') > 0 || ua.indexOf('android') > 0){
		// タブレット
		isPC = false;
	}else{
		// パソコンその他
		isPC = true;
	}
	//------------
	// Safari対策 
	//------------
	if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1 && ua.indexOf('edge') === -1){
		isSafari = true;
	}
}

//------------------------------------------
// イベント制御初期化
//------------------------------------------
function EVENT_init() {
	//-------------------------------------------------------
	//【注】addEventListenerの第3引数について
	//						{passive:false}		false
	//		Chrome			×					〇				メニュー部のスクロール上下端の要素をダブルタップするとフリーズする。
	//		iOS12のSafari	〇					×				ブラウザ側のズームが有効になってしまう。
	//		iOS10のSafari	〇					〇				どちらでも動く
	//-------------------------------------------------------
	var passiveSupported = false;
	try {
		document.addEventListener("test", null, Object.defineProperty({}, "passive", {
			get: function() {
            	passiveSupported = true;
			}
		}));
	} catch(err) {}

	// タッチイベント
	if (isSafari) {
		document.addEventListener("touchstart",	function(e) { EVENT_dispatch(e); }, passiveSupported ? { passive: false } : false);
		document.addEventListener("touchmove",	function(e) { EVENT_dispatch(e); }, passiveSupported ? { passive: false } : false);
		document.addEventListener("touchend",	function(e) { EVENT_dispatch(e); }, passiveSupported ? { passive: false } : false);
	} else {
		document.addEventListener("touchstart",	function(e) { EVENT_dispatch(e); }, false);
		document.addEventListener("touchmove",	function(e) { EVENT_dispatch(e); }, false);
		document.addEventListener("touchend",	function(e) { EVENT_dispatch(e); }, false);
	}

	// マウスホイールイベント
	// Firefox
	if(window.addEventListener){
		window.addEventListener('DOMMouseScroll', function(e){
			if (e.target.id.indexOf("ZOOMER") === 0) {
				onWheel(e.detail * CUR_ratio_WF);
			}
		}, false);
	}	
	// IE
	if(document.attachEvent){
		document.attachEvent('onmousewheel', function(e){
			if (e.target.id.indexOf("ZOOMER") === 0) {
				onWheel(e.wheelDelta * CUR_ratio_WI);
			}
		});
	}
	// Chrome
	window.onmousewheel = function(e){
		if (e.target.id.indexOf("ZOOMER") === 0) {
			onWheel(e.wheelDelta * CUR_ratio_WC);
		}
	}

	// クリックイベント
	if (isPC) {		// PC以外ではタッチ時にmousexxとtouchxxが２つ届く
	
		document.addEventListener("mousedown",	function(e) { EVENT_dispatch(e); }, false);
		document.addEventListener("mousemove",	function(e) { EVENT_dispatch(e); }, false);
		document.addEventListener("mouseup",	function(e) { EVENT_dispatch(e); }, false);

	}

}








//------------------------------------------
// メニュー（左ペイン）部固有制御の初期化
//------------------------------------------
function MENU_init() {
	MENU_lastY = 9999;
//	MENU_obj = document.getElementById("left-upper");
	MENU_obj = document.getElementById("panel1");
}

function MENU_tab1() {

	/* 編集モードかをチェックする                 */
	if ( EditModeCheck() == true ){
		return;
	}

	if ( MAINTENANCE_MODE == true ){
		window.alert('【コークス炉管理】\n保全モードなので他のモードへの\n切り替えは出来ません。');
		return;
	}

	document.getElementById("relpos").innerText = "　【損傷入力】 作業者(ID:nakai)";

	MENU_lastY = 9999;
	MENU_obj = document.getElementById("panel1");

	TAB1_CHENG_checked();
	INPUT_mode_color('#D3FFD3');
	INPUT_MODE = "DAMAGE"

	/* 損傷種別の選択リストを作成する */
	DamageTypeSelectListCreate();

	/* 補修種別の選択リストを作成する */
	DamageTypeRoteiSelectListCreate();

}

function MENU_tab2() {

	/* 編集モードかをチェックする */
	if ( EditModeCheck() == true ){
		return;
	}

	/* 検査箇所入力が未入力の時 */
	if ( PlaceInputCheak() == false ) {
		document.getElementById("tab1").checked = true;
		window.alert('【コークス炉管理】\n先に検査箇所を選択してください。');
		return;
	}

	/* すでに保全モードの時、切替ない */
	if ( MAINTENANCE_MODE == true ){
		rerurn;
	}

	/* 損傷箇所の入力がない時、保全モードにする */
	if ( document.getElementById("MENU_damage_lists_value").rows.length <= 0 ){

		flag = window.confirm("【コークス炉管理】\n損傷入力されていません。\n保全モードにて補修入力に切り替えますか？");

		// 「はい」が押されたときの処理
		if ( flag == true ){

			/* 保全モードにする */
			MAINTENANCE_MODE = true;

			document.getElementById("relpos").innerText = "　【保全入力】 作業者(ID:nakai)";

			/* 損傷入力のタブを消す(非表示) */
			document.getElementById("tab1_label_").style.display = 'none';

			
		}else{    // 「いいえ」が押されたときの処理
    		return;

		}

	}
	else{
		document.getElementById("relpos").innerText = "　【補修入力】 作業者(ID:nakai)";
	}

	MENU_lastY = 9999;
	MENU_obj = document.getElementById("panel2");

	TAB2_CHENG_checked();
	INPUT_mode_color('#ccccff');
	INPUT_MODE = "REPAIR"

	/* 補修種別の選択リストを作成する */
	RrepairTypeSelectListCreate();

	/* 炉底補修種別の選択リストを作成する */
	RrepairTypeRoteiSelectListCreate();

}

/*------------------------------------------*/
/* 入力モードで対象のタグの背景色を変える      */
/*------------------------------------------*/
function INPUT_mode_color(icolor) {

    document.getElementById("MENU_damage_lists_edit").style.backgroundColor = icolor; 
    document.getElementById("left-top").style.backgroundColor = icolor; 
    document.getElementById("right-top").style.backgroundColor = icolor; 
    document.getElementById("right-bottom").style.backgroundColor = icolor; 
    document.getElementById("left-bottom").style.backgroundColor = icolor; 
	
    document.getElementById("panel_area_").style.backgroundColor = icolor; 
}

/*------------------------------------------*/
/* tab1の切替をする                          */
/*------------------------------------------*/
function TAB1_CHENG_checked() {
	var borderColor = "";

	document.getElementById("panel1").style.display="inline-block";
	document.getElementById("panel2").style.display="none";

	borderColor = "1px solid dimgray";
	document.getElementById("tab1_label_").style.borderTop = borderColor;
	/* document.getElementById("tab1_label_").style.borderBottom = borderColor; */
	document.getElementById("tab1_label_").style.borderRight = borderColor;
	document.getElementById("tab1_label_").style.borderLeft = borderColor;
	document.getElementById("tab1_label_").style.backgroundColor = '#D3FFD3';

	borderColor = "1px solid #ddd";
	document.getElementById("tab2_label_").style.borderTop = borderColor;
	/* document.getElementById("tab1_label_").style.borderBottom = borderColor; */
	document.getElementById("tab2_label_").style.borderRight = borderColor;
	document.getElementById("tab2_label_").style.borderLeft = borderColor;
	document.getElementById("tab2_label_").style.backgroundColor = '#ddd';

}

/*------------------------------------------*/
/* tab1の切替をする                          */
/*------------------------------------------*/
function TAB2_CHENG_checked() {
	var borderColor = "";
	borderColor = "1px solid dimgray";
	document.getElementById("panel1").style.display="none";
	document.getElementById("panel2").style.display="inline-block";

	borderColor = "1px solid #ddd";
	document.getElementById("tab1_label_").style.borderTop = borderColor;
	/* document.getElementById("tab1_label_").style.borderBottom = borderColor; */
	document.getElementById("tab1_label_").style.borderRight = borderColor;
	document.getElementById("tab1_label_").style.borderLeft = borderColor;
	document.getElementById("tab1_label_").style.backgroundColor = '#ddd';

	borderColor = "1px solid dimgray";
	document.getElementById("tab2_label_").style.borderTop = borderColor;
	/* document.getElementById("tab1_label_").style.borderBottom = borderColor; */
	document.getElementById("tab2_label_").style.borderRight = borderColor;
	document.getElementById("tab2_label_").style.borderLeft = borderColor;
	document.getElementById("tab2_label_").style.backgroundColor = '#ccccff';

}


//------------------------------------------
// ホイールスクロール発生時処理
//------------------------------------------
function onWheel(delta) {
	ZOOMER_lastS = ZOOMER_nowS;
	ZOOMER_nowS = ZOOMER_nowS + delta;
	if (ZOOMER_nowS > CUR_maxScale) {
		ZOOMER_nowS = CUR_maxScale;
	}
	if (ZOOMER_nowS < CUR_minScale) {
		ZOOMER_nowS = CUR_minScale;
	}
	//document.getElementById("misc").innerHTML = " scale=" + ZOOMER_nowS;	//DEBUG

	ZOOMER_zoom();
	ZOOMER_dispSCOPE();
}












//------------------------------------------
// イベント分配処理
//------------------------------------------
function EVENT_dispatch(e) {

	//-----------------------
	// 各指の座標情報を収集（イベントにより使える物が変わる）
	//-----------------------
	switch (e.type) {
	case "mousedown":
	case "mousemove":
	case "mouseup":

		CUR_rX = e.pageX;
		CUR_rY = e.pageY;
		CUR_lX = e.pageX;
		CUR_lY = e.pageY;
		break;
	
	case "touchend":
	
		CUR_rX = e.changedTouches[0].pageX;
		CUR_rY = e.changedTouches[0].pageY;
		CUR_lX = e.changedTouches[0].pageX;
		CUR_lY = e.changedTouches[0].pageY;
		break;
		
	case "touchstart":
	case "touchmove":
		var maxX=-5000;
		var minX=5000;
		var max=0;
		var min=0;
		for (var i=0; i<e.touches.length; i++) {

			// TBD Safari+touchmoveの場合座標ずれあり
			if (e.touches[i].pageX > maxX) {
				max=i;
				maxX = e.touches[i].pageX;
			}
			if (e.touches[i].pageX < minX) {
				min=i;
				minX = e.touches[i].pageX;
			}
		}
		CUR_rX = e.touches[max].pageX;
		CUR_rY = e.touches[max].pageY;
		CUR_lX = e.touches[min].pageX;
		CUR_lY = e.touches[min].pageY;
		break;
	}
	//document.getElementById("misc").innerHTML = "sid=" + CUR_startId + " cid=" + e.target.id + " type=" + e.type + " " + CUR_rX.toFixed(0) + "," + CUR_rY.toFixed(0) + " " + CUR_lX.toFixed(0) + "," + CUR_lY.toFixed(0);	//DEBUG
	
	//-----------------------
	// 座標の取り込み（開始時、移動時、終了時座標のセット）
	//-----------------------
	switch (e.type) {
	case "mousedown":
	case "touchstart":
	
		CUR_startId = e.target.id;
		CUR_start(e);
		break;
	
	case "mouseup":
	case "mousemove":
	case "touchmove":
	case "touchend":
	
		CUR_update(e);
		break;
		
	}
	//document.getElementById("misc").innerHTML = "start={" + n(CUR_startX) + "," + n(CUR_startY) + "} now={" + n(CUR_nowX) + "," + n(CUR_nowY) + "}";	//DEBUG

	//-----------------------
	// 不要イベントの廃棄
	//-----------------------
	switch (e.type) {
	case "mousemove":
	case "mouseup":
		if (!CUR_isSameTargetM(e)) {
			//document.getElementById("misc").innerHTML = "× start=" + CUR_startId + " id=" + e.target.id + " " + CUR_startId;	//DEBUG
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		break;
	case "touchmove":
	case "touchend":
		if (!CUR_isSameTargetT(e)) {
			//document.getElementById("misc").innerHTML = "× start=" + CUR_startId + " id=" + e.target.id + " " + CUR_startId;	//DEBUG
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		break;
	}
	//-----------------------
	// 部品ごとのイベント処理
	//-----------------------
	if (e.target.id.indexOf("ZOOMER") === 0) {
		dispatchZOOMER(e);
		
	} else if (e.target.id.indexOf("MENU") === 0) {
		dispatchMENU(e);

	} else if (e.target.id.indexOf("MAP") === 0) {
		e.preventDefault();
		e.stopPropagation();

	} else if (e.target.id.indexOf("TGT_") === 0	) {
		dispatchBUTTON(e);
	
	} else if (e.target.id ==		"tab1_label_"				){	// メニュー画面「損傷入力タブ」
	} else if (e.target.id ==		"tab2_label_"				){	// メニュー画面「補修入力タブ」
	} else if (e.target.id ==		"DATE_picker"				){	// メイン画面「日付ピッカー」
	} else if (e.target.id ==		"PLACE_back"				){	// 検査箇所入力画面「完了」ボタン
	} else if (e.target.id ==		"PLACE_cancel"				){	// 検査箇所入力画面「キャンセル」ボタン
	} else if (e.target.id ==		"PLACE_rodan1"				){	// 検査箇所入力画面「炉団1」
	} else if (e.target.id ==		"PLACE_rodan2"				){	// 検査箇所入力画面「炉団2」
	} else if (e.target.id ==		"PLACE_rodan3"				){	// 検査箇所入力画面「炉団3」
	} else if (e.target.id ==		"PLACE_rodan4"				){	// 検査箇所入力画面「炉団4」
	} else if (e.target.id ==		"PLACE_rodan5"				){	// 検査箇所入力画面「炉団5」
	} else if (e.target.id ==		"PLACE_tankaval_sel"		){	// 検査箇所入力画面「炭化室No.入力」
	} else if (e.target.id ==		"PLACE_wka"					){	// 検査箇所入力画面「若番」
	} else if (e.target.id ==		"PLACE_matu"				){	// 検査箇所入力画面「末番」
	} else if (e.target.id.indexOf(	"DEFTYPE"		) == 0		){	// 損傷種別画面
	} else if (e.target.id ==		"DAMAGE_lists_edit_icon"	){	// 損傷箇所リスト画面「停止マーク」ボタン
	} else if (e.target.id ==		"DAMAGE_lists_edit_png"		){	// 損傷箇所リスト画面「停止マーク」png
	} else if (e.target.id ==		"DAMAGE_lists_value_del"	){	// 損傷箇所リスト画面「削除」ボタン
	} else if (e.target.id ==		"DAMAGE_end_back"			){	// 損傷箇所リスト完了入力画面「完了」ボタン
	} else if (e.target.id ==		"DAMAGE_end_cancel"			){	// 損傷箇所リスト完了入力画面「キャンセル」ボタン
	} else if (e.target.id ==		"DAMAGE_end_input_in"		){	// 損傷箇所リスト完了入力画面「未」ボタン
	} else if (e.target.id ==		"DAMAGE_end_input_end"		){	// 損傷箇所リスト完了入力画面「入力完了」ボタン
	} else if (e.target.id ==		"DAMAGE_end_photo_view"		){	// 損傷箇所リスト完了入力画面「写真見る」ボタン
	} else if (e.target.id ==		"DAMAGE_comment_back"		){	// 損傷コメント入力画面「完了」ボタン
	} else if (e.target.id ==		"DAMAGE_comment_cancel"		){	// 損傷コメント入力画面「キャンセル」ボタン
	} else if (e.target.id ==		"DAMAGE_comment_in"			){	// 損傷コメント入力画面「コメント入力」
	} else if (e.target.id ==		"DAMAGE_kilnwidth_back"		){	// 現状窯幅入力画面「完了」ボタン
	} else if (e.target.id ==		"DAMAGE_kilnwidth_cancel"	){	// 現状窯幅入力画面「キャンセル」ボタン
	} else if (e.target.id ==		"DAMAGE_kilnwidth_furyu_in"	){	// 現状窯幅入力画面「フリュー」
	} else if (e.target.id ==		"DAMAGE_kilnwidth_dansu_in"	){	// 現状窯幅入力画面「段数」
	} else if (e.target.id ==		"DAMAGE_kilnwidth_sokutei_in"		){	// 現状窯幅入力画面「測定値」
	} else if (e.target.id ==		"DAMAGE_kilnwidth_cs"		){	// 現状窯幅入力画面「CS」
	} else if (e.target.id ==		"DAMAGE_kilnwidth_ps"		){	// 現状窯幅入力画面「PS」
	} else if (e.target.id ==		"DAMAGE_kilnwidth_edit_icon"){	// 現状窯幅入力画面「停止マーク」ボタン
	} else if (e.target.id ==		"DAMAGE_kilnwidth_edit_png" ){	// 現状窯幅入力画面「停止マーク」png
	} else if (e.target.id ==		"DAMAGE_kilnwidth_value_del"){	// 現状窯幅入力画面「削除」ボタン
	} else if (e.target.id ==		"REPAIR_lists_edit_icon"	){	// 補修箇所リスト画面「停止マーク」ボタン
	} else if (e.target.id ==		"REPAIR_lists_edit_png"		){	// 補修箇所リスト画面「停止マーク」png
	} else if (e.target.id ==		"REPAIR_lists_value_del"	){	// 補修箇所リスト画面「削除」ボタン
	} else if (e.target.id ==		"REPAIR_end_back"			){	// 補修箇所リスト完了入力画面「完了」ボタン
	} else if (e.target.id ==		"REPAIR_end_cancel"			){	// 補修箇所リスト完了入力画面「キャンセル」ボタン
	} else if (e.target.id ==		"REPAIR_end_sdate_picker"	){	// 補修箇所リスト完了入力画面「補修開始」
	} else if (e.target.id ==		"REPAIR_end_edate_picker"	){	// 補修箇所リスト完了入力画面「補修終了」
	} else if (e.target.id ==		"REPAIR_end_input_in"		){	// 補修箇所リスト完了入力画面「未」ボタン
	} else if (e.target.id ==		"REPAIR_end_input_end"		){	// 補修箇所リスト完了入力画面「入力完了」ボタン
	} else if (e.target.id ==		"REPAIR_end_info_button"	){	// 補修箇所リスト完了入力画面「補修情報詳細入力」ボタン
	} else if (e.target.id ==		"REPAIR_end_photo_view"		){	// 補修箇所リスト完了入力画面「補修写真見る」ボタン
	} else if (e.target.id ==		"REPAIR_end_info_back"		){	// 補修情報詳細入力画面「完了」ボタン
	} else if (e.target.id ==		"REPAIR_end_info_cancel"	){	// 補修情報詳細入力画面「キャンセル」ボタン
	} else if (e.target.id ==		"REPAIR_end_info_material_sel"	){	// 補修情報詳細入力画面「補修材料選択」
	} else if (e.target.id ==		"REPAIR_end_info_use_in"	){	// 補修情報詳細入力画面「使用量」
	} else if (e.target.id ==		"REPAIR_comment_back"		){	// 補修コメント入力画面「完了」ボタン
	} else if (e.target.id ==		"REPAIR_comment_cancel"		){	// 補修コメント入力画面「キャンセル」ボタン
	} else if (e.target.id ==		"REPAIR_comment_in"			){	// 補修コメント入力画面「コメント入力」
	} else if (e.target.id ==		"REPAIR_kilnwidth_back"		){	// 現状窯幅入力画面「完了」ボタン
	} else if (e.target.id ==		"REPAIR_kilnwidth_cancel"	){	// 現状窯幅入力画面「キャンセル」ボタン
	} else if (e.target.id ==		"REPAIR_kilnwidth_furyu_in"	){	// 現状窯幅入力画面「フリュー」
	} else if (e.target.id ==		"REPAIR_kilnwidth_dansu_in"	){	// 現状窯幅入力画面「段数」
	} else if (e.target.id ==		"REPAIR_kilnwidth_sokutei_in"	){	// 現状窯幅入力画面「測定値」
	} else if (e.target.id ==		"REPAIR_kilnwidth_cs"		){	// 現状窯幅入力画面「CS」
	} else if (e.target.id ==		"REPAIR_kilnwidth_ps"		){	// 現状窯幅入力画面「PS」
	} else if (e.target.id ==		"REPAIR_kilnwidth_edit_icon"){	// 現状窯幅入力画面「停止マーク」ボタン
	} else if (e.target.id ==		"REPAIR_kilnwidth_edit_png" ){	// 現状窯幅入力画面「停止マーク」png
	} else if (e.target.id ==		"REPAIR_kilnwidth_value_del"){	// 現状窯幅入力画面「削除」ボタン
	} else if (e.target.id ==		"REPAIR_status_back"		){	// 補修中設定入力画面「完了」ボタン
	} else if (e.target.id ==		"REPAIR_status_cancel"		){	// 補修中設定入力画面「キャンセル」ボタン
	} else if (e.target.id ==		"REPAIR_status_switch1"		){	// 補修中設定入力画面「補修中」スイッチ部品1
	} else if (e.target.id ==		"REPAIR_status_switch2"		){	// 補修中設定入力画面「補修中」スイッチ部品2
	} else if (e.target.id ==		"REPAIR_status_switch3"		){	// 補修中設定入力画面「補修中」スイッチ部品3
	} else if (e.target.id ==		"REPAIR_status_switch4"		){	// 補修中設定入力画面「補修中」スイッチ部品4
	} else if (e.target.id ==		"REPAIR_status_switch5"		){	// 補修中設定入力画面「補修中」スイッチ部品5
	} else if (e.target.id ==		"CAMERA_home_icon"			){	// メイン画面「カメラ」ボタン
	} else if (e.target.id ==		"SEARCH_datefrom_picker"	){	// 検索画面「登録日」ボタン
	} else if (e.target.id.indexOf(	"SEARCH_area"		) === 0	){	// 検索画面画面「エリア選択肢」ボタン
	} else if (e.target.id.indexOf(	"SEARCH_wakamatsu"	) === 0	){	// 検索画面画面「若末選択肢」ボタン
	} else if (e.target.id.indexOf(	"SEARCH_state"		) === 0	){	// 検索画面画面「状態選択肢」ボタン
	} else if (e.target.id.indexOf(	"SEARCH_type"		) === 0	){	// 検索画面画面「種別」ボタン
	} else if (e.target.id.indexOf(	"SEARCH_check"		) === 0	){	// 検索画面画面「種別」チェックボックス
		// 別で指定した規定動作を実施する
	
	} else {
		e.preventDefault();
		e.stopPropagation();

	}

	//-----------------------
	// 後始末
	//-----------------------
	switch (e.type) {
	case "mouseup":
	case "touchend":
		CUR_startId = "";
		break;
	}
}
function dispatchZOOMER(e) {
	e.preventDefault();
	e.stopPropagation();

	switch (e.type) {
	case "mousemove":
		ZOOMER_lastS = ZOOMER_nowS;
	case "touchmove":
	
		// 特にSafariで指離しぎわに数百pxジャンプする事がある
		if (Math.abs(CUR_nowX - CUR_lastX) > CUR_maxMoment)		return;
		if (Math.abs(CUR_nowY - CUR_lastY) > CUR_maxMoment)		return;

		switch (CUR_fingers) {
		case 0:
			// 湧き出しイベント（異常）
			//alert("Unknown event emerged.");
			return;
		case 1:
			// １指ドラッグ
			if (ZOOMER_lock == Z_Select) {						// 範囲選択中
				if (CUR_isMoved()) {
					// 範囲描画
					ZOOMER_drawRect(1);
				}
			} else if (ZOOMER_lock == Z_DelSelect) {			// 範囲消去中
				if (CUR_isMoved()) {
					// 範囲消去
					ZOOMER_drawRect(0);
				}
			} else {											// 画像スライド中
				if (CUR_isMoved()) {
					// 移動
					ZOOMER_zoom();
					ZOOMER_dispSCOPE();
				}
			}
			return;
		case 2:
			// ２指ドラッグ
			// ピンチ、ドラッグ
			CUR_makeNewScale();
			ZOOMER_zoom();
			ZOOMER_dispSCOPE();
			return;
		}
		break;
	case "mouseup":
	case "touchend":
		if (ZOOMER_lock == Z_Select) {							// 範囲選択中
			if (CUR_isClicked()) {
				// クリック
				ZOOMER_drawDot();
			}
		} else if (ZOOMER_lock == Z_DelSelect) {				// 範囲消去中
			if (CUR_isClicked()) {
				// クリック
				ZOOMER_drawDot();
			}
		} else {												// 画像スライド中
			if (CUR_isClicked()) {
				// クリック
				ZOOMER_drawDot();
			}
		}
		break;
	}
}

function dispatchMENU(e) {
	switch (e.type) {
	
	case "mousedown":	// クリック
		switch (e.target.id) {
		
		case "MENU_place_value":
			PLACE_toggle(0);
			e.preventDefault();
			e.stopPropagation();
			return;
			
		case "MENU_damage_lists_edit":
			Lists_edit();
			e.preventDefault();
			e.stopPropagation();
			return;
			
		case "Damage_listNo":
		case "MENU_damageType":
		case "MENU_damagePoints":
			DAMAGE_end_input_toggle(0,e.target);
			e.preventDefault();
			e.stopPropagation();
			return;
			
		case "MENU_damage_comment_value":
			DAMAGE_comment_toggle(0);
			e.preventDefault();
			e.stopPropagation();
			return;
			
		case "MENU_damage_kilnwidth_add":
			DAMAGE_kilnwidth_toggle(0,e.target);
			e.preventDefault();
			e.stopPropagation();
			return;
			
		case "MENU_damage_kilnwidth_value":
			DAMAGE_kilnwidth_toggle(0,e.target);
			e.preventDefault();
			e.stopPropagation();
			return;

		case "repair_listNo":
		case "MENU_repairType":
		case "MENU_repairPoints":
			REPAIR_end_input_toggle(0,e.target);
			e.preventDefault();
			e.stopPropagation();
			return;
			
		case "MENU_repair_comment_value":
			REPAIR_comment_toggle(0);
			e.preventDefault();
			e.stopPropagation();
			return;
			
		case "MENU_repair_kilnwidth_add":
			REPAIR_kilnwidth_toggle(0,e.target);
			e.preventDefault();
			e.stopPropagation();
			return;

		case "MENU_repair_kilnwidth_value":
			REPAIR_kilnwidth_toggle(0,e.target);
			e.preventDefault();
			e.stopPropagation();
			return;

		case "MENU_repair_status_value":
			REPAIR_status_toggle(0);
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		return;

	case "mouseup":
		e.preventDefault();
		e.stopPropagation();
		return;
		
	case "mousemove":
		e.preventDefault();
		e.stopPropagation();
		return;
	}

	// 以降はタッチ操作時
	
	if (e.touches.length >= 2) {	// ２指操作は禁止
		e.preventDefault();
		e.stopPropagation();
		return;
	}
	
	var lowest	= MENU_obj.scrollHeight - MENU_obj.clientHeight;

	switch (e.type) {
	case "touchstart":
	case "touchmove":
		var nowY	= e.touches[0].screenY;
		break;
	case "touchend":
		var nowY	= e.changedTouches[0].screenY;
		break;
	}
	
	var lastY	= MENU_lastY;
	MENU_lastY	= nowY;
	var diffY	= Math.abs(nowY - lastY);
	
	//document.getElementById("misc").innerHTML = "type=" + e.type + " diff=" + diffY;	//DEBUG

	switch (e.type) {
	case "touchend":
		if (CUR_isClicked()) {		// クリック
			switch (e.target.id) {
			
			case "MENU_place_value":
				PLACE_toggle(0);
				break;
				
			case "MENU_damage_lists_edit":
				Lists_edit();
				break;
				
			case "Damage_listNo":
			case "MENU_damageType":
			case "MENU_damagePoints":
				DAMAGE_end_input_toggle(0,e.target);
				break;
				
			case "MENU_damage_comment_value":
				DAMAGE_comment_toggle(0);
				break;
				
			case "MENU_damage_kilnwidth_add":
				DAMAGE_kilnwidth_toggle(0,e.target);
				break;
				
			case "MENU_damage_kilnwidth_value":
				DAMAGE_kilnwidth_toggle(0,e.target);
				break;

			case "Repair_listNo":
			case "MENU_repairType":
			case "MENU_repairPoints":
				REPAIR_end_input_toggle(0,e.target);
				break;

			case "MENU_repair_comment_value":
				REPAIR_comment_toggle(0);
				break;
				
			case "MENU_repair_kilnwidth_add":
				REPAIR_kilnwidth_toggle(0,e.target);
				break;
				
			case "MENU_repair_kilnwidth_value":
				REPAIR_kilnwidth_toggle(0,e.target);
				break;

			case "MENU_repair_status_value":
				REPAIR_status_toggle(0);
				break;	
			}
		}
		e.preventDefault();
		e.stopPropagation();
		return;
	}

	if (nowY >= lastY) {		// プルダウン
		if (MENU_obj.scrollTop <= 0) {
		
			// 上端での更なるプルダウンは禁止（Chromeでは更新／Safariではアプリ切替がおきてしまう）
			e.preventDefault();
			e.stopPropagation();
			return;
		}
	} else {					// プルアップ
		//------------
		// Safari固有対策
		//------------
		if (MENU_obj.scrollTop >= lowest) {
			if (nowY < lastY) {

				// 下端での更なるプルアップは禁止（ページ更新等がおきてしまう）
				e.preventDefault();
				e.stopPropagation();
				return;
			}
		}
	}
	
	// ここへ到達しデフォルト動作を許されたケースが「縦スクロール」
}
function dispatchBUTTON(e) {
	e.preventDefault();
	e.stopPropagation();

	switch (e.type) {
	case "mouseup":
	case "touchend":
		if (CUR_fingers != 1)	return;
		if (!CUR_isClicked())	return;
		switch (e.target.id) {
		
		case "TGT_MAINMENU_icon":
			MAINMENU_clicked();
			break;
			
		case "TGT_MAINMENU_localsave":
			MAINMENU_localsave_clicked();
			break;
			
		case "TGT_MAINMENU_localreload":
			MAINMENU_localreload_clicked();
			break;
			
		case "TGT_LOCK":
			LOCK_clicked();
			break;

		case "TGT_GOHOME":
			GOHOME_clicked();
			break;
			
		case "TGT_CLEAR":
			CLEAR_clicked();
			break;
			
		case "TGT_SEARCH_home_icon":
		case "TGT_SEARCH_cancel":
			SEARCH_clicked();
			break;
			
		}
		break;
	}
}
//------------------------------------------
// ボタン押下時処理群
//------------------------------------------
function LOCK_clicked() {
	if (ZOOMER_lock == Z_Slide) {					// 画像スライド
		ZOOMER_lock = Z_Select;
		document.getElementById("TGT_LOCK").innerHTML = "範囲選択中";
		
	} else if (ZOOMER_lock == Z_Select) {			// 範囲選択
		ZOOMER_lock = Z_DelSelect;
		document.getElementById("TGT_LOCK").innerHTML = "範囲消去中";
	} else {										// 範囲消去
		ZOOMER_lock = Z_Slide;
		document.getElementById("TGT_LOCK").innerHTML = "画像スライド中";
	}
};

function GOHOME_clicked() {
	ZOOMER_gohome();
	ZOOMER_dispSCOPE();
}
function CLEAR_clicked() {
	RestoreHTML();
	DISPLAY_init();
}

function SEARCH_clicked() {
	document.getElementById("WINDOW_search_overlay").classList.toggle("SEARCH_overlay_slidein");
	document.getElementById("WINDOW_search").classList.toggle("SEARCH_slidein");
}

var savedHTML;
function SaveHTML() {
  savedHTML = document.body.innerHTML;
}
function RestoreHTML() {
  document.body.innerHTML = savedHTML;
}

/*------------------------------------------------*/
/* JSONデータを読み込み且つHTMLに表示する            */
/*------------------------------------------------*/
function JSON_HTML_display() {
	httpObj = new XMLHttpRequest();
	httpObj.open("get", "./" + JSON_FILE, true);
	httpObj.send(null);

	/* 非同期でサーバーからのレスポンス(onload)により以下を実行 */
	httpObj.onload = function(){
		var JSON_TEXT = this.responseText;
		JSON_DATA = JSON.parse(JSON_TEXT);

		/* 損傷種別の選択リストを作成する */
		DamageTypeSelectListCreate();

		/* 炉底損傷種別の選択リストを作成する */
		DamageTypeRoteiSelectListCreate();

	}

};


/* 画面した帯の損傷種別をクリックしたとき */
function DEFTYPE_clicked() {
	/* 損傷種別選択リスト 表示、非表示 */
	document.getElementById("PAGE_deftype").classList.toggle("DEFTYPE_slidein");
};

/* 画面した帯の損傷種別をクリックしたとき */
function DEFTYPE_select_clicked(obj,DEFTYPE_name,DEFTYPE_key) {
	/* 選択された損傷種別を取り込む*/
	/* 損傷種別 */
	var DamageName = obj.innerHTML;
	/* 損傷種別 色 */
	var Damagecolor = obj.style.color;

	/* 選択した損傷種別を表示する */
	DEFTYPE_obj.innerHTML = '<span id="DEFTYPE_title" style="color:blue;">' + DEFTYPE_name + '：</span>' + DamageName;
	DEFTYPE_obj.style.color = Damagecolor;
	/* 選択した損傷種別をタグに保存する */
	DEFTYPE_obj.setAttribute(DEFTYPE_key + '_TYPE',DamageName);
	DEFTYPE_obj.setAttribute(DEFTYPE_key + '_COLOR',Damagecolor);

	/* 損傷種別選択リスト 表示、非表示 */
	document.getElementById("PAGE_deftype").classList.toggle("DEFTYPE_slidein");
};

/* 画面した帯の炉底損傷種別をクリックしたとき */
function DEFTYPE_rotei_clicked() {
	/* 損傷種別選択リスト 表示、非表示 */
	document.getElementById("PAGE_deftype_rotei").classList.toggle("DEFTYPE_rotei_slidein");
};

/* 画面した帯の炉底損傷種別をクリックしたとき */
function DEFTYPE_rotei_select_clicked(obj,DEFTYPE_name,DEFTYPE_key) {
	/* 選択された炉底損傷種別を取り込む*/
	/* 損傷種別 */
	var DamageName = obj.innerHTML;
	/* 損傷種別 色 */
	var Damagecolor = obj.style.color;

	/* 選択した炉底損傷種別を表示する */
	DEFTYPE_ROTEI_obj.innerHTML = '<span id="DEFTYPE_ROTEI_title" style="color:blue;">' + DEFTYPE_name + '：</span>' + DamageName;
	DEFTYPE_ROTEI_obj.style.color = Damagecolor;
	/* 選択した炉底損傷種別をタグに保存する */
	DEFTYPE_ROTEI_obj.setAttribute(DEFTYPE_key + '_TYPE',DamageName);
	DEFTYPE_ROTEI_obj.setAttribute(DEFTYPE_key + '_COLOR',Damagecolor);

	/* 炉底損傷種別選択リスト 表示、非表示 */
	document.getElementById("PAGE_deftype_rotei").classList.toggle("DEFTYPE_rotei_slidein");
};

function MAINMENU_clicked() {
	document.getElementById("PAGE_mainmenu").classList.toggle("MAINMENU_slidein");
}
function MAINMENU_localsave_clicked() {
	document.getElementById("PAGE_mainmenu").classList.toggle("MAINMENU_slidein");
	DB_write(sn_LOCALSAVE, {name:"jordan", age:"20", sex:"male", tall:"182"});
	DB_write(sn_LOCALSAVE, {name:"michaelle", value:"21", sex:"female", tall:"172"});
	DB_write(sn_LOCALSAVE, {name:"bekky", value:"17", sex:"female", tall:"178"});
	alert("local save");
}
function MAINMENU_localreload_clicked() {
	document.getElementById("PAGE_mainmenu").classList.toggle("MAINMENU_slidein");
	var handle = DB_read(sn_LOCALSAVE, "michaelle");
	handle.onsuccess = function(event){
		var data = event.target.result;
		alert(data.tall);
	}
}

































//------------------------------------------
// マウス制御初期化処理
//------------------------------------------
var AREA_ZOOMER;
var AREA_MENU;
var AREA_MAP;

function CUR_init() {
	AREA_ZOOMER = document.getElementById("ZOOMER").getBoundingClientRect();
	CUR_offsetX	= AREA_ZOOMER.left + window.pageXOffset;
	CUR_offsetY	= AREA_ZOOMER.top + window.pageYOffset;

	AREA_MENU	= document.getElementById("left-upper").getBoundingClientRect();
	AREA_MAP	= document.getElementById("left-lower").getBoundingClientRect();
}
//------------------------------------------
// マウスラッグ中に別部品に移ったか（無効）のチェック
//------------------------------------------
function CUR_isSameTargetM(e) {
	if (CUR_startId.indexOf("ZOOMER") === 0) {
		if (e.target.id.indexOf("ZOOMER") === 0)	return true;
		
	} if (CUR_startId.indexOf("MAP") === 0) {
		if (e.target.id.indexOf("MAP") === 0)		return true;
		
	} if (CUR_startId.indexOf("MENU") === 0) {
		if (e.target.id.indexOf("MENU") === 0)		return true;
		
	} else {
		if (e.target.id == CUR_startId)				return true;
		
	}
	CUR_startId = "";
	return false;
}
//------------------------------------------
// タッチドラッグ中に別部品に移ったか（無効）のチェック
//------------------------------------------
function CUR_isSameTargetT(e) {
	var f=0;
	if (CUR_startId.indexOf("ZOOMER") === 0) {
		if		(AREA_ZOOMER.left	> CUR_rX)		f=1;
		else if	(AREA_ZOOMER.right	< CUR_rX)		f=1;
		else if	(AREA_ZOOMER.top	> CUR_rY)		f=1;
		else if	(AREA_ZOOMER.bottom	< CUR_rY)		f=1;
		
	} if (CUR_startId.indexOf("MENU") === 0) {
		if		(AREA_MENU.left		> CUR_rX)		f=1;
		else if	(AREA_MENU.right	< CUR_rX)		f=1;
		else if	(AREA_MENU.top		> CUR_rY)		f=1;
		else if	(AREA_MENU.bottom	< CUR_rY)		f=1;
		
	} if (CUR_startId.indexOf("MAP") === 0) {
		if		(AREA_MAP.left		> CUR_rX)		f=1;
		else if	(AREA_MAP.right		< CUR_rX)		f=1;
		else if	(AREA_MAP.top		> CUR_rY)		f=1;
		else if	(AREA_MAP.bottom	< CUR_rY)		f=1;
		
	} else {
		// TBD
		f=0;
	}
	if (f == 1) {
		CUR_startId = "";
		return false;
	} else {
		return true;
	}
}
//------------------------------------------
// マウス追跡開始処理
//------------------------------------------
function CUR_start(e) {

	// 複数指の場合は中点を開始位置とする
	CUR_startX = CUR_nowX = CUR_lastX = ((CUR_lX + CUR_rX) / 2) - CUR_offsetX;
	CUR_startY = CUR_nowY = CUR_lastY = ((CUR_lY + CUR_rY) / 2) - CUR_offsetY;

	// ２指間距離
	if (e.type.indexOf("mouse") === 0) {
		CUR_lastD = 0;
		CUR_fingers = 1;
		
	} else if (e.touches.length >= 2) {
		CUR_lastD = Math.sqrt(Math.pow(CUR_lX-CUR_rX, 2) + Math.pow(CUR_lY-CUR_rY, 2));
		CUR_fingers = 2;
		
		// 開始位置をズーム基準点として記憶する
		var [xp, yp] = WALL_getXpYp(CUR_startX, CUR_startY);
		ZOOMER_origin = n(xp*100) + "% " + n(yp*100) + "%";
		//mark(CUR_startX, CUR_startY);

	} else {
		CUR_fingers = 1;
		CUR_lastD = 0;
		
	}
	CUR_nowD = CUR_lastD;
}
//------------------------------------------
// マウス追跡処理
//------------------------------------------
function CUR_update(e) {
	
	CUR_lastX = CUR_nowX;
	CUR_lastY = CUR_nowY;

	CUR_nowX = CUR_rX - CUR_offsetX;
	CUR_nowY = CUR_rY - CUR_offsetY;

	// ２指間距離
	CUR_lastD = CUR_nowD;
	if (e.type.indexOf("mouse") === 0) {
		CUR_nowtD = 0;
		CUR_fingers = 1;

	} else if (e.touches.length >= 2) {
		CUR_nowD = Math.sqrt(Math.pow(CUR_lX-CUR_rX, 2) + Math.pow(CUR_lY-CUR_rY, 2));
		CUR_fingers = 2;

	} else {
		CUR_nowD = 0;
		CUR_fingers = 1;
		
	}
}
//------------------------------------------
// タップ動作の判定処理
//------------------------------------------
function CUR_isMoved() {
	if (CUR_nowX != CUR_lastX)	return true;
	if (CUR_nowY != CUR_lastY)	return true;
	return false;
}
function CUR_isClicked() {
	if (CUR_nowX != CUR_startX)	return false;
	if (CUR_nowY != CUR_startY)	return false;
	return true;
}
//------------------------------------------
// 倍率計算処理
//------------------------------------------
function CUR_makeNewScale() {
	ZOOMER_lastS = ZOOMER_nowS;

	if (CUR_nowD == 0) {
		return false;
	}
	if (CUR_lastD == 0) {
		return false;
	}
	if (CUR_nowD == CUR_lastD) {
		return false;
	}
	var moment = Math.abs(CUR_nowD - CUR_lastD);
	if (moment < CUR_minMoment)	return false;

	var dz = (CUR_nowD / CUR_lastD) * CUR_ratio;
	if (CUR_nowD > CUR_lastD) {
		ZOOMER_nowS = ZOOMER_nowS + dz;
	} else {
		ZOOMER_nowS = ZOOMER_nowS - dz;
	}
	if (ZOOMER_nowS > CUR_maxScale) {
		ZOOMER_nowS = CUR_maxScale;
	}
	if (ZOOMER_nowS < CUR_minScale) {
		ZOOMER_nowS = CUR_minScale;
	}
	//document.getElementById("misc").innerHTML = " scale=" + ZOOMER_nowS;	//DEBUG
	return true;
}












//------------------------------------------
// ズーム機能初期化処理
//------------------------------------------
function ZOOMER_init() {
	ZOOMER_wall		= document.getElementById("ZOOMER_wall");
	ZOOMER_conW		= ZOOMER_wall.clientWidth;
	ZOOMER_conH		= ZOOMER_wall.clientHeight;
	
	// 壁紙に合わせてsvg領域サイズも変更する
	ZOOMER_obj		= document.getElementById("ZOOMER_svg");
	ZOOMER_obj.style.width = ZOOMER_conW;
	ZOOMER_obj.style.height = ZOOMER_conH;
	ZOOMER_winW		= document.getElementById("ZOOMER").clientWidth;
	ZOOMER_winH		= document.getElementById("ZOOMER").clientHeight;
	
	SCALEL_obj		= document.getElementById("SCALEL_svg");
	SCALER_obj		= document.getElementById("SCALER_svg");
	SCALEB_obj		= document.getElementById("SCALEB_svg");
	DEFTYPE_obj		= document.getElementById("DEFTYPE");
	DEFTYPE_title_obj = document.getElementById("DEFTYPE_title");
	DEFTYPE_ROTEI_obj = document.getElementById("DEFTYPE_ROTEI");
	DEFTYPE_ROTEI_title_obj = document.getElementById("DEFTYPE_ROTEI_title");
}
function ZOOMER_onResize() {
	ZOOMER_winW		= document.getElementById("ZOOMER").clientWidth;
	ZOOMER_winH		= document.getElementById("ZOOMER").clientHeight;

	ZOOMER_conW		= ZOOMER_wall.clientWidth;
	ZOOMER_conH		= ZOOMER_wall.clientHeight;
	
	// 壁紙に合わせてsvg領域サイズも変更する
	ZOOMER_obj.style.width = ZOOMER_conW;
	ZOOMER_obj.style.height = ZOOMER_conH;
}

//------------------------------------------
// ZOOMERの位置を算出
//------------------------------------------
function ZOOMER_getPos() {
	var zrect = ZOOMER_obj.getBoundingClientRect();
	ZOOMER_nowX = zrect.left - CUR_offsetX;
	ZOOMER_nowY = zrect.top  - CUR_offsetY;
}

//------------------------------------------
// ズーム部の再描画処理（ズーム、移動）
//------------------------------------------
function ZOOMER_zoom() {

	// 壁のズーム
	
	// 移動差分の計算
	var diffX = CUR_nowX - CUR_lastX;
	var diffY = CUR_nowY - CUR_lastY;

	// 倍率差分の計算
	var diffS = ZOOMER_nowS - ZOOMER_lastS;
	if (diffS == 0) {
	
		// 移動のみ実施
		ZOOMER_obj.style.transformOrigin = "0 0";
		ZOOMER_wall.style.transformOrigin = "0 0";

		var [dx, dy] = ZOOMER_trimDiff(diffX, diffY);
		var nextX = ZOOMER_nowX + dx;
		var nextY = ZOOMER_nowY + dy;
		var trans = "translate(" + nextX + "px," + nextY +"px) scale(" + ZOOMER_nowS + ")";
		ZOOMER_obj.style.transform = trans;
		ZOOMER_wall.style.transform = trans;

	} else {
	
		// ズームのみ実施（ズームしつつ移動は技術的に困難）
		ZOOMER_obj.style.transformOrigin = ZOOMER_origin;
		ZOOMER_wall.style.transformOrigin = ZOOMER_origin;

		var trans = "scale(" + ZOOMER_nowS + ")";
		ZOOMER_obj.style.transform = trans;
		ZOOMER_wall.style.transform = trans;

	}
	ZOOMER_getPos();
	
	// 軸のズームも実施
	SCALE_zoom();
}
var OVERRUN_MARGIN = 0.1;
function ZOOMER_trimDiff(diffX, diffY) {

	// 可視範囲外へ逃げないようにする処理
	var w		= (ZOOMER_conW * ZOOMER_nowS);
	var h		= (ZOOMER_conH * ZOOMER_nowS);
	var wm		= w * OVERRUN_MARGIN;
	var hm		= w * OVERRUN_MARGIN;
	var maxX	= 0 + wm;
	var maxY	= 0 + hm;
	var minX	= ZOOMER_winW - (ZOOMER_conW * ZOOMER_nowS) - wm;
	var minY	= ZOOMER_winH - (ZOOMER_conH * ZOOMER_nowS) - hm;
	if ((ZOOMER_nowX + diffX) > maxX)	diffX = maxX - ZOOMER_nowX;
	if ((ZOOMER_nowY + diffY) > maxY)	diffY = maxY - ZOOMER_nowY;
	if ((ZOOMER_nowX + diffX) < minX)	diffX = minX - ZOOMER_nowX;
	if ((ZOOMER_nowY + diffY) < minY)	diffY = minY - ZOOMER_nowY;

	return [diffX, diffY];
}
function ZOOMER_gohome() {

	// 壁のズーム
	ZOOMER_lastS	= 1;
	ZOOMER_nowS		= 1;
	CUR_lastX		= 0;
	CUR_lastY		= 0;
	CUR_nowX		= 0;
	CUR_nowY		= 0;
	var trans = "translate(" + 0 + "px," + 0 +"px) scale(" + ZOOMER_nowS + ")";
	ZOOMER_obj.style.transform = trans;
	ZOOMER_wall.style.transform = trans;
	ZOOMER_getPos();
	
	// 軸のズーム
	SCALE_zoom();
}
function ZOOMER_adjust(zr, mr) {

	// 壁のアジャスト
	
	// 画面サイズ変更時はtransformを使わずに手作業で拡大する
	var tiles = ZOOMER_obj.children;
	for (var i=0; i<tiles.length; i++) {
		var elm = tiles[i];
		var x = elm.getAttributeNS(null, "x");
		var y = elm.getAttributeNS(null, "y");
		var w = elm.getAttributeNS(null, "width");
		var h = elm.getAttributeNS(null, "height");
		elm.setAttributeNS(null,	"x",		x*zr);
		elm.setAttributeNS(null,	"y",		y*zr);
		elm.setAttributeNS(null,	"width",	w*zr);
		elm.setAttributeNS(null,	"height",	h*zr);
	}

	tiles = MAP_obj.children;
	for (var i=0; i<tiles.length; i++) {
		var elm = tiles[i];
		var x = elm.getAttributeNS(null, "x");
		var y = elm.getAttributeNS(null, "y");
		var w = elm.getAttributeNS(null, "width");
		var h = elm.getAttributeNS(null, "height");
		elm.setAttributeNS(null,	"x",		x*mr);
		elm.setAttributeNS(null,	"y",		y*mr);
		elm.setAttributeNS(null,	"width",	w*mr);
		elm.setAttributeNS(null,	"height",	h*mr);
	}

	// 軸のアジャスト
	SCALE_zoom();
}
//------------------------------------------
// ズーム部の指定位置にタイルを１つ描画
//------------------------------------------
function ZOOMER_drawOne(x, y, x1, x2, y1, y2, isnot/* 0:無ければ放置 1:無ければ作る */, is/* 0:有れば放置 1:有れば消す */) {

	var index = null;
	var ptn = null;
	var color = null;	
	var SEL_DEFTYPE_Name = null;
	var SEL_DEFTYPE_no = null;
	var tile_count = 0;
	var xx = 0;

	if ( INPUT_MODE == "DAMAGE"){
		/* 損傷入力の時 */

		if ( y != WALL_Yreso ){
			/* 炉壁をクリック時 */

			/* 選択されている損傷種別と損傷種別No.を取り込む */
			[SEL_DEFTYPE_Name, SEL_DEFTYPE_no] = Select_DeftypeNameGet('DAMAGE','');
			if ( SEL_DEFTYPE_Name == null ){
				return;
			}

			/* タイルパターンNoを取り込む */
			index = SEL_DEFTYPE_no - 1;
			ptn = Number(JSON_DATA.DAMAGE_types[index].TILE_no);

			color	= DEFTYPE_obj.style.color;
		}
		else{
			/* 炉底をクリック時 */

			/* 選択されている炉底損傷種別と炉底損傷種別No.を取り込む */
			[SEL_DEFTYPE_Name, SEL_DEFTYPE_no] = Select_DeftypeNameGet('DAMAGE','ROTEI');
			if ( SEL_DEFTYPE_Name == null ){
				return;
			}

			/* タイルパターンNoを取り込む */
			index = SEL_DEFTYPE_no - 1;
			ptn = Number(JSON_DATA.DAMAGE_rotei_types[index].TILE_no);

			/* 炉底損傷種別の色をタイルの色とする */
			color	= DEFTYPE_ROTEI_obj.style.color;
		}
	}
	else{
		/* 補修入力の時 */

		if ( y != WALL_Yreso ){
			/* 炉壁をクリック時 */

			/* 選択されている損傷種別と損傷種別No.を取り込む */
			[SEL_DEFTYPE_Name, SEL_DEFTYPE_no] = Select_DeftypeNameGet('REPAIR','');
			if ( SEL_DEFTYPE_Name == null ){
				return;
			}

			/* タイルパターンNoを取り込む */
			index = SEL_DEFTYPE_no - 1;
			ptn = Number(JSON_DATA.REPAIR_types[index].TILE_no);

			color	= DEFTYPE_obj.style.color;
		}
		else{
			/* 炉底をクリック時 */

			/* 選択されている炉底損傷種別と炉底損傷種別No.を取り込む */
			[SEL_DEFTYPE_Name, SEL_DEFTYPE_no] = Select_DeftypeNameGet('REPAIR','ROTEI');
			if ( SEL_DEFTYPE_Name == null ){
				return;
			}

			/* タイルパターンNoを取り込む */
			index = SEL_DEFTYPE_no - 1;
			ptn = Number(JSON_DATA.REPAIR_rotei_types[index].TILE_no);

			/* 炉底損傷種別の色をタイルの色とする */
			color	= DEFTYPE_ROTEI_obj.style.color;
		}
	}

	var s_name	= "ZOOMER_tile-" + x + "-" + y;
	var s_class	= INPUT_MODE + "-" + SEL_DEFTYPE_no;
	var s_id	= s_name + "-" + s_class;
	var rect	= document.getElementById(s_id + "-1");
	
	if (rect == null) {
	
		if (isnot == 1) {
		
			/* jsonに登録されているタイルパターンの塗りつぶし数を取り込む */
			var pointCount = JSON_DATA.TILE_pattern[ptn].xpoint.length;
			for(var loop01=0; loop01<pointCount; loop01++){
			
				var TILE_xpoint = parseFloat(JSON_DATA.TILE_pattern[ptn].xpoint[loop01]);

				if ( JSON_DATA.TILE_pattern[ptn].onof[loop01] == 'true' ){
					tile_count = tile_count + 1;

					var elm = document.createElementNS("http://www.w3.org/2000/svg", "rect");
					elm.setAttribute("x",				(x1*ZOOMER_conW) + xx);
					elm.setAttribute("y",				(y1*ZOOMER_conH));
					elm.setAttribute("width",			(x2-x1)*ZOOMER_conW * TILE_xpoint);
					elm.setAttribute("height",			(y2-y1)*ZOOMER_conH);
					elm.setAttribute("stroke",			color);
					elm.setAttribute("fill",			color);
					elm.setAttribute("stroke-opacity",	0.5);
					elm.setAttribute("fill-opacity",	0.5);
					elm.setAttribute("id",				s_id + '-' + tile_count);
					elm.setAttribute("class",			s_class);
					elm.setAttribute("name",			s_name);
					elm.setAttribute("pointer-events",	"none");
					elm.setAttribute("position",		"fixed");
					ZOOMER_obj.appendChild(elm);

					/* 損傷または補修箇所を追加する */
					if ( INPUT_MODE == "DAMAGE"){
						DamageListValueAdd( x, WALL_Yreso-y );
					}
					else{
						RepairListValueAdd( x, WALL_Yreso-y );
					}
				}
				xx = xx + ((x2-x1)*ZOOMER_conW) * TILE_xpoint;
			}
		}
	} else {
	
		if (is == 1) {
		
			for(var loop01=0; loop01<5; loop01++){
			
				var tile_count = loop01 + 1;
				var rect = document.getElementById(s_id + '-' + tile_count);
				if (rect == null) {
					break;
				}
				rect.remove();
			}

			/* 損傷または補修箇所を削除する */
			if ( INPUT_MODE == "DAMAGE"){
				DamageListValueDel( SEL_DEFTYPE_no, x, WALL_Yreso-y );
			}
			else{
				RepairListValueDel( SEL_DEFTYPE_no, x, WALL_Yreso-y );
			}

		}
	}
	MAP_drawOne(x, y, x1, x2, y1, y2, isnot, is);
}
function ZOOMER_delOne(x, y, deftype_no) {

	var s_name = "ZOOMER_tile-" + x + "-" + y;
	var rects = document.getElementsByName(s_name);

	for (var i=0; i<rects.length; i++) {
	
		var s_class = rects[i].getAttribute("class");
		s_id = s_name + "-" + s_class;

		var s_class_ = s_class.split("-")
		var s_class_input_mode =  s_class_[0];
		var s_class_deftype_no =  s_class_[1];
		/* 入力モードと同じタイルを消す */
		if ( INPUT_MODE != s_class_input_mode){
			continue;
		}
		/* 損傷または補修種別Noが指定されている時、*/
		if ( 0 <= deftype_no ){
			/* タイルが同じ種別No.でない場合は消さない */
			if ( deftype_no != s_class_deftype_no ){
				continue;
			}
		}

		for(var loop01=0; loop01<5; loop01++){
		
			var tile_count = loop01 + 1;
			var rect = document.getElementById(s_id + '-' + tile_count);
			if (rect == null) {
				break;
			}
			rect.remove();
		}

		/* 損傷または補修箇所を削除する */
		if ( s_class_input_mode == "DAMAGE"){
			DamageListValueDel( s_class_deftype_no, x, WALL_Yreso-y );
		}
		else{
			RepairListValueDel( s_class_deftype_no, x, WALL_Yreso-y );
		}	

	}
	MAP_delOne(x, y);
}




//------------------------------------------
// ズーム部のクリック位置にタイルを１つ描画
//------------------------------------------
function ZOOMER_drawDot() {

	/* 検査箇所入力が未入力の時 */
	if ( PlaceInputCheak() == false ) {
		window.alert('【コークス炉管理】\n先に検査箇所を選択してください。');
		return;
	}

	var [r, x, y] = WALL_getXY(CUR_nowX, CUR_nowY);
	if (r == -1)	return;
	
	var [x1, x2, y1, y2] = WALL_getXsYs(x, y);
	ZOOMER_drawOne(x, y, x1, x2, y1, y2, 1, 1);
}
//------------------------------------------
// ズーム部のドラッグ範囲にタイルを必要数描画
//------------------------------------------
function ZOOMER_drawRect(mode/* 0:消す 1:描く */) {

	/* 検査箇所入力が未入力の時 */
	if ( PlaceInputCheak() == false ) {
		return;
	}

	var [r, x_from, y_from] = WALL_getXY(CUR_startX, CUR_startY);
	if (r == -1)	return;

	var [r, x_to, y_to] = WALL_getXY(CUR_nowX, CUR_nowY);
	if (r == -1)	return;

	if (x_from < x_to) {

		if (y_from < y_to) {
		
			// ↘↘↘↘↘↘
			for (var x=x_from; x<=x_to; x++) {
				for(var y=y_from; y<=y_to; y++) {
				
					var [x1, x2, y1, y2] = WALL_getXsYs(x, y);
					if (mode==1)	ZOOMER_drawOne(x, y, x1, x2, y1, y2, 1, 0);
					else			ZOOMER_delOne(x, y, -1);
				}
			}
		} else {
		
			// ↗↗↗↗↗↗
			for (var x=x_from; x<=x_to; x++) {
				for(var y=y_to; y<=y_from; y++) {
				
					var [x1, x2, y1, y2] = WALL_getXsYs(x, y);
					if (mode==1)	ZOOMER_drawOne(x, y, x1, x2, y1, y2, 1, 0);
					else			ZOOMER_delOne(x, y, -1);
				}
			}
		}
	} else {

		if (y_from < y_to) {
		
			// ↙↙↙↙↙↙
			for (var x=x_to; x<=x_from; x++) {
				for(var y=y_from; y<=y_to; y++) {
				
					var [x1, x2, y1, y2] = WALL_getXsYs(x, y);
					if (mode==1)	ZOOMER_drawOne(x, y, x1, x2, y1, y2, 1, 0);
					else			ZOOMER_delOne(x, y, -1);
				}
			}
		} else {
		
			// ↖↖↖↖↖↖
			for (var x=x_to; x<=x_from; x++) {
				for(var y=y_to; y<=y_from; y++) {
				
					var [x1, x2, y1, y2] = WALL_getXsYs(x, y);
					if (mode==1)	ZOOMER_drawOne(x, y, x1, x2, y1, y2, 1, 0);
					else			ZOOMER_delOne(x, y, -1);
				}
			}
		}
	}
}
//------------------------------------------
// スコープ表示処理
//------------------------------------------
function ZOOMER_dispSCOPE() {

	// 計算
	var window_w = ZOOMER_winW;
	var window_h = ZOOMER_winH;

	var client_w = ZOOMER_conW * ZOOMER_nowS;
	var client_h = ZOOMER_conH * ZOOMER_nowS;
	
	var SCOPE_l = -ZOOMER_nowX;
	var SCOPE_w;
	if (SCOPE_l < 0) {
		SCOPE_w = window_w + SCOPE_l;
		if (SCOPE_w > window_w)		SCOPE_w = window_w;
		if (SCOPE_w < 0)			SCOPE_w = 0;
		SCOPE_l = 0;
	} else {
		SCOPE_w = client_w - SCOPE_l;
		if (SCOPE_w > window_w)		SCOPE_w = window_w;
		if (SCOPE_w < 0)			SCOPE_w = 0;
	}
	SCOPE_rateL = SCOPE_l / client_w;
	SCOPE_rateW = SCOPE_w / client_w;

	var SCOPE_t = -ZOOMER_nowY;
	var SCOPE_h;
	if (SCOPE_t < 0) {
		SCOPE_h = window_h + SCOPE_t;
		if (SCOPE_h > window_h)		SCOPE_h = window_h;
		if (SCOPE_h < 0)			SCOPE_h = 0;
		SCOPE_t = 0;
	} else {
		SCOPE_h = client_h - SCOPE_t;
		if (SCOPE_h > window_h)		SCOPE_h = window_h;
		if (SCOPE_h < 0)			SCOPE_h = 0;
	}
	SCOPE_rateT = SCOPE_t / client_h;
	SCOPE_rateH = SCOPE_h / client_h;

	//document.getElementById("misc").innerHTML = "[" + window_w + ",　" + window_h + "] [" + SCOPE_l.toFixed(2) + ",　" + SCOPE_t.toFixed(2) + "]～[" + SCOPE_w.toFixed(2) + ",　" + SCOPE_h.toFixed(2) + ",　" + ZOOMER_nowS.toFixed(2) + "]";	//DEBUG
	//document.getElementById("misc").innerHTML = "[" + window_w + ",　" + window_h + "] [" + SCOPE_rateL.toFixed(2) + ",　" + SCOPE_rateT.toFixed(2) + "]～[" + SCOPE_rateW.toFixed(2) + ",　" + SCOPE_rateH.toFixed(2) + ",　" + ZOOMER_nowS.toFixed(2) + "]";	//DEBUG

	// 描画
	MAP_drawSCOPE();
}









//------------------------------------------
// 目盛部の描画処理
//------------------------------------------
function SCALE_draw() {
	var i;
	
	for (i=0; i<WALL_Yreso; i++) {
		var name = "SCALEL_" + i;
		var y = SCALE_getNakedY(i);
		var txt = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		txt.setAttributeNS(null,	"x", 5);
		txt.setAttributeNS(null,	"y", y);
		txt.setAttributeNS(null,	"font-size", "10");
		txt.setAttributeNS(null,	"id", name);
		txt.setAttributeNS(null,	"pointer-events", "none");
		txt.setAttributeNS(null,	"position", "fixed");
		txt.innerHTML = zeroPadding((WALL_Yreso - i), 2);
		SCALEL_obj.appendChild(txt);

		// センタリング
		txt.setAttributeNS(null,	"y", SCALE_YtoCentered(txt, y, i));
    }
	for (i=0; i<WALL_Yreso; i++) {
		var name = "SCALER_" + i;
		var y = SCALE_getNakedY(i);
		var txt = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		txt.setAttributeNS(null,	"x", 5);
		txt.setAttributeNS(null,	"y", y);
		txt.setAttributeNS(null,	"font-size", "10");
		txt.setAttributeNS(null,	"id", name);
		txt.setAttributeNS(null,	"pointer-events", "none");
		txt.setAttributeNS(null,	"position", "fixed");
		txt.innerHTML = zeroPadding((WALL_Yreso - i), 2);
		SCALER_obj.appendChild(txt);

		// センタリング
		txt.setAttributeNS(null,	"y", SCALE_YtoCentered(txt, y, i));
	}
	for (i=0; i<WALL_Xreso-2; i++) {
		var name = "SCALEB_" + i;
		var x = SCALE_getNakedX(i);
		var txt = document.createElementNS("http://www.w3.org/2000/svg", 'text');
		txt.setAttributeNS(null,	"x", x);
		txt.setAttributeNS(null,	"y", 10);
		txt.setAttributeNS(null,	"font-size", "10");
		txt.setAttributeNS(null,	"id", name);
		txt.setAttributeNS(null,	"pointer-events", "none");
		txt.setAttributeNS(null,	"position", "fixed");
		txt.innerHTML = zeroPadding(i+1, 2);
		SCALEB_obj.appendChild(txt);

		// センタリング
		txt.setAttributeNS(null,	"x", SCALE_XtoCentered(txt, x, i));
	}
}
//------------------------------------------
// 目盛座標計算処理
//------------------------------------------
function SCALE_getNakedY(i) {
	return (WALL_Ymin + WALL_Ypercents[i]) * ZOOMER_conH * ZOOMER_nowS;
}
function SCALE_getNakedX(i) {
	return (WALL_Xmin + WALL_Xpercents[i]) * ZOOMER_conW * ZOOMER_nowS;
}
function SCALE_YtoCentered(txt, y, i) {
	var bbox = txt.getBBox();
	var h;
	if (i == 0)		h = WALL_Ypercents[i];
	else			h = WALL_Ypercents[i] - WALL_Ypercents[i-1];
	var pad = ((h * ZOOMER_conH * ZOOMER_nowS) - (bbox.height * TXTHIGHTOCCUPANCY)) / 2;
	return y-pad;
}
function SCALE_XtoCentered(txt, x, i) {
	var bbox = txt.getBBox();
	var pad = ((WALL_Xpercents[i+1] - WALL_Xpercents[i]) * ZOOMER_conW * ZOOMER_nowS / 2) - (bbox.width / 2);
	return x+pad;
}
function SCALE_getCenteredY(txt, i) {
	var y = SCALE_getNakedY(i);
	return SCALE_YtoCentered(txt, y, i);
}
function SCALE_getCenteredX(txt, i) {
	var x = SCALE_getNakedX(i);
	return SCALE_XtoCentered(txt, x, i);
}
function zeroPadding(num,length){
    return ('0000000000' + num).slice(-length);
}
function SCALE_zoom() {
	// 軸のズーム
	var i;
	for (i=0; i<WALL_Yreso; i++) {
		var name = "SCALEL_" + i;
		var txt = document.getElementById(name);
		var cy = SCALE_getCenteredY(txt, i);
		txt.setAttributeNS(null,	"y", cy);

		name = "SCALER_" + i;
		txt = document.getElementById(name);
		txt.setAttributeNS(null,	"y", cy);
	}
	for (i=0; i<WALL_Xreso-2; i++) {
		var name = "SCALEB_" + i;
		var txt = document.getElementById(name);
		txt.setAttributeNS(null,	"x", SCALE_getCenteredX(txt, i));
	}
	trans = "translate(" + 0 + "px," + ZOOMER_nowY +"px) scale(" + 1 + ")";
	SCALEL_obj.style.transform = trans;
	SCALER_obj.style.transform = trans;
	trans = "translate(" + ZOOMER_nowX + "px," + 0 +"px) scale(" + 1 + ")";
	SCALEB_obj.style.transform = trans;
}











//------------------------------------------
// マップ機能初期化処理
//------------------------------------------
function MAP_init() {
	MAP_wall	= document.getElementById("MAP_wall");
	MAP_w		= MAP_wall.clientWidth;
	MAP_h		= MAP_wall.clientHeight;
	document.getElementById("left-lower").style.height = MAP_w * (ZOOMER_conH / ZOOMER_conW);
	
	// 壁紙に合わせてsvg領域のサイズも変更する
	MAP_obj		= document.getElementById("MAP_svg");
	MAP_obj.style.height = MAP_h;
	MAP_obj.style.width = MAP_w;
	
	// 上記でマップ高さが決まったのでその他エリアの高さ調節を行う
	resizeLeft();
}
function resizeLeft() {
	var w = document.getElementById("whole").clientHeight;
	var t = document.getElementById("left-top").clientHeight;
	var l = document.getElementById("left-lower").clientHeight;
	var b = document.getElementById("left-bottom").clientHeight;
	var u = w - t - l - b;
	document.getElementById("left-upper").style.height = u;
	document.getElementById("panel1").style.height = u;
	document.getElementById("panel2").style.height = u;
}
function MAP_onResize() {
	MAP_h		= MAP_wall.clientHeight;
	MAP_w		= MAP_wall.clientWidth;
	document.getElementById("left-lower").style.height = MAP_w * (ZOOMER_conH / ZOOMER_conW);
	
	// 壁紙に合わせてsvg領域のサイズも変更する
	MAP_obj.style.height = MAP_h;
	MAP_obj.style.width = MAP_w;
	
	// 上記でマップ高さが決まったのでその他エリアの高さ調節を行う
	resizeLeft();
}
//------------------------------------------
// マップ部の該当タイルを点指定で描画
//------------------------------------------
function MAP_drawOne(x, y, x1, x2, y1, y2, isnot/* 0:無ければ放置 1:無ければ作る */, is/* 0:有れば放置 1:有れば消す */) {

	var tile_count = 0;
	var xx = 0;
	if ( INPUT_MODE == "DAMAGE"){
		/* 損傷入力の時 */

		if ( y != WALL_Yreso ){
			/* 炉壁をクリック時 */

			/* 選択されている損傷種別と損傷種別No.を取り込む */
			var [SEL_DEFTYPE_Name, SEL_DEFTYPE_no] = Select_DeftypeNameGet('DAMAGE','');
			if ( SEL_DEFTYPE_Name == null ){
				return;
			}

			/* タイルパターンNoを取り込む */
			var index = SEL_DEFTYPE_no - 1;
			var ptn = Number(JSON_DATA.DAMAGE_types[index].TILE_no);

			var color	= DEFTYPE_obj.style.color;

		}
		else{
			/* 炉底をクリック時 */

			/* 選択されている炉底損傷種別と炉底損傷種別No.を取り込む */
			var [SEL_DEFTYPE_Name, SEL_DEFTYPE_no] = Select_DeftypeNameGet('DAMAGE','ROTEI');
			if ( SEL_DEFTYPE_Name == null ){
				return;
			}

			/* タイルパターンNoを取り込む */
			var index = SEL_DEFTYPE_no - 1;
			var ptn = Number(JSON_DATA.DAMAGE_rotei_types[index].TILE_no);

			/* 炉底損傷種別の色をタイルの色とする */
			var color	= DEFTYPE_ROTEI_obj.style.color;

		}
	}
	else{
		/* 補修入力の時 */

		if ( y != WALL_Yreso ){
			/* 炉壁をクリック時 */

			/* 選択されている損傷種別と損傷種別No.を取り込む */
			var [SEL_DEFTYPE_Name, SEL_DEFTYPE_no] = Select_DeftypeNameGet('REPAIR','');
			if ( SEL_DEFTYPE_Name == null ){
				return;
			}

			/* タイルパターンNoを取り込む */
			var index = SEL_DEFTYPE_no - 1;
			var ptn = Number(JSON_DATA.REPAIR_types[index].TILE_no);

			var color	= DEFTYPE_obj.style.color;

		}
		else{
			/* 炉底をクリック時 */

			/* 選択されている炉底損傷種別と炉底損傷種別No.を取り込む */
			var [SEL_DEFTYPE_Name, SEL_DEFTYPE_no] = Select_DeftypeNameGet('REPAIR','ROTEI');
			if ( SEL_DEFTYPE_Name == null ){
				return;
			}

			/* タイルパターンNoを取り込む */
			var index = SEL_DEFTYPE_no - 1;
			var ptn = Number(JSON_DATA.REPAIR_rotei_types[index].TILE_no);

			/* 炉底損傷種別の色をタイルの色とする */
			var color	= DEFTYPE_ROTEI_obj.style.color;

		}
	
	}

	var s_name	= "MAP_tile-" + x + "-" + y;
	var s_class	= INPUT_MODE + "-" + SEL_DEFTYPE_no;
	var s_id	= s_name + "-" + s_class;
	var rect	= document.getElementById(s_id + "-1");

	if (rect == null) {
	
		if (isnot == 1) {
		
			var pointCount = JSON_DATA.TILE_pattern[ptn].xpoint.length;
			for(var loop01=0; loop01<pointCount; loop01++){
			
				var TILE_xpoint = parseFloat(JSON_DATA.TILE_pattern[ptn].xpoint[loop01]);

				if ( JSON_DATA.TILE_pattern[ptn].onof[loop01] == 'true' ){
					tile_count = tile_count + 1;

					var svg = document.getElementById("MAP_svg");
					var elm = document.createElementNS("http://www.w3.org/2000/svg", "rect");
					elm.setAttribute("x",				(x1*MAP_w) + xx);
					elm.setAttribute("y",				(y1*MAP_h));
					elm.setAttribute("width",			(x2-x1)*MAP_w * TILE_xpoint);
					elm.setAttribute("height",			(y2-y1)*MAP_h);
					elm.setAttribute("stroke",			color);
					elm.setAttribute("fill",			color);
					elm.setAttribute("stroke-opacity",	0.5);
					elm.setAttribute("fill-opacity",	0.5);
					elm.setAttribute("id",				s_id + '-' + tile_count);
					elm.setAttribute("class",			s_class);
					elm.setAttribute("name",			s_name);
					elm.setAttribute("pointer-events",	"none");
					elm.setAttribute("position",		"fixed");
					svg.appendChild(elm);
				}
				xx = xx + ((x2-x1)*MAP_w) * TILE_xpoint;
			}
		}
	} else {
	
		if (is == 1) {
		
			for(var loop01=0; loop01<5; loop01++){
			
				var no = loop01+1;
				var rect = document.getElementById(s_id + '-' + no);
				if (rect == null) {
					break;
				}
				rect.remove();
			}
		}
	}
}
function MAP_delOne(x, y) {
	var s_name = "MAP_tile-" + x + "-" + y;
	var rects = document.getElementsByName(s_name);

	for (var i=0; i<rects.length; i++) {
	
		var s_class = rects[i].getAttribute("class");
		s_id = s_name + "-" + s_class;
		
		var s_class_ = s_class.split("-")
		var s_class_input_mode =  s_class_[0];
		var s_class_deftype_no =  s_class_[1];
		if ( INPUT_MODE != s_class_input_mode){
			continue;
		}

		for(var loop01=0; loop01<5; loop01++){
			
			var no = loop01+1;
			var rect = document.getElementById(s_id + '-' + no);
			if (rect == null) {
				break;
			}
			rect.remove();
		}

	}
}
//------------------------------------------
// スコープの描画
//------------------------------------------
function MAP_drawSCOPE() {
	var rate = ZOOMER_conW / ZOOMER_conH;
	var ch = MAP_obj.clientHeight;
	var cw = ch * rate;
	
	var l = MAP_w * SCOPE_rateL;
	var t = MAP_h * SCOPE_rateT;
	var w = MAP_w * SCOPE_rateW
	var h = MAP_h * SCOPE_rateH;

	document.getElementById("MAP_scope").style.x = l;
	document.getElementById("MAP_scope").style.y = t;
	document.getElementById("MAP_scope").style.width = w;
	document.getElementById("MAP_scope").style.height = h;
}

var MASK1_f=false;
function MASK1_on() {
	MASK1_f = true;
	
	var rect2 = document.getElementById("tab_area_").getBoundingClientRect();
	var rect3 = document.getElementById("left-bottom").getBoundingClientRect();
	var y1 = rect2.bottom;
	var y2 = rect3.top;
	var x1 = rect2.right;
	var h  = rect3.top - rect2.bottom;

	document.getElementById("MASK1_top").style.height = y1;
	document.getElementById("MASK1_right").style.top = y1;
	document.getElementById("MASK1_right").style.height = h;
	document.getElementById("MASK1_right").style.left = x1;
	document.getElementById("MASK1_bottom").style.top = y2;
}
function MASK1_off() {
	MASK1_f = false;
	
	var rect1 = document.getElementById("whole").getBoundingClientRect();
	var y1 = rect1.top;
	var y2 = rect1.bottom;
	var x1 = rect1.right;
	var h  = rect1.height;

	document.getElementById("MASK1_top").style.height = y1;
	document.getElementById("MASK1_right").style.top = y1;
	document.getElementById("MASK1_right").style.height = h;
	document.getElementById("MASK1_right").style.left = x1;
	document.getElementById("MASK1_bottom").style.top = y2;
}
function MASK1_rewrite() {
	if (MASK1_f == true)	MASK1_on();
	else					MASK1_off();
}

/*------------------------------------------*/
/* 選択されている損傷,炉底損傷,補修,炉底補修の種別とNo.を取り込む */
/*------------------------------------------*/
/* DEFTYPE_mode    : 損傷="DAMAGE" 補修="REPAIR" */
/* parts           : 炉壁="" 炉底="ROTEI"  */
function Select_DeftypeNameGet(DEFTYPE_mode, parts){
	var DEFTYPE = null;
	var SEL_DEFTYPE_Name = null;

	if ( DEFTYPE_mode == 'DAMAGE'){	
		if ( parts != 'ROTEI'){
			DEFTYPE = JSON_DATA.DAMAGE_types;

			/* 下段の"損傷種別:"から選択されている損傷種別を取り込む */
			SEL_DEFTYPE_Name = DEFTYPE_obj.getAttribute('DAMAGE_TYPE');
		}
		else{
			DEFTYPE = JSON_DATA.DAMAGE_rotei_types;

			/* 下段の"損傷種別:"から選択されている損傷種別を取り込む */
			SEL_DEFTYPE_Name = DEFTYPE_ROTEI_obj.getAttribute('DAMAGE_TYPE');
			SEL_DEFTYPE_Name = SEL_DEFTYPE_Name.replace('炉底損傷種別：','');
		}
	}
	else{
		if ( parts != 'ROTEI'){
			DEFTYPE = JSON_DATA.REPAIR_types;

			/* 下段の"補修種別:"から選択されている補修種別を取り込む */
			SEL_DEFTYPE_Name = DEFTYPE_obj.getAttribute('REPAIR_TYPE');

		}
		else{
			DEFTYPE = JSON_DATA.REPAIR_rotei_types;

			/* 下段の"補修種別:"から選択されている補修種別を取り込む */
			SEL_DEFTYPE_Name = DEFTYPE_ROTEI_obj.getAttribute('REPAIR_TYPE');
			SEL_DEFTYPE_Name = SEL_DEFTYPE_Name.replace('炉底補修種別：','');
		}
	}
	
	/* 損傷種別のリストにないときは、未選択にする */
	var DEFTYPE_Name = null;
	var DEFTYPE_no = -1;
	for(var loop01=0; loop01<DEFTYPE.length; loop01++){
		/* jsonから損傷種別のリストを取り込む */
		var DamageName_list = DEFTYPE[loop01].name;

		if (SEL_DEFTYPE_Name == DamageName_list ){

			DEFTYPE_Name = DamageName_list;
			DEFTYPE_no = loop01 + 1;
			break;
		}
	}

	return [DEFTYPE_Name, DEFTYPE_no];	
}

/*------------------------------------------*/
/* 損傷種別,炉底損傷種別,補修種別,炉底補修種別のNo.を名称に変換する　*/
/*------------------------------------------*/
/* DEFTYPE_no      : 損傷種別No.            */
/* DEFTYPE_mode    : 損傷="DAMAGE" 補修="REPAIR" */
/* parts           : 炉壁="" 炉底="ROTEI"  */
function DEFTYPE_No2Name(DEFTYPE_no, DEFTYPE_mode, parts) {
	var DEFTYPE_Name = null;

	var index = DEFTYPE_no - 1;
	if ( DEFTYPE_mode == 'DAMAGE'){	
		if ( parts != 'ROTEI'){
			DEFTYPE_Name = JSON_DATA.DAMAGE_types[index].name;
		}
		else{
			DEFTYPE_Name = JSON_DATA.DAMAGE_rotei_types[index].name;
			DEFTYPE_Name = '炉底損傷種別：' + DEFTYPE_Name
		}
	}
	else{
		if ( parts != 'ROTEI'){
			DEFTYPE_Name = JSON_DATA.REPAIR_types[index].name;
		}
		else{
			DEFTYPE_Name = JSON_DATA.REPAIR_rotei_types[index].name;
			DEFTYPE_Name = '炉底補修種別：' + DEFTYPE_Name
		}
	}

	return( DEFTYPE_Name );
}

/*------------------------------------------*/
/* 損傷種別,炉底損傷種別,補修種別,炉底補修種別の名称をにNo.変換する　*/
/*------------------------------------------*/
/* DEFTYPE_name    : 損傷種別名称            */
/* DEFTYPE_mode    : 損傷="DAMAGE" 補修="REPAIR" */
/* parts           : 炉壁="" 炉底="ROTEI"  */
function DEFTYPE_Name2No(DEFTYPE_name, DEFTYPE_mode, parts) {
	var DEFTYPE_no = null;
	var DEFTYPE = null;

	if ( DEFTYPE_mode == 'DAMAGE'){	
		if ( parts != 'ROTEI'){
			DEFTYPE = JSON_DATA.DAMAGE_types;
		}
		else{
			DEFTYPE = JSON_DATA.DAMAGE_rotei_types;
			DEFTYPE_name = DEFTYPE_name.replace('炉底損傷種別：','');
		}
	}
	else{
		if ( parts != 'ROTEI'){
			DEFTYPE = JSON_DATA.REPAIR_types;
		}
		else{
			DEFTYPE = JSON_DATA.REPAIR_rotei_types;
			DEFTYPE_name = DEFTYPE_name.replace('炉底補修種別：','');
		}
	}

	for(var loop01=0; loop01<DEFTYPE.length; loop01++){
		if (DEFTYPE[loop01].name == DEFTYPE_name){
			DEFTYPE_no = loop01 + 1;
			break;
		}
	}

	return( DEFTYPE_no );
}

/*------------------------------------------------*/
/* 損傷,炉底損傷,補修,炉底補修種別リストに対応するタイルを削除する  */
/*------------------------------------------------*/
/* DEFTYPE_name    : 損傷種別名称                  */
/* DEFTYPE_points  : 損傷箇所リスト                */
/* DEFTYPE_mode    : 損傷="DAMAGE"  補修="REPAIR"  */
function DeftypeTileDel( DEFTYPE_name, DEFTYPE_points, DEFTYPE_mode ) {
	var deftype_no = null;
   
	/* 損傷または補修箇所リストを損傷箇所毎に分解する */
	var DeftypePointArray = DEFTYPE_points.split(",")
  
	/* 損傷または補修箇所数分ループする */
	for(var loop01=0; loop01<DeftypePointArray.length; loop01++){
	  /* 煉瓦No.と炉団No.に分解する */
	  var RengaRodanArray = DeftypePointArray[loop01].split("-")
  
	  /* 煉瓦No. */
	  var RengaNo = Number(RengaRodanArray[0]);
	  /* 炉団No. */
	  var RodanNo = Number(RengaRodanArray[1]);
  
	  /* 損傷または補修種別No.を取り込む */
	  if ( loop01 == 0 ){
		  if ( RodanNo != 0){
			/* 損傷または補修種別の名称をNo.に変換する　*/
			deftype_no = DEFTYPE_Name2No(DEFTYPE_name, DEFTYPE_mode, "");
		  }
		  else{
			/* 炉底損傷種別または炉底補修種別の名称をNo.に変換する　*/
			deftype_no = DEFTYPE_Name2No(DEFTYPE_name, DEFTYPE_mode, "ROTEI");
		  }
	  }
  
	  /* 対象箇所のタイルを全部削除する */
	  var x = RengaNo;
	  var y = WALL_Yreso - RodanNo;
	  ZOOMER_delOne(x, y, deftype_no);
  
	}
  
  }
  
/*------------------------------------------*/
/* 今日の日付を取り込む                       */
/*------------------------------------------*/
function ToDayDate() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	ymd = DateFomat(year,month,day);

	return(ymd);
}

/*------------------------------------------*/
/* 今日の日付を取り込む                       */
/*------------------------------------------*/
function DateFomat(year,month,day) {

	var toTwoDigits = function (num, digit) {
		num += '';
		if (num.length < digit) {
			num = '0' + num;
		}
		return num;
	}

	var yyyy = toTwoDigits(year, 4);
	var mm = toTwoDigits(month, 2);
	var dd = toTwoDigits(day, 2);
	var ymd = yyyy + "-" + mm + "-" + dd;

	return(ymd);
}


/*------------------------------------------*/
/* 編集モードかをチェックする                 */
/*------------------------------------------*/
/* 返り値 :                                 */
/*          false = 完了モード              */
/*          true = 編集モード               */
function EditModeCheck() {
	var retc = false;

	/* 編集モード(表示が完了)の時、true */
	var editmode = document.getElementById("MENU_damage_lists_edit").innerHTML;
	if ( editmode.indexOf('編集') == -1 ){
		retc = true;
	}

	return retc;
}

/*------------------------------------------*/
/* 損傷または補修の対象のリストを編集する       */
/*------------------------------------------*/
function Lists_edit() {
	if (INPUT_MODE == "DAMAGE"){
		DAMAGE_lists_edit();
	}
	else{
		REPAIR_lists_edit();
	}
}

/*------------------------------------------*/
/* 損傷種別の選択リストを作成する              */
/*------------------------------------------*/
function DamageTypeSelectListCreate() {
	/* 損傷種別の選択リストHTMLを作成 */
	var DEFTYPE_html = "";
	/* JSONに登録されている 損傷種別の数を取り込む */
	var DamageCount = JSON_DATA.DAMAGE_types.length;
	/* 損傷種別の数ループ */
	for(var loop01=0; loop01<DamageCount; loop01++){

		/* JSONからデータを取り込む*/
		/* 損傷種別 */
		var DamageName = JSON_DATA.DAMAGE_types[loop01].name;
		/* 損傷種別 色 */
		var Damagecolor = JSON_DATA.DAMAGE_types[loop01].color;

		/* タグIDを編集する */
		var IdNo = loop01 + 1; 
		var IdName = 'DEFTYPE' + IdNo; 

		var node = document.getElementById( "PAGE_deftype" );

		/* 区切りの線を引く*/
		if ( loop01 != 0 ){
			DEFTYPE_html = DEFTYPE_html + '<hr style="border:0;border-top:1px solid silver;">';
		}

		/* HTML編集 */
		DEFTYPE_html = DEFTYPE_html + '<div id="' + IdName + '" style="color:' + Damagecolor + '; font-size:17px; cursor: pointer">' + DamageName + '</div>';
		/* HTMLを設定する */
		node.innerHTML = DEFTYPE_html;
	}

	/* 初期表示は損傷種別の選択リストの先頭を下段損傷種別に表示する */
	var DAMAGE_TYPE = DEFTYPE_obj.getAttribute('DAMAGE_TYPE');
	if ( DAMAGE_TYPE == null ){
		DAMAGE_TYPE = JSON_DATA.DAMAGE_types[0].name;
		DEFTYPE_obj.setAttribute('DAMAGE_TYPE',DAMAGE_TYPE);
	}

	var DAMAGE_COLOR = DEFTYPE_obj.getAttribute('DAMAGE_COLOR');
	if ( DAMAGE_COLOR == null ){
		DAMAGE_COLOR = JSON_DATA.DAMAGE_types[0].color;
		DEFTYPE_obj.setAttribute('DAMAGE_COLOR',DAMAGE_COLOR);
	}

	DEFTYPE_obj.innerHTML = '<span id="DEFTYPE_title" style="color:blue;">損傷種別：</span>' + DAMAGE_TYPE;
	DEFTYPE_obj.style.color = DAMAGE_COLOR;

	/* onclickのイベント付加する */
	for(var loop01=0; loop01<DamageCount; loop01++){
		/* タグIDを編集する */
		var IdNo = loop01 + 1; 
		var IdName = 'DEFTYPE' + IdNo; 

		/* onclickのイベント付加する */
		document.getElementById(IdName).onclick = function(){DEFTYPE_select_clicked(this,'損傷種別','DAMAGE');};
	}

}

/*------------------------------------------*/
/* 炉底損傷種別の選択リストを作成する              */
/*------------------------------------------*/
function DamageTypeRoteiSelectListCreate() {
	/* 炉底損傷種別の選択リストHTMLを作成 */
	var DEFTYPE_rotei_html = "";
	/* JSONに登録されている 炉底損傷種別の数を取り込む */
	var Damage_roteiCount = JSON_DATA.DAMAGE_rotei_types.length;
	/* 炉底損傷種別の数ループ */
	for(var loop01=0; loop01<Damage_roteiCount; loop01++){

		/* JSONからデータを取り込む*/
		/* 炉底損傷種別 */
		var DamageName = JSON_DATA.DAMAGE_rotei_types[loop01].name;
		/* 炉底損傷種別 色 */
		var Damagecolor = JSON_DATA.DAMAGE_rotei_types[loop01].color;

		/* タグIDを編集する */
		var IdNo = loop01 + 1; 
		var IdName = 'DEFTYPE_rotei' + IdNo; 

		var node = document.getElementById( "PAGE_deftype_rotei" );

		/* 区切りの線を引く*/
		if ( loop01 != 0 ){
			DEFTYPE_rotei_html = DEFTYPE_rotei_html + '<hr style="border:0;border-top:1px solid silver;">';
		}

		/* HTML編集 */
		DEFTYPE_rotei_html = DEFTYPE_rotei_html + '<div id="' + IdName + '" style="color:' + Damagecolor + '; font-size:17px; cursor: pointer">' + DamageName + '</div>';
		/* HTMLを設定する */
		node.innerHTML = DEFTYPE_rotei_html;
	}

	/* 初期表示は炉底損傷種別の選択リストの先頭を下段炉底損傷種別に表示する */
	var DAMAGE_TYPE = DEFTYPE_ROTEI_obj.getAttribute('DAMAGE_TYPE');
	if ( DAMAGE_TYPE == null ){
		DAMAGE_TYPE = JSON_DATA.DAMAGE_rotei_types[0].name;
		DEFTYPE_ROTEI_obj.setAttribute('DAMAGE_TYPE',DAMAGE_TYPE);
	}

	var DAMAGE_COLOR = DEFTYPE_ROTEI_obj.getAttribute('DAMAGE_COLOR');
	if ( DAMAGE_COLOR == null ){
		DAMAGE_COLOR = JSON_DATA.DAMAGE_rotei_types[0].color;
		DEFTYPE_ROTEI_obj.setAttribute('DAMAGE_COLOR',DAMAGE_COLOR);
	}

	DEFTYPE_ROTEI_obj.innerHTML = '<span id="DEFTYPE_ROTEI_title" style="color:blue;">炉底損傷種別：</span>' + DAMAGE_TYPE;
	DEFTYPE_ROTEI_obj.style.color = DAMAGE_COLOR;

	/* onclickのイベント付加する */
	for(var loop01=0; loop01<Damage_roteiCount; loop01++){
		/* タグIDを編集する */
		var IdNo = loop01 + 1; 
		var IdName = 'DEFTYPE_rotei' + IdNo; 

		/* onclickのイベント付加する */
		document.getElementById(IdName).onclick = function(){DEFTYPE_rotei_select_clicked(this,'炉底損傷種別','DAMAGE');};
	}

}

/*------------------------------------------*/
/* 補修種別の選択リストを作成する              */
/*------------------------------------------*/
function RrepairTypeSelectListCreate(){
	/* 補修種別の選択リストHTMLを作成 */
	var DEFTYPE_html = "";
	/* JSONに登録されている 損傷種別の数を取り込む */
	var RrepairCount = JSON_DATA.REPAIR_types.length;
	/* 補修種別の数ループ */
	for(var loop01=0; loop01<RrepairCount; loop01++){

		/* JSONからデータを取り込む*/
		/* 補修種別 */
		var RrepairName = JSON_DATA.REPAIR_types[loop01].name;
		/* 補修種別 色 */
		var Rrepaircolor = JSON_DATA.REPAIR_types[loop01].color;

		/* タグIDを編集する */
		var IdNo = loop01 + 1; 
		var IdName = 'DEFTYPE' + IdNo; 

		var node = document.getElementById( "PAGE_deftype" );

		/* 区切りの線を引く*/
		if ( loop01 != 0 ){
			DEFTYPE_html = DEFTYPE_html + '<hr style="border:0;border-top:1px solid silver;">';
		}

		/* HTML編集 */
		DEFTYPE_html = DEFTYPE_html + '<div id="' + IdName + '" style="color:' + Rrepaircolor + '; font-size:17px; cursor: pointer">' + RrepairName + '</div>';
		/* HTMLを設定する */
		node.innerHTML = DEFTYPE_html;
	}

	/* 初期表示は補修種別の選択リストの先頭を下段補修種別に表示する */
	var REPAIR_TYPE = DEFTYPE_obj.getAttribute('REPAIR_TYPE');
	if ( REPAIR_TYPE == null ){
		REPAIR_TYPE = JSON_DATA.REPAIR_types[0].name;
		DEFTYPE_obj.setAttribute('REPAIR_TYPE',REPAIR_TYPE);
	}

	var REPAIR_COLOR = DEFTYPE_obj.getAttribute('REPAIR_COLOR');
	if ( REPAIR_COLOR == null ){
		REPAIR_COLOR = JSON_DATA.REPAIR_types[0].color;
		DEFTYPE_obj.setAttribute('REPAIR_COLOR',REPAIR_COLOR);
	}

	DEFTYPE_obj.innerHTML = '<span id="DEFTYPE_title" style="color:blue;">補修種別：</span>' + REPAIR_TYPE;
	DEFTYPE_obj.style.color = REPAIR_COLOR;

	/* onclickのイベント付加する */
	for(var loop01=0; loop01<RrepairCount; loop01++){
		/* タグIDを編集する */
		var IdNo = loop01 + 1; 
		var IdName = 'DEFTYPE' + IdNo; 

		/* onclickのイベント付加する */
		document.getElementById(IdName).onclick = function(){DEFTYPE_select_clicked(this,'補修種別','REPAIR');};
	}

}

/*------------------------------------------*/
/* 炉底補修種別の選択リストを作成する           */
/*------------------------------------------*/
function RrepairTypeRoteiSelectListCreate(){
	/*  炉底補修種別の選択リストHTMLを作成 */
	var DEFTYPE_html = "";
	/* JSONに登録されている  炉底補修種別の数を取り込む */
	var Rrepair_roteiCount = JSON_DATA.REPAIR_rotei_types.length;
	/*  炉底補修種別の数ループ */
	for(var loop01=0; loop01<Rrepair_roteiCount; loop01++){

		/* JSONからデータを取り込む*/
		/*  炉底補修種別 */
		var RrepairName = JSON_DATA.REPAIR_rotei_types[loop01].name;
		/*  炉底補修種別 色 */
		var Rrepaircolor = JSON_DATA.REPAIR_rotei_types[loop01].color;

		/* タグIDを編集する */
		var IdNo = loop01 + 1; 
		var IdName = 'DEFTYPE_rotei' + IdNo; 

		var node = document.getElementById( "PAGE_deftype_rotei" );

		/* 区切りの線を引く*/
		if ( loop01 != 0 ){
			DEFTYPE_html = DEFTYPE_html + '<hr style="border:0;border-top:1px solid silver;">';
		}

		/* HTML編集 */
		DEFTYPE_html = DEFTYPE_html + '<div id="' + IdName + '" style="color:' + Rrepaircolor + '; font-size:17px; cursor: pointer">' + RrepairName + '</div>';
		/* HTMLを設定する */
		node.innerHTML = DEFTYPE_html;
	}

	/* 初期表示は 炉底補修種別の選択リストの先頭を下段 炉底補修種別に表示する */	
	var REPAIR_TYPE = DEFTYPE_ROTEI_obj.getAttribute('REPAIR_TYPE');
	if ( REPAIR_TYPE == null ){
		REPAIR_TYPE = JSON_DATA.REPAIR_rotei_types[0].name;
		DEFTYPE_ROTEI_obj.setAttribute('REPAIR_TYPE',REPAIR_TYPE);
	}

	var REPAIR_COLOR = DEFTYPE_ROTEI_obj.getAttribute('REPAIR_COLOR');
	if ( REPAIR_COLOR == null ){
		REPAIR_COLOR = JSON_DATA.REPAIR_rotei_types[0].color;
		DEFTYPE_ROTEI_obj.setAttribute('REPAIR_COLOR',REPAIR_COLOR);
	}

	DEFTYPE_ROTEI_obj.innerHTML = '<span id="DEFTYPE_title" style="color:blue;">炉底補修種別：</span>' + REPAIR_TYPE;
	DEFTYPE_ROTEI_obj.style.color = REPAIR_COLOR;

	/* onclickのイベント付加する */
	for(var loop01=0; loop01<Rrepair_roteiCount; loop01++){
		/* タグIDを編集する */
		var IdNo = loop01 + 1; 
		var IdName = 'DEFTYPE_rotei' + IdNo; 

		/* onclickのイベント付加する */
		document.getElementById(IdName).onclick = function(){DEFTYPE_rotei_select_clicked(this,'炉底補修種別','REPAIR');};
	}

}


// 指定位置に赤マーク表示（デバッグ用）
function mark(x, y) {
					var elm = document.createElementNS("http://www.w3.org/2000/svg", "rect");
					elm.setAttribute("x",				x);
					elm.setAttribute("y",				y);
					elm.setAttribute("width",			5);
					elm.setAttribute("height",			5);
					elm.setAttribute("stroke",			"red");
					elm.setAttribute("fill",			"red");
					elm.setAttribute("stroke-opacity",	1);
					elm.setAttribute("fill-opacity",	1);
					elm.setAttribute("id",				"mark");
					elm.setAttribute("pointer-events",	"none");
					elm.setAttribute("position",		"fixed");
					ZOOMER_obj.appendChild(elm);
}

// 整数化関数
function n(f) {
	return f.toFixed(0);
}

