//20191217155150
/*********************************************************************/
/* 損傷箇所リスト画面                                                  */
/*********************************************************************/

/*------------------------------------------------*/
/* 損傷箇所リストにデータを表示する                  */
/*------------------------------------------------*/
/* RengaNo        : 煉瓦No.                        */
/* RodanNo        : 炉段No.                        */
function DamageListValueAdd( RengaNo, RodanNo ){
  var tblData = document.getElementById("MENU_damage_lists_value");

  /* 行数を取り込む */
  ListRows = tblData.rows.length;
  /* 最終行を取り込む */
  ListLastRow = ListRows - 1;

  var SelectDamageType = null;
  var SelectDamageNo = null;
  var Damagecolor = null;
  /* 0段の時は、炉底 以外の時は炉壁 */
  if ( RodanNo != 0 ){
    /* 炉壁の時 */

    /* 画面下帯の損傷種別を取り込む */
    [SelectDamageType,SelectDamageNo] = Select_DeftypeNameGet('DAMAGE','');
    /* 画面下帯の炉底損傷種別の色を取り込む */
    Damagecolor = DEFTYPE_obj.style.color;
  }
  else{
    /* 炉底の時 */

    /* 画面下帯の炉底損傷種別を取り込む */
    SelectDamageType = document.getElementById("DEFTYPE_ROTEI").innerText;
    /* 画面下帯の炉底損傷種別の色を取り込む */
    Damagecolor = DEFTYPE_ROTEI_obj.style.color;
  }
  
  /* 損傷箇所リスト中の損傷種別を取り込む */
  var ListDamageType = "";
  if ( 0 < ListRows ){
    var ListDamageTypeNode = TableTagNodeGet("MENU_damage_lists_value",ListLastRow,0,"MENU_damageType","div");
    if ( ListDamageTypeNode != null){

      /* 損傷箇所リストから損傷種別を取り込む */
      var ListDamageType = ListDamageTypeNode.innerHTML;
    }
  }

  /* 行を追加するかを判定する */
  /* 選択とリストの損傷種別が違うとき、行追加 */
  var ListRowAdd = false;
  if ( SelectDamageType != ListDamageType ){
    ListRowAdd = true;
  }


  /* 行追加の時 */
  if ( ListRowAdd == true ){
    /* 損傷リストの行を追加する */
    DamageListRowAdd('MENU_damage_lists_value');

    /* 行追加後、行数を取り直し最終行を取り込む */
    /* 行数を取り込む */
    ListRows = tblData.rows.length;
    /* 最終行を取り込む */
    ListLastRow = ListRows - 1;

    /* 損傷リスト中の損傷種別を表示する */
    var DamageTypeNode = TableTagNodeGet("MENU_damage_lists_value",ListLastRow,0,"MENU_damageType","div");
    if ( DamageTypeNode != null){
      DamageTypeNode.style.color = Damagecolor;
      DamageTypeNode.innerHTML = SelectDamageType;
    }
  }

  /* 行数を取り込む */
  ListRows = tblData.rows.length;
  /* 最終行を取り込む */
  ListLastRow = ListRows - 1;

  /* 損傷箇所を編集する */
  DamagePoint = RengaNo + "-" + RodanNo;
  var ListDamagePointNode = TableTagNodeGet("MENU_damage_lists_value",ListLastRow,0,"MENU_damagePoints","div");

  if ( ListDamagePointNode != null){

    /* 表示している損傷箇所を取り込む */
    var DamagePoints = ListDamagePointNode.innerHTML;
    var DamagePoints_ = ',' + DamagePoints + ',';

    /* 同じ箇所がすでにある時は、追加しない。 */
    if (DamagePoints_.indexOf(',' + DamagePoint + ',') != -1) {
      return;
    }

    /* ,(カンマ)を追加する */
    if ( DamagePoints != "" ){
      DamagePoint = "," + DamagePoint;
    }
  
    /* 損傷箇所を追加する */
    DamagePoints = DamagePoints + DamagePoint;

    /* 損傷箇所を表示する */
    ListDamagePointNode.innerHTML = DamagePoints;
  }

}

