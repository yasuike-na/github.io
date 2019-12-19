//20191217155150
/*********************************************************************/
/* 現状窯幅入力画面                                                   */
/*********************************************************************/

/* 現状窯幅入力画面 入力情報格納構造体 */
function DAMAGE_kilnwidth_VALUE(){
	this.furyu = "";
	this.dansu = "";
	this.sokutei = "";
	this.csps = "";
	this.row_add_flg = false;
	this.rowIndex = -1;
  }

/* 現状窯幅入力画面 入力情報格納構造体 */
var DAMAGE_kilnwidth_VAL = new DAMAGE_kilnwidth_VALUE();

/*------------------------------------------*/
/* 現状窯幅入力画面 表示、非表示処理        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン           */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function DAMAGE_kilnwidth_toggle( btnkbn, obj ) {

	/* メニューから要求の時 */
	if ( btnkbn == 0 ){

		/* 編集モードの時、表示しない */
		if ( EditModeCheck() == true ){

			/* 削除ボタンが表示されている時、削除ボタンを非表示にして停止マークを表示する */
			/* 選択行を取り込む */
			var tr = obj.parentNode.parentNode.parentNode.parentNode;
			var rowIndex = tr.rowIndex;

			/* 停止マークボタンが表示されていない時 */
			var node = TableTagNodeGet("MENU_damage_kilnwidth_table",rowIndex,0,"MENU_damage_kilnwidth_col1","div");
			if ( node.classList.contains("DAMAGE_kilnwidth_stop_slidein") == true ){		
				/* 選択行の停止マークボタンを表示(右スライド)する */
				DAMAGE_kilnwidth_stopbtn_display(rowIndex, true);
				/* 選択行の削除ボタンを非表示(右スライド)する */
				DAMAGE_kilnwidth_delbtn_display(rowIndex, false);
			}
			
			return;
		}

		/* 現状窯幅入力画面を表示する */
		DAMAGE_kilnwidth_display( obj );
	}
	/* 完了ボタンまたはキャンセルボタンからの要求の時 */
	else{
		/* 現状窯幅入力画面を非表示(隠す)にする */
		DAMAGE_kilnwidth_Hidden( btnkbn, obj );			
	}

};



/*------------------------------------------*/
/* 現状窯幅入力画面を表示する                 */
/*------------------------------------------*/
function DAMAGE_kilnwidth_display( obj ) {

	/* 現状窯幅入力画面が表示されていない(classが含まれていない)時、画面を表示する */
	if ( document.getElementById("PAGE_damage_kilnwidth").classList.contains("DAMAGE_kilnwidth_slidein") == false ){

		/*メインメニューからの表示 */

		/* 行追加かを判定する */
		DAMAGE_kilnwidth_VAL.row_add_flg = false;
		if ( obj.id == "MENU_damage_kilnwidth_add" ){
			/* 行追加の時 */

			DAMAGE_kilnwidth_VAL.row_add_flg = true;
			/* 選択された行位置を初期化する */
			DAMAGE_kilnwidth_VAL.rowIndex = -1;

			DAMAGE_kilnwidth_VAL.furyu = "";
			DAMAGE_kilnwidth_VAL.dansu = "";
			DAMAGE_kilnwidth_VAL.sokutei = "";
			DAMAGE_kilnwidth_VAL.csps = "";

		}
		else{
			/* 対象行のノードを取得する */
			tr = obj.parentNode.parentNode.parentNode.parentNode;
			//window.confirm('【コークス管理】\nフリューが入力されていません');

			/* 選択された行位置を取り込む */
			DAMAGE_kilnwidth_VAL.rowIndex = tr.rowIndex;
			//alert(tr.id);
			//alert(tr.rowIndex);
			
			/* 現状窯幅入力画面を表示する */
			/* フリューをセ取り込む */
			DAMAGE_kilnwidth_VAL.furyu = tr.getAttribute('FURYU');
			if ( DAMAGE_kilnwidth_VAL.furyu == null ){
				DAMAGE_kilnwidth_VAL.furyu = "";
			}

			/* 段数を取り込む */
			DAMAGE_kilnwidth_VAL.dansu = tr.getAttribute('DANSU');
			if ( DAMAGE_kilnwidth_VAL.dansu == null ){
				DAMAGE_kilnwidth_VAL.dansu = "";
			}

			/* 測定値を取り込む */
			DAMAGE_kilnwidth_VAL.sokutei = tr.getAttribute('SOKUTEI');
			if ( DAMAGE_kilnwidth_VAL.sokutei == null ){
				DAMAGE_kilnwidth_VAL.sokutei = "";
			}

			/* 測定値を取り込む */
			DAMAGE_kilnwidth_VAL.csps = tr.getAttribute('CSPS');
			if ( DAMAGE_kilnwidth_VAL.csps == null ){
				DAMAGE_kilnwidth_VAL.csps = "";
			}

		}

		document.getElementById("DAMAGE_kilnwidth_furyu_in").value = DAMAGE_kilnwidth_VAL.furyu;
		document.getElementById("DAMAGE_kilnwidth_dansu_in").value = DAMAGE_kilnwidth_VAL.dansu;
		document.getElementById("DAMAGE_kilnwidth_sokutei_in").value = DAMAGE_kilnwidth_VAL.sokutei;
		ChangeDamageCsPsColor(DAMAGE_kilnwidth_VAL.csps);
		DAMAGE_kilnwidth_VAL.csps = SelectDamageCsPsGet();

		/* 検査箇所をタイトルに表示する */
		var place_value = PlaceValueGet();

		var DAMAGE_kilnwidth_No = 0;
		if ( DAMAGE_kilnwidth_VAL.row_add_flg == true ){
			/* 行数取得 */
			var RowCount = document.getElementById('MENU_damage_kilnwidth_table').rows.length;
			DAMAGE_kilnwidth_No = RowCount + 1;
		}
		else{
			DAMAGE_kilnwidth_No = DAMAGE_kilnwidth_VAL.rowIndex + 1;
		}
		document.getElementById("DAMAGE_kilnwidth_title").innerHTML = '<b>' + place_value + ' #' + DAMAGE_kilnwidth_No + '</b>';

		/* 現状窯幅入力画面("PAGE_damage_kilnwidth")を表示する */
		document.getElementById("PAGE_damage_kilnwidth").classList.toggle("DAMAGE_kilnwidth_slidein");

	}

}

