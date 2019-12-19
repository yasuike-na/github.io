//20191217155150
/*********************************************************************/
/* 補修箇所リスト完了入力画面                                        */
/*********************************************************************/

/* 補修箇所リスト完了入力画面 入力情報格納構造体 */
function END_INPUT_VALUE(){
	this.rowIndex = -1;
}
/* 補修箇所リスト完了入力画面 入力情報格納構造体 */
var END_INPUT_VAL = new END_INPUT_VALUE();

/*------------------------------------------*/
/* 補修箇所リスト完了入力画面 表示、非表示処理        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン          */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function REPAIR_end_input_toggle( btnkbn, obj ) {

	/* メニューから要求の時 */
	if ( btnkbn == 0 ){

		/* 編集モードの時 */
		if ( EditModeCheck() == true ){
			/* 削除ボタンが表示されている時、削除ボタンを非表示にして停止マークを表示する */
			/* 選択行を取り込む */
			var tr = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
			var rowIndex = tr.rowIndex;

			/* 補修箇所リスト入力完了を取り込む */
			var RepairEndValue = tr.getAttribute('REPAIR_INPUT');

			/* 入力中の(完了していない)行を表示する */
			if ( RepairEndValue != 'end' ){
				/* 停止マークボタンが表示されていない時 */
				var node = TableTagNodeGet("MENU_repair_lists_value",rowIndex,0,"MENU_REPAIR_lists_col1","div");
				if ( node.classList.contains("Repair_stop_slidein") == true ){
					/* 選択行の停止マークボタンを表示(右スライド)する */
					REPAIR_lists_stopbtn_display(rowIndex, true);
					/* 選択行の削除ボタンを非表示(右スライド)する */
					REPAIR_lists_delbtn_display(rowIndex, false);
				}
			}

			return;
		}

		/* 補修箇所リスト完了画面を表示する */
		REPAIR_end_input_display( obj );
	}
	/* 完了ボタンまたはキャンセルボタンからの要求の時 */
	else{
		/* 補修箇所リスト完了画面を非表示(隠す)にする */
		REPAIR_end_input_Hidden( btnkbn, obj );			
	}

};

/*------------------------------------------*/
/* 補修箇所リスト完了入力画面を表示する                 */
/*------------------------------------------*/
function REPAIR_end_input_display( obj ) {

	/* 補修箇所リスト入力完了画面が表示されていない(classが含まれていない)時、画面を表示する */
	if ( document.getElementById("PAGE_repair_end").classList.contains("REPAIR_end_slidein") == false ){

		/*メインメニューからの表示 */

		/* 対象行のノードを取得する */
		tr = obj.parentNode.parentNode.parentNode.parentNode.parentNode;

		/* 選択された行位置を取り込む */
		END_INPUT_VAL.rowIndex = tr.rowIndex;
		//alert(tr.id);
		//alert(tr.rowIndex);
		
		/* 補修箇所リスト完了入力画面を表示する */

		/* 検査箇所をタイトルに表示する */
		var place_value = PlaceValueGet();

		var REPAIR_lists_No = END_INPUT_VAL.rowIndex + 1;
		document.getElementById("REPAIR_end_title").innerHTML = '<b>' + place_value + ' #' + REPAIR_lists_No + '</b>';

		/* 補修開始を取り込む */
		var year = tr.getAttribute('REPAIR_sdate_YYYY');
		var month = tr.getAttribute('REPAIR_sdate_MM');
		var day = tr.getAttribute('REPAIR_sdate_DD');
		if ( year != null ){
			/* 補修開始を表示する */
			document.getElementById("REPAIR_end_sdate_picker").value = DateFomat(year,month,day);
		}
		else{
			/* 補修開始がないときは、今日の日付を表示する */
			document.getElementById("REPAIR_end_sdate_picker").value = ToDayDate();			
		}

		/* 補修終了を取り込む */
		year = tr.getAttribute('REPAIR_edate_YYYY');
		month = tr.getAttribute('REPAIR_edate_MM');
		day = tr.getAttribute('REPAIR_edate_DD');
		if ( year != null ){
			/* 補修終了を表示する */
			document.getElementById("REPAIR_end_edate_picker").value = DateFomat(year,month,day);
		}
		else{
			/* 補修開始がないときは、今日の日付を表示する */
			document.getElementById("REPAIR_end_edate_picker").value = ToDayDate();			
		}
		
		/* 補修箇所リスト入力完了を取り込む */
		RepairEndValue = tr.getAttribute('REPAIR_INPUT');

		var RepairTypeNode = TableTagNodeGet('MENU_repair_lists_value',END_INPUT_VAL.rowIndex,0,'MENU_repairType','div');
		var RepairType = RepairTypeNode.innerHTML;
	
		var EndRepairTitleNode = document.getElementById('REPAIR_end_repair_title');

		EndRepairTitleNode.innerHTML = '　' + RepairType
		EndRepairTitleNode.style.color = RepairTypeNode.style.color;

		ChangeRepairEndInputColor( RepairEndValue );
		
		/* "PAGE_repair_end"を表示する */
		document.getElementById("PAGE_repair_end").classList.toggle("REPAIR_end_slidein");
	}

}