/*------------------------------------------------*/
/* 損傷リストの行を追加する                         */
/*------------------------------------------------*/
/* id : 行追加のテーブルID                         */
function DamageListRowAdd( id ){
  /* テーブル取得 */
  var table = document.getElementById(id);
  /* 行を行末に追加 */
  var row = table.insertRow(-1);
  /* セルの挿入 */
  var cell1 = row.insertCell(-1);

  /* 行数取得 */
  /* var RowNo = table.rows.length; */
  /* 行のインデックスを取り込む */
  var rowIndex = row.sectionRowIndex;
  /* 行No.を取り込む */
  var RowNo = rowIndex + 1;
  
/* 削除ボタン用 HTML */
/*  var htmlValue= '<input id="DAMAGE_lists_value_del" type="button" value="削除" onclick="DAMAGE_lists_RowDelButton(this)" />'; */
/* 損傷箇所リスト HTML */
  var htmlValue = "";
  htmlValue = htmlValue + '<div id="MENU_DAMAGE_lists_table">';
  htmlValue = htmlValue +   '<div id="MENU_DAMAGE_lists_col1">';
  htmlValue = htmlValue +     '<div id="MENU_DAMAGE_lists_col1-1">';
  //htmlValue = htmlValue +       '<input type="image" src="stop.png" id="DAMAGE_lists_edit_icon" onclick="DAMAGE_lists_rowdel_display(this)">';
  htmlValue = htmlValue +       '<button type="button" id="DAMAGE_lists_edit_icon" value="" onclick="DAMAGE_lists_rowdel_display(this)">';
  htmlValue = htmlValue +         '<img id="DAMAGE_lists_edit_png" src="stop.png" onclick="DAMAGE_lists_rowdel_display(this)">';
  htmlValue = htmlValue +       '</button>';
  htmlValue = htmlValue +     '</div>';
  
  htmlValue = htmlValue +     '<div id="MENU_DAMAGE_lists_col1-2">';
  htmlValue = htmlValue +       '<div id=Damage_listNo>#' + RowNo + '</div>';
  htmlValue = htmlValue +     '</div>';

  htmlValue = htmlValue +     '<div id="MENU_DAMAGE_lists_col1-3">';
  htmlValue = htmlValue +       '<div id="MENU_damageType"></div>';
  htmlValue = htmlValue +       '<div id="MENU_damagePoints"></div>';
  htmlValue = htmlValue +     '</div>';
  
  htmlValue = htmlValue +   '</div>';
  
  htmlValue = htmlValue +   '<div id="MENU_DAMAGE_lists_col2">';
  htmlValue = htmlValue +     '<input id="DAMAGE_lists_value_del" type="button" value="削除" onclick="DAMAGE_lists_RowDelButton(this)" />';
  htmlValue = htmlValue +   '</div>';
  htmlValue = htmlValue + '</div>';

  /* セルの内容入力 */
  row.id = "MENU_damage_lists_value_row";
  cell1.id = "MENU_damage_lists_value_cell1";
  cell1.innerHTML = htmlValue;

  /* 各行の停止マークボタンを非表示(左スライド)する */
  DAMAGE_lists_stopbtn_display(rowIndex, false);
  
}

