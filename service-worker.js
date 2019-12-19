//20191217155150

var CACHE_NAME  = "CKMAINTAIN-ver000.08";

var urlsToCache = [
    "camera.js",
    "camera-icon.png",
    "ckmaintain.css",
    "ckmaintain.html",
    "ckmaintain.js",
    "ckmaintain.json",
    "damage_comment_input.css",
    "damage_comment_input.js",
    "damage_end_input.css",
    "damage_end_input.js",
    "damage_kilnwidth.css",
    "damage_kilnwidth.js",
    "damage_lists.css",
    "damage_lists.js",
	"icon-114.png",
	"icon-120.png",
	"icon-144.png",
	"icon-152.png",
    "icon-192.png",
    "icon-256.png",
    "indexedDB.js",
    "magniglass.png",
    "mainmenu.css",
    "place.css",
    "place.js",
    "repair_comment_input.css",
    "repair_comment_input.js",
    "repair_end_info.css",
    "repair_end_info.js",
    "repair_end_input.css",
    "repair_end_input.js",
    "repair_kilnwidth.css",
    "repair_kilnwidth.js",
    "repair_lists.css",
    "repair_lists.js",
    "repair_status.css",
    "repair_status.js",
    "search.css",
    "search.js",
    "share.png",
	"stop.png",
    "wallpaper.bmp",
    "wallpaper.js"
];

const CACHE_KEYS = [
  CACHE_NAME
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME) // 上記で指定しているキャッシュ名
          .then(
          function(cache){
              return cache.addAll(urlsToCache); // 指定したリソースをキャッシュへ追加
              // 1つでも失敗したらService Workerのインストールはスキップされる
          })
    );
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => {
          return !CACHE_KEYS.includes(key);
        }).map(key => {
          // 不要なキャッシュを削除
          return caches.delete(key);
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event) {
  //ブラウザが回線に接続しているかをboolで返してくれる
  var online = navigator.onLine;

  //回線が使えるときの処理
  if(online){
    event.respondWith(
      caches.match(event.request)
        .then(
        function (response) {
          if (response) {
            return response;
          }
          //ローカルにキャッシュがあればすぐ返して終わりですが、
          //無かった場合はここで新しく取得します
          return fetch(event.request)
            .then(function(response){
              // 取得できたリソースは表示にも使うが、キャッシュにも追加しておきます
              // ただし、Responseはストリームなのでキャッシュのために使用してしまうと、ブラウザの表示で不具合が起こる(っぽい)ので、複製しましょう
              cloneResponse = response.clone();
              if(response){
                //ここ&&に修正するかもです
                if(response || response.status == 200){
                  //現行のキャッシュに追加
                  caches.open(CACHE_NAME)
                    .then(function(cache)
                    {
                      cache.put(event.request, cloneResponse)
                      .then(function(){
                        //正常にキャッシュ追加できたときの処理(必要であれば)
                      });
                    });
                }else{
                  //正常に取得できなかったときにハンドリングしてもよい
                  return response;
                }
                return response;
              }
            }).catch(function(error) {
              //デバッグ用
              return console.log(error);
            });
        })
    );
  }else{
    //オフラインのときの制御
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // キャッシュがあったのでそのレスポンスを返す
          if (response) {
            return response;
          }
          //オフラインでキャッシュもなかったパターン
          return caches.match("offline.html")
              .then(function(responseNodata)
              {
                //適当な変数にオフラインのときに渡すリソースを入れて返却
                //今回はoffline.htmlを返しています
                return responseNodata;
              });
        }
      )
    );
  }
});

