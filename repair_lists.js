//20191217155150
/*********************************************************************/
/* 補修箇所リスト画面                                                   */
/*********************************************************************/

/*------------------------------------------------*/
/* 補修箇所リストにデータを表示する                  */
/*------------------------------------------------*/
function RepairListValueAdd( RengaNo, RodanNo ){
  var tblData = document.getElementById("MENU_repair_lists_value");

  /* 行数を取り込む */
  ListRows = tblData.rows.length;
  /* 最終行を取り込む */
  ListLastRow = ListRows - 1;

  var SelectRepairType = null;
  var SelectRepairNo = null;
  var Repaircolor = null;
  /* 0段の時は、炉底 以外の時は炉壁 */
  if ( RodanNo != 0 ){
    /* 炉壁の時 */

    /* 画面下帯の補修種別を取り込む */
    [SelectRepairType,SelectRepairNo] = Select_DeftypeNameGet('REPAIR','');
    /* 画面下帯の炉底補修種別の色を取り込む */
    Repaircolor = DEFTYPE_obj.style.color;
  }
  else{
    /* 炉底の時 */

    /* 画面下帯の炉底補修種別を取り込む */
    SelectRepairType = document.getElementById("DEFTYPE_ROTEI").innerText;
    /* 画面下帯の炉底補修種別の色を取り込む */
    Repaircolor = DEFTYPE_ROTEI_obj.style.color;
  }
  
  /* 補修箇所リスト中の補修種別を取り込む */
  var ListRepairType = "";
  if ( 0 < ListRows ){
    var ListRepairTypeNode = TableTagNodeGet("MENU_repair_lists_value",ListLastRow,0,"MENU_repairType","div");
    if ( ListRepairTypeNode != null){

      /* 補修箇所リストから補修種別を取り込む */
      var ListRepairType = ListRepairTypeNode.innerHTML;
    }
  }

  /* 行を追加するかを判定する */
  /* 選択とリストの補修種別が違うとき、行追加 */
  var ListRowAdd = false;
  if ( SelectRepairType != ListRepairType ){
    ListRowAdd = true;
  }


  /* 行追加の時 */
  if ( ListRowAdd == true ){
    /* 補修リストの行を追加する */
    RepairListRowAdd('MENU_repair_lists_value');

    /* 行追加後、行数を取り直し最終行を取り込む */
    /* 行数を取り込む */
    ListRows = tblData.rows.length;
    /* 最終行を取り込む */
    ListLastRow = ListRows - 1;

    /* 補修リスト中の補修種別を表示する */
    var RepairTypeNode = TableTagNodeGet("MENU_repair_lists_value",ListLastRow,0,"MENU_repairType","div");
    if ( RepairTypeNode != null){
      RepairTypeNode.style.color = Repaircolor;
      RepairTypeNode.innerHTML = SelectRepairType;
    }
  }

  /* 行数を取り込む */
  ListRows = tblData.rows.length;
  /* 最終行を取り込む */
  ListLastRow = ListRows - 1;

  /* 補修箇所を編集する */
  RepairPoint = RengaNo + "-" + RodanNo;
  var ListRepairPointNode = TableTagNodeGet("MENU_repair_lists_value",ListLastRow,0,"MENU_repairPoints","div");

  if ( ListRepairPointNode != null){

    /* 表示している補修箇所を取り込む */
    var RepairPoints = ListRepairPointNode.innerHTML;
    var RepairPoints_ = ',' + RepairPoints + ',';

    /* 同じ箇所がすでにある時は、追加しない。 */
    if (RepairPoints_.indexOf(',' + RepairPoint + ',') != -1) {
      return;
    }

    /* ,(カンマ)を追加する */
    if ( RepairPoints != "" ){
      RepairPoint = "," + RepairPoint;
    }
  
    /* 補修箇所を追加する */
    RepairPoints = RepairPoints + RepairPoint;

    /* 補修箇所を表示する */
    ListRepairPointNode.innerHTML = RepairPoints;
  }

}