/*------------------------------------------*/
/* 現状窯幅入力画面を非表示(隠す)にする        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン           */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function DAMAGE_kilnwidth_Hidden( btnkbn, obj ) {

	/* 現状窯幅入力画面が表示されている(classが含いる)時、画面を非表示に(隠す)する */
	if ( document.getElementById("PAGE_damage_kilnwidth").classList.contains("DAMAGE_kilnwidth_slidein") == true ){

		/* 完了ボタンを押したとき */
		if ( btnkbn == 1 ){

			/* 入力チェック */
			/* フリュー */
			DAMAGE_kilnwidth_VAL.furyu = document.getElementById("DAMAGE_kilnwidth_furyu_in").value;
			/* 段数 */
			DAMAGE_kilnwidth_VAL.dansu = document.getElementById("DAMAGE_kilnwidth_dansu_in").value;
			/* 測定値 */
			DAMAGE_kilnwidth_VAL.sokutei = document.getElementById("DAMAGE_kilnwidth_sokutei_in").value;
			/* CS、PS選択 */
			DAMAGE_kilnwidth_VAL.csps = SelectDamageCsPsGet();

			if ( DAMAGE_kilnwidth_VAL.furyu == "" ){
				window.alert('【コークス炉管理】\n"フリュー"を入力してください。');
				return;
			}
			else if ( DAMAGE_kilnwidth_VAL.dansu == "" ){			
				window.alert('【コークス炉管理】\n"段数"を入力してください。');
				return;
			}
			else if ( DAMAGE_kilnwidth_VAL.sokutei == "" ){				
				window.alert('【コークス炉管理】\n"測定値"を入力してください。');
				return;
			}

			/* 入力情報を反映させる */
			/* フリュー */
			DAMAGE_kilnwidth_VAL.furyu = document.getElementById("DAMAGE_kilnwidth_furyu_in").value;
			/* 段数 */
			DAMAGE_kilnwidth_VAL.dansu = document.getElementById("DAMAGE_kilnwidth_dansu_in").value;
			/* 測定値 */
			DAMAGE_kilnwidth_VAL.sokutei = document.getElementById("DAMAGE_kilnwidth_sokutei_in").value;
			/* CS、PS選択 */
			DAMAGE_kilnwidth_VAL.csps = SelectDamageCsPsGet();

			/* 現状窯幅の行を追加する */
			var RowAddindex = 0;
			var tr;
			if ( DAMAGE_kilnwidth_VAL.row_add_flg == true ){
				tr = DamageKilnwidthRowAdd('MENU_damage_kilnwidth_table');

				/* 行数取得 */
				var RowCount = document.getElementById('MENU_damage_kilnwidth_table').rows.length;
				RowAddindex = RowCount -1;
			}
			else{
				/* 追加行でないときは、選択された行を対象とする */
				RowAddindex = DAMAGE_kilnwidth_VAL.rowIndex;

				/* 指定行のノードを取得する */
				var tblData = document.getElementById('MENU_damage_kilnwidth_table');
				/* tr = tblData.children[0].children[RowAddindex]; */
				tr = tblData.rows[RowAddindex];
 
			}

			var DamageKilnwidthNode = TableTagNodeGet("MENU_damage_kilnwidth_table",RowAddindex,0,"MENU_damage_kilnwidth_value","div");
			if ( DamageKilnwidthNode != null ){

				/* 対象行に値をセットする属性を付加 */
				/* tr = DamageKilnwidthNode.parentNode.parentNode.parentNode; */
				/* フリューをセットする */
				tr.setAttribute('FURYU',DAMAGE_kilnwidth_VAL.furyu);
				/* 段数をセットする */
				tr.setAttribute('DANSU',DAMAGE_kilnwidth_VAL.dansu);
				/* 測定値をセットする */
				tr.setAttribute('SOKUTEI',DAMAGE_kilnwidth_VAL.sokutei);
				/* CS、PS選択をセットする */
				tr.setAttribute('CSPS',DAMAGE_kilnwidth_VAL.csps);

				var htmlValue = "";
				htmlValue = htmlValue + 'フリュー : ' + DAMAGE_kilnwidth_VAL.furyu + ' ';
				htmlValue = htmlValue + '段数 : ' + DAMAGE_kilnwidth_VAL.dansu + ' ';
				htmlValue = htmlValue + '測定値 : ' + DAMAGE_kilnwidth_VAL.sokutei + ' ';
/*				htmlValue = htmlValue + '[' + DAMAGE_kilnwidth_VAL.csps + ']'; */

				/* 指定文字数以上の時、以降を省略( …)する。文字列の改行以降も省略( …)する */
				htmlValue = StrTextOmit(htmlValue, 26);

				DamageKilnwidthNode.innerHTML = htmlValue;
			}

		}

		/* 現状窯幅入力画面"PAGE_damage_kilnwidth"を非表示(隠す)する */
		document.getElementById("PAGE_damage_kilnwidth").classList.toggle("DAMAGE_kilnwidth_slidein");

	}
	
}