/*------------------------------------------*/
/* 補修箇所リスト完了入力画面を非表示(隠す)にする */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン           */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function REPAIR_end_input_Hidden( btnkbn, obj ) {

	/* 補修箇所リスト完了入力画面が表示されている(classが含いる)時、画面を非表示に(隠す)する */
	if ( document.getElementById("PAGE_repair_end").classList.contains("REPAIR_end_slidein") == true ){

		/* 完了ボタンを押したとき */
		if ( btnkbn == 1 ){

			/* 入力情報を反映させる */
			/* 選択されている'未'、'入力完了'区分を取り込む */
			RepairEndValue = SelectRepairEndInputGet();

			var tblData = document.getElementById('MENU_repair_lists_value');
			tr = tblData.rows[END_INPUT_VAL.rowIndex];

			/* 指定行の停止マークボタンタグのノードを取得する */
			var IconNode = TableTagNodeGet("MENU_repair_lists_value",END_INPUT_VAL.rowIndex,0,"REPAIR_lists_edit_icon","button");


			/* 補修開始日を保存する */
			var sdate_picker = document.getElementById("REPAIR_end_sdate_picker").value;
			var sdatestr = null;
			var sdate_yyyy = null;
			var sdate_mm = null;
			var sdate_dd = null;
			if ( sdate_picker != "" ){
				sdatestr = sdate_picker.split("-");
				sdate_yyyy = Number(sdatestr[0]);
				sdate_mm = Number(sdatestr[1]);
				sdate_dd = Number(sdatestr[2]);
			}
			else{
				alert('【コークス炉管理】\n補修開始日を入力してください。');
				return;
			}


			/* 補修終了日を保存する */
			var edate_picker = document.getElementById("REPAIR_end_edate_picker").value;
			var edatestr = null;
			var edate_yyyy = null;
			var edate_mm = null;
			var edate_dd = null;
			if ( edate_picker != "" ){
				edatestr = edate_picker.split("-");
				edate_yyyy = Number(edatestr[0]);
				edate_mm = Number(edatestr[1]);
				edate_dd = Number(edatestr[2]);
			}
			else{
				alert('【コークス炉管理】\n補修終了日を入力してください。');
				return;
			}


			var sdate = new Date(sdate_yyyy, sdate_mm, sdate_dd, 0, 0, 0);
			var edate = new Date(edate_yyyy, edate_mm, edate_dd, 0, 0, 0);

			if ( sdate > edate ){
				alert('【コークス炉管理】\n補修開始日・補修終了日の入力に誤りがあります。');
				return;
			}

			tr.setAttribute('REPAIR_sdate_YYYY',sdate_yyyy);
			tr.setAttribute('REPAIR_sdate_MM',sdate_mm);
			tr.setAttribute('REPAIR_sdate_DD',sdate_dd);					

			tr.setAttribute('REPAIR_edate_YYYY',edate_yyyy);
			tr.setAttribute('REPAIR_edate_MM',edate_mm);
			tr.setAttribute('REPAIR_edate_DD',edate_dd);					



			/* '未'、'入力完了'区分をセットする */
			tr.setAttribute('REPAIR_INPUT',RepairEndValue);

			if ( RepairEndValue == 'in' ){
				tr.style.background = 'white';
				IconNode.style.background = 'white';
			}
			else{
				tr.style.background = 'honeydew';
				IconNode.style.background = 'honeydew';
			}
	
		}

		/* "PAGE_repair_end"を非表示する */
		document.getElementById("PAGE_repair_end").classList.toggle("REPAIR_end_slidein");

	}
	
}


/*------------------------------------------*/
/* '未'、'入力完了'選択 色替え表示処理         */
/*------------------------------------------*/
/* RepairInput_p : '未'、'入力完了'区分       */
/*               : 'in' ・・・  '未'         */
/*               : 'end' ・・・  '入力完了'   */
function ChangeRepairEndInputColor( RepairInput_p ){

	/* 表示色クリア */
	document.getElementById( "REPAIR_end_input_in" ).style.color = 'blue';
	document.getElementById( "REPAIR_end_input_end" ).style.color = 'blue';

	document.getElementById( "REPAIR_end_input_in" ).style.backgroundColor = 'white';
	document.getElementById( "REPAIR_end_input_end" ).style.backgroundColor = 'white';

	var id = "";
	switch (RepairInput_p) {
		case "in":
			id = "REPAIR_end_input_in";
			break;
		case "end":
			id = "REPAIR_end_input_end";
			break;
		default:
			id = "REPAIR_end_input_in";
			break;
	}

	/* 選択箇所色替え表示 */
	document.getElementById( id ).style.backgroundColor = 'blue';
	document.getElementById( id ).style.color = 'white';
}

/*------------------------------------------*/
/* 選択されている'未'、'入力完了'を取り込む     */
/*------------------------------------------*/
/* 返り値        : '未'、'入力完了'区分       */
/*               : 'in' ・・・  '未'         */
/*               : 'end' ・・・  '入力完了'   */
function SelectRepairEndInputGet( ){
	var input_in_color = document.getElementById( "REPAIR_end_input_in" ).style.backgroundColor;
	var input_end_color = document.getElementById( "REPAIR_end_input_end" ).style.backgroundColor;

	var inend_ret = 'in';
	if ( input_in_color == 'blue' ){
		inend_ret = 'in';
	}
	else if ( input_end_color == 'blue' ){
		inend_ret = 'end';
	}
	else{
		inend_ret = 'in';
	}

	return( inend_ret );
}


function REPAIR_end_info_screen(btnkbn){
	REPAIR_end_info_toggle( btnkbn, END_INPUT_VAL.rowIndex );
}