/*------------------------------------------------*/
/* 損傷箇所リストの"編集"ボタン                     */
/*------------------------------------------------*/
function DAMAGE_lists_edit(){

  /* 損傷リストと現状窯幅入力が0行の時、表示を"編集"にする。 */
  if ( document.getElementById("MENU_damage_lists_value").rows.length <= 0 &&
       document.getElementById("MENU_damage_kilnwidth_table").rows.length <= 0){
        document.getElementById("MENU_damage_lists_edit").innerHTML = "編集　";
        MASK1_off();
        return;
  }


  /* '編集''完了'ボタン 表示非表示コントロール */
  if ( EditModeCheck() == false ){
    /* '完了モード'から'編集モード'にする時 */

    /* 損傷箇所リストの停止マークボタンを表示する */
    var tblData = document.getElementById("MENU_damage_lists_value");
    for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){
      /* 損傷箇所リスト入力完了を取り込む */
      var DamageEndValue = tblData.rows[ListRow].getAttribute('DAMAGE_INPUT');

      /* 入力中の(完了していない)行を表示する */
      if ( DamageEndValue != 'end' ){
        /* 各行の停止マークボタンを表示(右スライド)する */
        DAMAGE_lists_stopbtn_display(ListRow, true);
      }

    }

    /* 現状窯幅の停止マークボタンを表示する */
    var tblData = document.getElementById("MENU_damage_kilnwidth_table");
    for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

      /* 各行の停止マークボタンを表示(右スライド)する */
      DAMAGE_kilnwidth_stopbtn_display(ListRow, true);

    }

    /* '完了'を表示する */
    document.getElementById("MENU_damage_lists_edit").innerHTML = "完了　";

    MASK1_on();
  }
  else{
    /* '編集モード'から'完了モード'にする時 */

    var tblData = document.getElementById("MENU_damage_lists_value");
    for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

      /* 各行の停止マークボタンを非表示(左スライド)する */
      DAMAGE_lists_stopbtn_display(ListRow, false);

      /* 各行の削除ボタンを非表示(右スライド)する */
      DAMAGE_lists_delbtn_display(ListRow, false);

    }

    var tblData = document.getElementById("MENU_damage_kilnwidth_table");
    for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

      /* 各行の停止マークボタンを非表示(左スライド)する */
      DAMAGE_kilnwidth_stopbtn_display(ListRow, false);

      /* 各行の削除ボタンを非表示(右スライド)する */
      DAMAGE_kilnwidth_delbtn_display(ListRow, false);

    }

    /* 損傷箇所リスト削除ボタン 表示 */
    document.getElementById("MENU_damage_lists_edit").innerHTML = "編集　";

    MASK1_off();
  }

}

/*------------------------------------------------*/
/* 指定行の削除ボタンを表示する */
/*------------------------------------------------*/
function DAMAGE_lists_rowdel_display(obj){
  /* 削除ボタンを押下された行の<tr>タグを取り込む */
  tr = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
  /* trの行Noインデックスを取り込む */
  rowIndex = tr.sectionRowIndex;
  if ( rowIndex == null ){
    rowIndex = tr.parentNode.sectionRowIndex;
  }

  /* 損傷箇所リスト入力完了を取り込む */
  var DamageEndValue = tr.getAttribute('DAMAGE_INPUT');

  /* 入力中の(完了していない)行を表示する */
  if ( DamageEndValue != 'end' ){
    /* 指定行の停止マークボタンを非表示にする */
    DAMAGE_lists_stopbtn_display(rowIndex, false);

    /* 指定行の停止マークボタンを表示にする */
    DAMAGE_lists_delbtn_display(rowIndex, true);
  }

}

/*------------------------------------------------*/
/* 指定行の停止マークボタンを表示・非表示にする       */
/*------------------------------------------------*/
/* rowIndex : 行のインデックス                     */
/* display  : 表示 = true 非表示 = false          */
function DAMAGE_lists_stopbtn_display(rowIndex, display){
  var node = TableTagNodeGet("MENU_damage_lists_value",rowIndex,0,"MENU_DAMAGE_lists_col1","div");
  if ( node.classList.contains("Damage_stop_slidein") == display ){
    node.classList.toggle("Damage_stop_slidein");
  }
}

/*------------------------------------------------*/
/* 指定行の削除ボタンを表示・非表示にする            */
/*------------------------------------------------*/
/* rowIndex : 行のインデックス                     */
/* display  : 表示 = true 非表示 = false          */
function DAMAGE_lists_delbtn_display(rowIndex, display){
  /* 各行の削除ボタン(MENU_DAMAGE_lists_col2)を検索して表示にする */
  var node = TableTagNodeGet("MENU_damage_lists_value",rowIndex,0,"MENU_DAMAGE_lists_col2","div");
  if ( node.classList.contains("Damage_del_slidein") != display ){
    node.classList.toggle("Damage_del_slidein");
  }
}