/*------------------------------------------------*/
/* 補修リストの行を追加する                         */
/*------------------------------------------------*/
/* id : 行追加のテーブルID                         */
function RepairListRowAdd( id ){
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
/*  var htmlValue= '<input id="REPAIR_lists_value_del" type="button" value="削除" onclick="REPAIR_lists_RowDelButton(this)" />'; */
/* 補修箇所リスト HTML */
  var htmlValue = "";
  htmlValue = htmlValue + '<div id="MENU_REPAIR_lists_table">';
  htmlValue = htmlValue +   '<div id="MENU_REPAIR_lists_col1">';
  htmlValue = htmlValue +     '<div id="MENU_REPAIR_lists_col1-1">';
  //htmlValue = htmlValue +       '<input type="image" src="stop.png" id="REPAIR_lists_edit_icon" onclick="REPAIR_lists_rowdel_display(this)">';
  htmlValue = htmlValue +       '<button type="button" id="REPAIR_lists_edit_icon" value="" onclick="REPAIR_lists_rowdel_display(this)">';
  htmlValue = htmlValue +         '<img id="REPAIR_lists_edit_png" src="stop.png" onclick="REPAIR_lists_rowdel_display(this)">';
  htmlValue = htmlValue +       '</button>';
  htmlValue = htmlValue +     '</div>';
  
  htmlValue = htmlValue +     '<div id="MENU_REPAIR_lists_col1-2">';
  htmlValue = htmlValue +       '<div id=Repair_listNo>#' + RowNo + '</div>';
  htmlValue = htmlValue +     '</div>';

  htmlValue = htmlValue +     '<div id="MENU_REPAIR_lists_col1-3">';
  htmlValue = htmlValue +       '<div id="MENU_repairType"></div>';
  htmlValue = htmlValue +       '<div id="MENU_repairPoints"></div>';
  htmlValue = htmlValue +     '</div>';
  
  htmlValue = htmlValue +   '</div>';
  
  htmlValue = htmlValue +   '<div id="MENU_REPAIR_lists_col2">';
  htmlValue = htmlValue +     '<input id="REPAIR_lists_value_del" type="button" value="削除" onclick="REPAIR_lists_RowDelButton(this)" />';
  htmlValue = htmlValue +   '</div>';
  htmlValue = htmlValue + '</div>';

  /* セルの内容入力 */
  row.id = "MENU_repair_lists_value_row";
  cell1.id = "MENU_repair_lists_value_cell1";
  cell1.innerHTML = htmlValue;

  /* 各行の停止マークボタンを非表示(左スライド)する */
  REPAIR_lists_stopbtn_display(rowIndex, false);
  
}

/*------------------------------------------------*/
/* 補修箇所リストの"編集"ボタン                         */
/*------------------------------------------------*/
function REPAIR_lists_edit(){

  /* 補修リストと現状窯幅入力が0行の時、表示を"編集"にする。 */
  if ( document.getElementById("MENU_repair_lists_value").rows.length <= 0 &&
       document.getElementById("MENU_repair_kilnwidth_table").rows.length <= 0){
        document.getElementById("MENU_damage_lists_edit").innerHTML = "編集　";
        MASK1_off();
        return;
  }


  /* '編集''完了'ボタン 表示非表示コントロール */
  if ( EditModeCheck() == false ){
    /* '完了モード'から'編集モード'にする時 */

    /* 補修箇所リストの停止マークボタンを表示する */
    var tblData = document.getElementById("MENU_repair_lists_value");
    for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){
      /* 補修箇所リスト入力完了を取り込む */
      var RepairEndValue = tblData.rows[ListRow].getAttribute('DAMAGE_INPUT');

      /* 入力中の(完了していない)行を表示する */
      if ( RepairEndValue != 'end' ){
        /* 各行の停止マークボタンを表示(右スライド)する */
        REPAIR_lists_stopbtn_display(ListRow, true);
      }

    }

    /* 現状窯幅の停止マークボタンを表示する */
    var tblData = document.getElementById("MENU_repair_kilnwidth_table");
    for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

      /* 各行の停止マークボタンを表示(右スライド)する */
      REPAIR_kilnwidth_stopbtn_display(ListRow, true);

    }

    /* '完了'を表示する */
    document.getElementById("MENU_damage_lists_edit").innerHTML = "完了　";

    MASK1_on();
  }
  else{
    /* '編集モード'から'完了モード'にする時 */

    var tblData = document.getElementById("MENU_repair_lists_value");
    for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

      /* 各行の停止マークボタンを非表示(左スライド)する */
      REPAIR_lists_stopbtn_display(ListRow, false);

      /* 各行の削除ボタンを非表示(右スライド)する */
      REPAIR_lists_delbtn_display(ListRow, false);

    }

    var tblData = document.getElementById("MENU_repair_kilnwidth_table");
    for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

      /* 各行の停止マークボタンを非表示(左スライド)する */
      REPAIR_kilnwidth_stopbtn_display(ListRow, false);

      /* 各行の削除ボタンを非表示(右スライド)する */
      REPAIR_kilnwidth_delbtn_display(ListRow, false);

    }

    /* 補修箇所リスト削除ボタン 表示 */
    document.getElementById("MENU_damage_lists_edit").innerHTML = "編集　";

    MASK1_off();
  }

}

