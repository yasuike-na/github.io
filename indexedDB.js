//20191217155150

//---------------------------------------------------------------------------------------
// ローカルＤＢクラス
//
// 使い方
//
// 1.初期化時
//   DB_init();
//
// 2.書き込み
//   DB_write(sn_LOCALSAVE, {name:"jordan", age:"20", sex:"male", tall:"182"});
//
// 3.読み出し
//   var handle = DB_read(sn_LOCALSAVE, "michaelle");
//   handle.onsuccess = function(event){
//       var data = event.target.result;
//       alert(data.tall);
//   }
//---------------------------------------------------------------------------------------

var dbName					= "ckmaintain_IndexedDB";
var dbVersion				= "201911251002";
var db;

var sn_MASTERINFO	= "masterInfo";
var sn_LOCALSAVE		= "localsave";

function DB_init() {
	// DB名を指定して接続
	var openReq  = indexedDB.open(dbName, dbVersion);

	// 接続失敗時処理
	openReq.onerror = function (event) {
    	alert("ローカルストレージへの接続に失敗しました。");
	}

	// DBの新規作成時(or バージョン更新時)処理
	openReq.onupgradeneeded = function (event) {
		db = event.target.result;
		
		if(db.objectStoreNames.contains(sn_MASTERINFO) === false){
			const store = db.createObjectStore(sn_MASTERINFO,	{keyPath : "name"});
		}
		if(db.objectStoreNames.contains(sn_LOCALSAVE) === false){
			const store = db.createObjectStore(sn_LOCALSAVE,	{keyPath : "name"});
		}
		//alert("ローカルストレージを構築しました。");
	}

	// DBオープン完了時処理
	openReq.onsuccess = function (event) {
		db = event.target.result;
	}

}

function DB_read(storename, key) {
	var trans = db.transaction(storename, "readonly");
   	var store = trans.objectStore(storename);
   	var getReq = store.get(key);
	return getReq;
}

function DB_write(storename, data) {
	var trans = db.transaction(storename, "readwrite");
	var store = trans.objectStore(storename);
	var putReq = store.put(data);
	putReq.onsuccess = function (event) {
	}
}




