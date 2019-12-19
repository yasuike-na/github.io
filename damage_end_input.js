//20191217155150
/*********************************************************************/
/* 損傷箇所リスト完了入力画面                                        */
/*********************************************************************/

/* 損傷箇所リスト完了入力画面 入力情報格納構造体 */
function END_INPUT_VALUE(){
	this.rowIndex = -1;
}
/* 損傷箇所リスト完了入力画面 入力情報格納構造体 */
var END_INPUT_VAL = new END_INPUT_VALUE();

/*------------------------------------------*/
/* 損傷箇所リスト完了入力画面 表示、非表示処理        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン          */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function DAMAGE_end_input_toggle( btnkbn, obj ) {

	/* メニューから要求の時 */
	if ( btnkbn == 0 ){

		/* 編集モードの時 */
		if ( EditModeCheck() == true ){
			/* 削除ボタンが表示されている時、削除ボタンを非表示にして停止マークを表示する */
			/* 選択行を取り込む */
			var tr = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
			var rowIndex = tr.rowIndex;

			/* 損傷箇所リスト入力完了を取り込む */
			var DamageEndValue = tr.getAttribute('DAMAGE_INPUT');

			/* 入力中の(完了していない)行を表示する */
			if ( DamageEndValue != 'end' ){
				/* 停止マークボタンが表示されていない時 */
				var node = TableTagNodeGet("MENU_damage_lists_value",rowIndex,0,"MENU_DAMAGE_lists_col1","div");
				if ( node.classList.contains("Damage_stop_slidein") == true ){
					/* 選択行の停止マークボタンを表示(右スライド)する */
					DAMAGE_lists_stopbtn_display(rowIndex, true);
					/* 選択行の削除ボタンを非表示(右スライド)する */
					DAMAGE_lists_delbtn_display(rowIndex, false);
				}
			}

			return;
		}

		/* 損傷箇所リスト完了画面を表示する */
		DAMAGE_end_input_display( obj );
	}
	/* 完了ボタンまたはキャンセルボタンからの要求の時 */
	else{
		/* 損傷箇所リスト完了画面を非表示(隠す)にする */
		DAMAGE_end_input_Hidden( btnkbn, obj );			
	}

};

/*------------------------------------------*/
/* 損傷箇所リスト完了入力画面を表示する                 */
/*------------------------------------------*/
function DAMAGE_end_input_display( obj ) {

	/* 損傷箇所リスト入力完了画面が表示されていない(classが含まれていない)時、画面を表示する */
	if ( document.getElementById("PAGE_damage_end").classList.contains("DAMAGE_end_slidein") == false ){

		/*メインメニューからの表示 */

		/* 対象行のノードを取得する */
		tr = obj.parentNode.parentNode.parentNode.parentNode.parentNode;

		/* 選択された行位置を取り込む */
		END_INPUT_VAL.rowIndex = tr.rowIndex;
		//alert(tr.id);
		//alert(tr.rowIndex);
		
		/* 損傷箇所リスト完了入力画面を表示する */

		/* 検査箇所をタイトルに表示する */
		var place_value = PlaceValueGet();

		DAMAGE_lists_No = END_INPUT_VAL.rowIndex + 1;
		document.getElementById("DAMAGE_end_title").innerHTML = '<b>' + place_value + ' #' + DAMAGE_lists_No + '</b>';

		/* 損傷箇所リスト入力完了を取り込む */
		DamageEndValue = tr.getAttribute('DAMAGE_INPUT');

		var DamageTypeNode = TableTagNodeGet('MENU_damage_lists_value',END_INPUT_VAL.rowIndex,0,'MENU_damageType','div');
		var DamageType = DamageTypeNode.innerHTML;
	
		var EndDamageTitleNode = document.getElementById('DAMAGE_end_damage_title');

		EndDamageTitleNode.innerHTML = '　' + DamageType
		EndDamageTitleNode.style.color = DamageTypeNode.style.color;

		ChangeDamageEndInputColor( DamageEndValue );


		/* "PAGE_damage_end"を表示する */
		document.getElementById("PAGE_damage_end").classList.toggle("DAMAGE_end_slidein");
	}

}

/*------------------------------------------*/
/* 損傷箇所リスト完了入力画面を非表示(隠す)にする */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン           */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function DAMAGE_end_input_Hidden( btnkbn, obj ) {

	/* 損傷箇所リスト完了入力画面が表示されている(classが含いる)時、画面を非表示に(隠す)する */
	if ( document.getElementById("PAGE_damage_end").classList.contains("DAMAGE_end_slidein") == true ){

		/* 完了ボタンを押したとき */
		if ( btnkbn == 1 ){

			/* 入力情報を反映させる */
			/* 選択されている'未'、'入力完了'区分を取り込む */
			DamageEndValue = SelectDamageEndInputGet();

			var tblData = document.getElementById('MENU_damage_lists_value');
			tr = tblData.rows[END_INPUT_VAL.rowIndex];

			/* 指定行の停止マークボタンタグのノードを取得する */
			var IconNode = TableTagNodeGet("MENU_damage_lists_value",END_INPUT_VAL.rowIndex,0,"DAMAGE_lists_edit_icon","button");

			/* '未'、'入力完了'区分をセットする */
			tr.setAttribute('DAMAGE_INPUT',DamageEndValue);

			if ( DamageEndValue == 'in' ){
				tr.style.background = 'white';
				IconNode.style.background = 'white';
			}
			else{
				tr.style.background = 'honeydew';
				IconNode.style.background = 'honeydew';
			}
	
		}

		/* "PAGE_damage_end"を非表示する */
		document.getElementById("PAGE_damage_end").classList.toggle("DAMAGE_end_slidein");

	}
	
}


/*------------------------------------------*/
/* '未'、'入力完了'選択 色替え表示処理         */
/*------------------------------------------*/
/* DamageInput_p : '未'、'入力完了'区分       */
/*               : 'in' ・・・  '未'         */
/*               : 'end' ・・・  '入力完了'   */
function ChangeDamageEndInputColor( DamageInput_p ){

	/* 表示色クリア */
	document.getElementById( "DAMAGE_end_input_in" ).style.color = 'blue';
	document.getElementById( "DAMAGE_end_input_end" ).style.color = 'blue';

	document.getElementById( "DAMAGE_end_input_in" ).style.backgroundColor = 'white';
	document.getElementById( "DAMAGE_end_input_end" ).style.backgroundColor = 'white';

	var id = "";
	switch (DamageInput_p) {
		case "in":
			id = "DAMAGE_end_input_in";
			break;
		case "end":
			id = "DAMAGE_end_input_end";
			break;
		default:
			id = "DAMAGE_end_input_in";
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
function SelectDamageEndInputGet( ){
	var input_in_color = document.getElementById( "DAMAGE_end_input_in" ).style.backgroundColor;
	var input_end_color = document.getElementById( "DAMAGE_end_input_end" ).style.backgroundColor;

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