/*------------------------------------------------*/
/* 指定行の削除ボタンを表示する */
/*------------------------------------------------*/
function REPAIR_lists_rowdel_display(obj){
  /* 削除ボタンを押下された行の<tr>タグを取り込む */
  tr = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
  /* trの行Noインデックスを取り込む */
  rowIndex = tr.sectionRowIndex;
  if ( rowIndex == null ){
    rowIndex = tr.parentNode.sectionRowIndex;
  }

  /* 補修箇所リスト入力完了を取り込む */
  var RepairEndValue = tr.getAttribute('DAMAGE_INPUT');

  /* 入力中の(完了していない)行を表示する */
  if ( RepairEndValue != 'end' ){
    /* 指定行の停止マークボタンを非表示にする */
    REPAIR_lists_stopbtn_display(rowIndex, false);

    /* 指定行の停止マークボタンを表示にする */
    REPAIR_lists_delbtn_display(rowIndex, true);
  }


}

/*------------------------------------------------*/
/* 指定行の停止マークボタンを表示・非表示にする       */
/*------------------------------------------------*/
/* rowIndex : 行のインデックス                     */
/* display  : 表示 = true 非表示 = false          */
function REPAIR_lists_stopbtn_display(rowIndex, display){
  var node = TableTagNodeGet("MENU_repair_lists_value",rowIndex,0,"MENU_REPAIR_lists_col1","div");
  if ( node.classList.contains("Repair_stop_slidein") == display ){
    node.classList.toggle("Repair_stop_slidein");
  }
}

/*------------------------------------------------*/
/* 指定行の削除ボタンを表示・非表示にする            */
/*------------------------------------------------*/
/* rowIndex : 行のインデックス                     */
/* display  : 表示 = true 非表示 = false          */
function REPAIR_lists_delbtn_display(rowIndex, display){
  /* 各行の削除ボタン(MENU_REPAIR_lists_col2)を検索して表示にする */
  var node = TableTagNodeGet("MENU_repair_lists_value",rowIndex,0,"MENU_REPAIR_lists_col2","div");
  if ( node.classList.contains("Repair_del_slidein") != display ){
    node.classList.toggle("Repair_del_slidein");
  }
}


/*------------------------------------------------*/
/* 補修リストの"編集"ボタン                         */
/*------------------------------------------------*/
function REPAIR_lists_delete(){

  /* 削除ボタンが見るからない(0行)の時、表示を"編集"にする。 */
  if ( document.getElementById("MENU_REPAIR_lists_col2") == null ){
    document.getElementById("MENU_damage_lists_edit").innerHTML = "編集　";
    retun;
  }
  
  /* 各行の削除ボタンを表示、非表示にする */
	var tblData = document.getElementById("MENU_repair_lists_value");
  for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

    /* 各行の削除ボタン(MENU_REPAIR_lists_col2)を検索して表示、非表示にする */
    var delbtn = TableTagNodeGet("MENU_repair_lists_value",ListRow,0,"MENU_REPAIR_lists_col2","div");
    delbtn.classList.toggle("Repair_del_slidein");

  }
    
  /* "Repair_del_slidein"のクラスが追加されている(true)とき、削除ボタン表示状態 */
	if ( document.getElementById("MENU_REPAIR_lists_col2").classList.contains("Repair_del_slidein") == true ){

    /* 補修箇所リスト削除ボタン 表示 */
    document.getElementById("MENU_damage_lists_edit").innerHTML = "完了　";
  }
  else{
    /* 補修箇所リスト削除ボタン 非表示 */
    document.getElementById("MENU_damage_lists_edit").innerHTML = "編集　";
  }

}