/*------------------------------------------------*/
/* 損傷リストの"編集"ボタン                         */
/*------------------------------------------------*/
function DAMAGE_lists_delete(){

  /* 削除ボタンが見るからない(0行)の時、表示を"編集"にする。 */
  if ( document.getElementById("MENU_DAMAGE_lists_col2") == null ){
    document.getElementById("MENU_damage_lists_edit").innerHTML = "編集　";
    retun;
  }
  
  /* 各行の削除ボタンを表示、非表示にする */
	var tblData = document.getElementById("MENU_damage_lists_value");
  for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

    /* 各行の削除ボタン(MENU_DAMAGE_lists_col2)を検索して表示、非表示にする */
    var delbtn = TableTagNodeGet("MENU_damage_lists_value",ListRow,0,"MENU_DAMAGE_lists_col2","div");
    delbtn.classList.toggle("Damage_del_slidein");

  }
    
  /* "Damage_del_slidein"のクラスが追加されている(true)とき、削除ボタン表示状態 */
	if ( document.getElementById("MENU_DAMAGE_lists_col2").classList.contains("Damage_del_slidein") == true ){

    /* 損傷箇所リスト削除ボタン 表示 */
    document.getElementById("MENU_damage_lists_edit").innerHTML = "完了　";
  }
  else{
    /* 損傷箇所リスト削除ボタン 非表示 */
    document.getElementById("MENU_damage_lists_edit").innerHTML = "編集　";
  }

}

/*------------------------------------------------*/
/* 損傷箇所リストの行削除ボタンが押されたときの行削除をする */
/*------------------------------------------------*/
function DAMAGE_lists_RowDelButton(obj){
  /* 削除ボタンを押下された行を取得 */
  var tr = obj.parentNode.parentNode.parentNode.parentNode;
  var tblData = tr.parentNode.parentNode;
  var RowIndex = tr.sectionRowIndex;

  /* 損傷箇所リストの損傷種別のノードを取り込む */
  var DamageTypeNode = TableTagNodeGet("MENU_damage_lists_value",RowIndex,0,"MENU_damageType","div");
  /* 損傷箇所リストの損傷箇所のノードを取り込む */
  var DamagePointsNode = TableTagNodeGet("MENU_damage_lists_value",RowIndex,0,"MENU_damagePoints","div");

  var DAMAGE_name = DamageTypeNode.innerText;
  var DAMAGE_Points = DamagePointsNode.innerText;
  DeftypeTileDel( DAMAGE_name, DAMAGE_Points, 'DAMAGE' );

  /* 損傷箇所リストの指定行を削除をする */
  //DAMAGE_lists_DeleteRow(tblData,tr.sectionRowIndex);


}

/*------------------------------------------------*/
/* 損傷箇所リストの指定行を削除をする                */
/*------------------------------------------------*/
/* tblData  : 損傷リストのテーブルタグのノード      */
/* rowIndex : 削除行のインデックス                 */
function DAMAGE_lists_DeleteRow(tblData, rowIndex) {

  /* 指定行を削除する */
  tblData.deleteRow(rowIndex);

  /* 0行の時、処理終了 */
  if ( tblData.rows.length <= 0 ){
    return;
  }

  /* 各行の#番号を付けなおす */
  for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

    /* 各行の番号枠(Damage_listNo)を検索して番号を付けなおす */
    var Damage_listNo_Node = TableTagNodeGet("MENU_damage_lists_value",ListRow,0,"Damage_listNo","div");
    var ListNo = ListRow + 1;
    Damage_listNo_Node.innerHTML = "#" + ListNo;
  }

}

/*------------------------------------------------*/
/* 損傷,炉底損傷種別リストの損傷箇所を削除する      */
/*------------------------------------------------*/
/* Tile_DAMAGE_no : タイルの損傷種別No.             */
/* RengaNo        : 煉瓦No.                        */
/* RodanNo        : 炉段No.                        */
function DamageListValueDel( Tile_DAMAGE_no, RengaNo, RodanNo ) {
  /* タイルの損傷種別No.を損傷種別名称に変換する */
  var Parts = '';
  if ( RodanNo == 0 ){
    Parts = 'ROTEI';
  }
  var Tile_DAMAGE_name = DEFTYPE_No2Name(Tile_DAMAGE_no, 'DAMAGE', Parts);
  
  /* 損傷箇所リストのテーブルタグのノードを取り込む */
  var tblData = document.getElementById("MENU_damage_lists_value");

  /* 損傷箇所リストの行数ループする */
  for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){
    /* 損傷箇所リストの損傷種別のノードを取り込む */
    var DamageTypeNode = TableTagNodeGet("MENU_damage_lists_value",ListRow,0,"MENU_damageType","div");
    /* 損傷箇所リストの損傷箇所のノードを取り込む */
    var DamagePointsNode = TableTagNodeGet("MENU_damage_lists_value",ListRow,0,"MENU_damagePoints","div");

    List_DAMAGE_name = DamageTypeNode.innerText;
    if ( Tile_DAMAGE_name == List_DAMAGE_name ){

      /* 損傷箇所を作成する */
      DamagePoint = RengaNo + "-" + RodanNo;

      DamagePoint = ',' + DamagePoint + ',';
      DamagePoints = ',' + DamagePointsNode.innerText + ',';
   
      /* 指定の損傷箇所が含まれているとき、その損傷箇所を消す */
      if (DamagePoints.indexOf(DamagePoint) != -1){
        /* 損傷箇所を消す */
        DamagePoints = DamagePoints.replace(DamagePoint,',');

        /* 先頭から1文字(,)を削除 */
        var DamagePoints = DamagePoints.slice( 1 );
  
        /* 末尾から1文字(,)を削除 */
        var DamagePoints = DamagePoints.slice( 0, -1 );

        if ( DamagePoints == ""){
          /* 損傷箇所がないとき、リストから行を消す */
          DAMAGE_lists_DeleteRow(tblData,ListRow);
        }
        else{
          /* 損傷箇所を表示 */
          DamagePointsNode.innerText = DamagePoints;
        }

        break;  
      }
    }
  }
}