/*------------------------------------------------*/
/* 現状窯幅の行を追加する                         */
/*------------------------------------------------*/
function DamageKilnwidthRowAdd( id ){
	/* テーブル取得 */
	var table = document.getElementById(id);

	/* 行数取得 */
	var RowNo = table.rows.length;
	var RowNoindex = RowNo -1;

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

	var htmlValue = "";
	htmlValue = htmlValue + '<div id="MENU_damage_kilnwidth">';
	htmlValue = htmlValue +   '<div id="MENU_damage_kilnwidth_col1">';

	htmlValue = htmlValue +       '<div id="DAMAGE_kilnwidth_edit">';
//	htmlValue = htmlValue +         '<input type="image" src="stop.png" id="DAMAGE_kilnwidth_edit_icon" onclick="Damage_Kilnwidth_rowdel_display(this)">';  
	htmlValue = htmlValue +       '<button type="button" id="DAMAGE_kilnwidth_edit_icon" value="" onclick="Damage_Kilnwidth_rowdel_display(this)">';
	htmlValue = htmlValue +         '<img id="DAMAGE_kilnwidth_edit_png" src="stop.png" onclick="Damage_Kilnwidth_rowdel_display(this)">';
	htmlValue = htmlValue +       '</button>';
	htmlValue = htmlValue +       '</div>';
	htmlValue = htmlValue +       '<div id="MENU_damage_kilnwidth_value"></div>';

	htmlValue = htmlValue +   '</div>';

	htmlValue = htmlValue +   '<div id="MENU_damage_kilnwidth_col2">';
	htmlValue = htmlValue +     '<input id="DAMAGE_kilnwidth_value_del" type="button" value="削除" onclick="DAMAGE_kilnwidth_DeleteRow(this)" />';
	htmlValue = htmlValue +   '</div>';
	htmlValue = htmlValue + '</div>';

	/*	htmlValue = htmlValue + '<div id="MENU_damage_kilnwidth_table_value">'; *
	/*	htmlValue = htmlValue + '</div>'; */

	/* セルの内容入力 */
	row.id = "MENU_damage_kilnwidth_table_row";
	cell1.id = "MENU_damage_kilnwidth_table_cell1";
	cell1.innerHTML = htmlValue;

	/* 指定行の停止マークボタンを表示・非表示にする */
	DAMAGE_kilnwidth_stopbtn_display(rowIndex, false);

	/* 対象行に値をセットする属性を付加 */
	/* フリューをセットする */
	row.setAttribute('FURYU','');
	/* 段数をセットする */
	row.setAttribute('DANSU','');
	/* 測定値をセットする */
	row.setAttribute('SOKUTEI','');
	/* CS、PS選択をセットする */
	row.setAttribute('CSPS','');

	return(row);

}