/*------------------------------------------------*/
/* 補修箇所リストの行削除ボタンが押されたときの行削除をする */
/*------------------------------------------------*/
function REPAIR_lists_RowDelButton(obj){
  /* 削除ボタンを押下された行を取得 */
  var tr = obj.parentNode.parentNode.parentNode.parentNode;
  var tblData = tr.parentNode.parentNode;
  var RowIndex = tr.sectionRowIndex;

  /* 補修箇所リストの補修種別のノードを取り込む */
  var RepairTypeNode = TableTagNodeGet("MENU_repair_lists_value",RowIndex,0,"MENU_repairType","div");
  /* 補修箇所リストの補修箇所のノードを取り込む */
  var RepairPointsNode = TableTagNodeGet("MENU_repair_lists_value",RowIndex,0,"MENU_repairPoints","div");

  var REPAIR_name = RepairTypeNode.innerText;
  var REPAIR_Points = RepairPointsNode.innerText;
  DeftypeTileDel( REPAIR_name, REPAIR_Points, 'REPAIR' );

  /* 補修箇所リストの指定行を削除をする */
  /* REPAIR_lists_DeleteRow(tblData,tr.sectionRowIndex); */
}

/*------------------------------------------------*/
/* 補修箇所リストの指定行を削除をする                */
/*------------------------------------------------*/
/* tblData  : 補修リストのテーブルタグのノード      */
/* rowIndex : 削除行のインデックス                 */
function REPAIR_lists_DeleteRow(tblData, rowIndex) {

  /* 指定行を削除する */
  tblData.deleteRow(rowIndex);

  /* 0行の時、処理終了 */
  if ( tblData.rows.length <= 0 ){
    return;
  }

  /* 各行の#番号を付けなおす */
  for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){

    /* 各行の番号枠(Repair_listNo)を検索して番号を付けなおす */
    var Repair_listNo_Node = TableTagNodeGet("MENU_repair_lists_value",ListRow,0,"Repair_listNo","div");
    var ListNo = ListRow + 1;
    Repair_listNo_Node.innerHTML = "#" + ListNo;
  }

}

/*------------------------------------------------*/
/* 補修,炉底補修種別リストの補修箇所にを削除する      */
/*------------------------------------------------*/
/* Tile_DAMAGE_no : タイルの補修No.                */
/* RengaNo        : 煉瓦No.                        */
/* RodanNo        : 炉段No.                        */
/* Parts          : 炉壁=''、炉底='ROTEI'          */
function RepairListValueDel( Tile_REPAIR_no, RengaNo, RodanNo ) {
  /* タイルの補修種別No.を補修種別名称に変換する */
  var Parts = '';
  if ( RodanNo == 0 ){
    Parts = 'ROTEI';
  }
  var Tile_REPAIR_name = DEFTYPE_No2Name(Tile_REPAIR_no, 'REPAIR', Parts);

  /* 補修箇所リストのテーブルタグのノードを取り込む */
  var tblData = document.getElementById("MENU_repair_lists_value");

  /* 補修箇所リストの行数ループする */
  for(var ListRow=0; ListRow<tblData.rows.length; ListRow++){
    /* 補修箇所リストの補修種別のノードを取り込む */
    var RepairTypeNode = TableTagNodeGet("MENU_repair_lists_value",ListRow,0,"MENU_repairType","div");
    /* 補修箇所リストの補修箇所のノードを取り込む */
    var RepairPointsNode = TableTagNodeGet("MENU_repair_lists_value",ListRow,0,"MENU_repairPoints","div");

    List_REPAIR_name = RepairTypeNode.innerText;
    if ( Tile_REPAIR_name == List_REPAIR_name ){

      /* 補修箇所を作成する */
      RepairPoint = RengaNo + "-" + RodanNo;

      RepairPoint = ',' + RepairPoint + ',';
      RepairPoints = ',' + RepairPointsNode.innerText + ',';
   
      /* 指定の補修箇所が含まれているとき、その補修箇所を消す */
      if (RepairPoints.indexOf(RepairPoint) != -1){
         /* 補修箇所を消す */
         RepairPoints = RepairPoints.replace(RepairPoint,',');

        /* 先頭から1文字(,)を削除 */
        var RepairPoints = RepairPoints.slice( 1 );
  
        /* 末尾から1文字(,)を削除 */
        var RepairPoints = RepairPoints.slice( 0, -1 );

        if ( RepairPoints == ""){
          /* 補修箇所がないとき、リストから行を消す */
          REPAIR_lists_DeleteRow(tblData,ListRow);
        }
        else{
          /* 補修箇所を表示 */
          RepairPointsNode.innerText = RepairPoints;
        }
        
        break;  
      }
    }
  }
}

