//20191217155150
/*********************************************************************/
/* 補修コメント入力画面                                                */
/*********************************************************************/

/*------------------------------------------*/
/* 補修コメント入力画面 表示、非表示処理        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン          */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */

function REPAIR_comment_toggle( btnkbn ) {

	/* メニューから要求の時 */
	if ( btnkbn == 0 ){
		/* 編集モードの時、表示しない */
		if ( EditModeCheck() == true ){
			return;
		}

		/* 補修コメント入力画面を表示する */
		REPAIR_comment_display();
	}
	/* 完了ボタンまたはキャンセルボタンからの要求の時 */
	else{
		/* 補修コメント入力画面を非表示(隠す)にする */
		REPAIR_comment_Hidden( btnkbn );			
	}

};

/*------------------------------------------*/
/* 補修コメント入力画面を表示する                 */
/*------------------------------------------*/
function REPAIR_comment_display() {

	/* 補修コメント入力画面が表示されていない(classが含まれていない)時、画面を表示する */
	if ( document.getElementById("PAGE_repair_comment").classList.contains("REPAIR_comment_slidein") == false ){

		/*メインメニューからの表示 */
		var MENU_repair_comment_id = document.getElementById("MENU_repair_comment_value")

		/* 補修コメント入力画面を表示する */

		/* 補修コメント */
		var comment = MENU_repair_comment_id.getAttribute('REPAIR_COMMENT');
		if ( comment == null ){
			comment = "";
		}

		/* 補修コメントを表示する */
		document.getElementById("REPAIR_comment_in").value = comment;

		/* "PAGE_REPAIR_comment"を表示する */
		document.getElementById("PAGE_repair_comment").classList.toggle("REPAIR_comment_slidein");


	}

}

/*------------------------------------------*/
/* 補修コメント入力画面を非表示(隠す)にする        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン           */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function REPAIR_comment_Hidden( btnkbn ) {

	/* 補修コメント入力画面が表示されている(classが含いる)時、画面を非表示に(隠す)する */
	if ( document.getElementById("PAGE_repair_comment").classList.contains("REPAIR_comment_slidein") == true ){

		/* 完了ボタンを押したとき */
		if ( btnkbn == 1 ){

			/* 入力情報を反映させる */
			var MENU_repair_comment_id = document.getElementById("MENU_repair_comment_value")

			/* 炭化室No.を保存する */
			var comment = document.getElementById("REPAIR_comment_in").value;
			MENU_repair_comment_id.setAttribute('REPAIR_COMMENT',comment);

			/* メニューに表示する */
			if ( comment == ""){
				document.getElementById("MENU_repair_comment_value").innerHTML = "　未入力";
			}
			else{
				document.getElementById("MENU_repair_comment_value").innerHTML = StrTextOmit(comment, 17);
			}
		}

		/* "PAGE_REPAIR_comment"を非表示(隠す)にする */
		document.getElementById("PAGE_repair_comment").classList.toggle("REPAIR_comment_slidein");

	}
	
}