/*------------------------------------------------*/
/* 指定行の削除ボタンを表示する */
/*------------------------------------------------*/
function Damage_Kilnwidth_rowdel_display(obj){
	/* 削除ボタンを押下された行の<tr>タグを取り込む */
	tr = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
	/* trの行Noインデックスを取り込む */
	rowIndex = tr.sectionRowIndex;
	if ( rowIndex == null ){
		rowIndex = tr.parentNode.sectionRowIndex;
	}

	/* 指定行の停止マークボタンを非表示にする */
	DAMAGE_kilnwidth_stopbtn_display(rowIndex, false);
  
	/* 指定行の停止マークボタンを表示にする */
	DAMAGE_kilnwidth_delbtn_display(rowIndex, true);
  
  }
  
/*------------------------------------------*/
/* CS、PS選択 色替え表示処理                 */
/*------------------------------------------*/
/* csps_p : 'CS'、'PS'                      */
function ChangeDamageCsPsColor( csps_p ){

	/* 表示色クリア */
	document.getElementById( "DAMAGE_kilnwidth_cs" ).style.color = 'blue';
	document.getElementById( "DAMAGE_kilnwidth_ps" ).style.color = 'blue';

	document.getElementById( "DAMAGE_kilnwidth_cs" ).style.backgroundColor = 'white';
	document.getElementById( "DAMAGE_kilnwidth_ps" ).style.backgroundColor = 'white';

	var id = "";
	switch (csps_p) {
		case "cs":
			id = "DAMAGE_kilnwidth_cs";
			break;
		case "ps":
			id = "DAMAGE_kilnwidth_ps";
			break;
		default:
			id = "DAMAGE_kilnwidth_cs";
			break;
	}

	/* 選択箇所色替え表示 */
	document.getElementById( id ).style.backgroundColor = 'blue';
	document.getElementById( id ).style.color = 'white';
}

/*------------------------------------------*/
/* 選択されているCS、PSを取り込む              */
/*------------------------------------------*/
function SelectDamageCsPsGet( ){
	var DAMAGE_kilnwidth_cs_color = document.getElementById( "DAMAGE_kilnwidth_cs" ).style.backgroundColor;
	var DAMAGE_kilnwidth_ps_color = document.getElementById( "DAMAGE_kilnwidth_ps" ).style.backgroundColor;

	var csps_ret = 'cs';
	if ( DAMAGE_kilnwidth_cs_color == 'blue' ){
		csps_ret = 'cs';
	}
	else if ( DAMAGE_kilnwidth_ps_color == 'blue' ){
		csps_ret = 'ps';
	}
	else{
		csps_ret = 'cs';
	}

	return( csps_ret );
}

/*------------------------------------------------*/
/* 指定行の停止マークボタンを表示・非表示にする */
/*------------------------------------------------*/
function DAMAGE_kilnwidth_stopbtn_display(rowIndex, display){
	var node = TableTagNodeGet("MENU_damage_kilnwidth_table",rowIndex,0,"MENU_damage_kilnwidth_col1","div");
	if ( node.classList.contains("DAMAGE_kilnwidth_stop_slidein") == display ){
	  node.classList.toggle("DAMAGE_kilnwidth_stop_slidein");
	}
  }
  
/*------------------------------------------------*/
/* 指定行の停止マークボタンを表示・非表示にする */
/*------------------------------------------------*/
function DAMAGE_kilnwidth_delbtn_display(rowIndex, display){
/* 各行の削除ボタン(MENU_DAMAGE_lists_col2)を検索して表示にする */
var node = TableTagNodeGet("MENU_damage_kilnwidth_table",rowIndex,0,"MENU_damage_kilnwidth_col2","div");
if ( node.classList.contains("DAMAGE_kilnwidth_del_slidein") != display ){
	node.classList.toggle("DAMAGE_kilnwidth_del_slidein");
}
}

/*------------------------------------------------*/
/* 現状窯幅入力の行削除をする                     */
/*------------------------------------------------*/
function DAMAGE_kilnwidth_DeleteRow(obj) {
	// 削除ボタンを押下された行を取得
	var tr = obj.parentNode.parentNode.parentNode.parentNode;
	var tbl = tr.parentNode.parentNode;
	// trのインデックスを取得して行を削除する
	tr.parentNode.deleteRow(tr.sectionRowIndex);
  
  /* 0行の時、処理終了 */
  if ( tbl.rows.length <= 0 ){
	  /* 現状窯幅入力削除ボタン 非表示 */
/*	  document.getElementById("MENU_damage_lists_edit").innerHTML = "編集"; */
	  return;
	}
    
  }
