//20191217155150
/*********************************************************************/
/* 補修中設定入力画面                                                */
/*********************************************************************/

/*------------------------------------------*/
/* 補修中設定入力画面 表示、非表示処理        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン          */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */

function REPAIR_status_toggle( btnkbn ) {

	/* メニューから要求の時 */
	if ( btnkbn == 0 ){
		/* 編集モードの時、表示しない */
		if ( EditModeCheck() == true ){
			return;
		}

		/* 補修コメント入力画面を表示する */
		REPAIR_status_display();
	}
	/* 完了ボタンまたはキャンセルボタンからの要求の時 */
	else{
		/* 補修コメント入力画面を非表示(隠す)にする */
		REPAIR_status_Hidden( btnkbn );			
	}

};

/*------------------------------------------*/
/* 補修中設定入力画面を表示する                 */
/*------------------------------------------*/
function REPAIR_status_display() {

	/* 補修コメント入力画面が表示されていない(classが含まれていない)時、画面を表示する */
	if ( document.getElementById("PAGE_repair_status").classList.contains("REPAIR_status_slidein") == false ){

		/*メインメニューからの表示 */
		var MENU_repair_status_id = document.getElementById("MENU_repair_status_value")

		/* 補修コメント入力画面を表示する */

		/* 補修コメント */
		var status = MENU_repair_status_id.getAttribute('REPAIR_STATUS');
		if ( status == "true" ){
			status = true;
		}
		else{
			status = false;
		}

		/* 補修中設定スイッチ(ON,OFF)を表示する */
		document.getElementById("REPAIR_status_switch3").checked = status;

		/* "PAGE_REPAIR_status"を表示する */
		document.getElementById("PAGE_repair_status").classList.toggle("REPAIR_status_slidein");


	}

}

/*------------------------------------------*/
/* 補修中設定入力画面を非表示(隠す)にする        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン           */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function REPAIR_status_Hidden( btnkbn ) {

	/* 補修コメント入力画面が表示されている(classが含いる)時、画面を非表示に(隠す)する */
	if ( document.getElementById("PAGE_repair_status").classList.contains("REPAIR_status_slidein") == true ){

		/* 完了ボタンを押したとき */
		if ( btnkbn == 1 ){

			/* 入力情報を反映させる */
			var MENU_repair_status_id = document.getElementById("MENU_repair_status_value")

			/* 炭化室No.を保存する */
			var status = document.getElementById("REPAIR_status_switch3").checked;
			MENU_repair_status_id.setAttribute('REPAIR_STATUS',status);

			/* メニューに表示する */
			if ( status == false){
				document.getElementById("MENU_repair_status_value").innerHTML = "未入力";
			}
			else{
				document.getElementById("MENU_repair_status_value").innerHTML = "補修中";
			}
		}

		/* "PAGE_REPAIR_status"を非表示(隠す)にする */
		document.getElementById("PAGE_repair_status").classList.toggle("REPAIR_status_slidein");

	}
	
}