/*------------------------------------------------*/
/* 損傷,炉底損傷種別リストに対応するタイルを削除する  */
/*------------------------------------------------*/
/* DAMAGE_name    : 損傷種別                       */
/* DAMAGE_points  : 損傷箇所リスト                 */
function DamageTileDel( DAMAGE_name, DAMAGE_points ) {
  var deftype_no = null;
 
  /* 損傷箇所リストを損傷箇所毎に分解する */
  var DamagePointArray = DAMAGE_points.split(",")

  /* 損傷箇所数分ループする */
	for(var loop01=0; loop01<DamagePointArray.length; loop01++){
    /* 煉瓦No.と炉団No.に分解する */
    var RengaRodanArray = DamagePointArray[loop01].split("-")

    /* 煉瓦No. */
    var RengaNo = Number(RengaRodanArray[0]);
    /* 炉団No. */
    var RodanNo = Number(RengaRodanArray[1]);

    /* 損傷種別No.を取り込む */
    if ( loop01 == 0 ){
        if ( RodanNo != 0){
          /* 損傷種別の名称をNo.に変換する　*/
          deftype_no = DEFTYPE_Name2No(DAMAGE_name, "DAMAGE", "");
        }
        else{
          /* 炉底損傷種別の名称をNo.に変換する　*/
          deftype_no = DEFTYPE_Name2No(DAMAGE_name, "DAMAGE", "ROTEI");
        }
    }

    /* 対象箇所のタイルを全部削除する */
    var x = RengaNo;
    var y = WALL_Yreso - RodanNo;
    ZOOMER_delOne(x, y, deftype_no);

  }

}

/*------------------------------------------------*/
/* テーブル中の指定セル(行列)の中にある指定タグIDのノードを返す */
/*------------------------------------------------*/
/* tblidname : テーブルID                          */
/* rowno     : 行位置                              */
/* colno     : 列位置                              */
/* dividname : テーブルセル中タグのID               */
/* tag       : 対象タグ                            */
/* 返り値     : DIVタグのノード                     */
/*             見つからない時、nullを返す           */
/*  ※損傷リストのテーブル中のDIVタグのIDは行ごとでは */
/*    ユニークだが各行では同じIDになっている。        */
/*    そのため、行を指定して対象DIVタグのノードを     */
/*    取り込む関数を作成。                          */
/*    IDがユニークならdocument.getElementByIdでOK!! */
function TableTagNodeGet(tblidname,rowno,colno,dividname,tag) {
  /* 指定テーブルのIDのノードを取得する */
  var tblData = document.getElementById(tblidname);

  /* 指定行のノードを取得する */
  var row = tblData.children[0].children[rowno];

  /* 指定列からDIVタグのノードを取り込む */
  var cellx = row.cells[colno].getElementsByTagName(tag);

  /* 取り込んだDIVタグ数分繰り返し、指定ID(dividname)を検索する */
  var retnode= null;  
  for(var i=0; i<cellx.length; i++){
    if ( cellx[i].id == dividname){
      retnode = cellx[i];
      break;
    }
  }

  return retnode;
}
