//20191217155150
/*********************************************************************/
/* 損傷コメント入力画面                                                */
/*********************************************************************/

/*------------------------------------------*/
/* 損傷コメント入力画面 表示、非表示処理        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン          */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */

function DAMAGE_comment_toggle( btnkbn ) {

	/* メニューから要求の時 */
	if ( btnkbn == 0 ){
		/* 編集モードの時、表示しない */
		if ( EditModeCheck() == true ){
			return;
		}

		/* 損傷コメント入力画面を表示する */
		DAMAGE_comment_display();
	}
	/* 完了ボタンまたはキャンセルボタンからの要求の時 */
	else{
		/* 損傷コメント入力画面を非表示(隠す)にする */
		DAMAGE_comment_Hidden( btnkbn );			
	}

};

/*------------------------------------------*/
/* 損傷コメント入力画面を表示する                 */
/*------------------------------------------*/
function DAMAGE_comment_display() {

	/* 損傷コメント入力画面が表示されていない(classが含まれていない)時、画面を表示する */
	if ( document.getElementById("PAGE_damage_comment").classList.contains("DAMAGE_comment_slidein") == false ){

		/*メインメニューからの表示 */
		var MENU_damage_comment_id = document.getElementById("MENU_damage_comment_value")

		/* 損傷コメント入力画面を表示する */

		/* 損傷コメント */
		var comment = MENU_damage_comment_id.getAttribute('DAMAGE_COMMENT');
		if ( comment == null ){
			comment = "";
		}

		/* 損傷コメントを表示する */
		document.getElementById("DAMAGE_comment_in").value = comment;

		/* "PAGE_damage_comment"を表示する */
		document.getElementById("PAGE_damage_comment").classList.toggle("DAMAGE_comment_slidein");


	}

}

/*------------------------------------------*/
/* 損傷コメント入力画面を非表示(隠す)にする     */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン           */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function DAMAGE_comment_Hidden( btnkbn ) {

	/* 損傷コメント入力画面が表示されている(classが含いる)時、画面を非表示に(隠す)する */
	if ( document.getElementById("PAGE_damage_comment").classList.contains("DAMAGE_comment_slidein") == true ){

		/* 完了ボタンを押したとき */
		if ( btnkbn == 1 ){

			/* 入力情報を反映させる */
			var MENU_damage_comment_id = document.getElementById("MENU_damage_comment_value")

			/* 炭化室No.を保存する */
			var comment = document.getElementById("DAMAGE_comment_in").value;
			MENU_damage_comment_id.setAttribute('DAMAGE_COMMENT',comment);

			/* メニューに表示する */
			if ( comment == ""){
				document.getElementById("MENU_damage_comment_value").innerHTML = "　未入力";
			}
			else{
				document.getElementById("MENU_damage_comment_value").innerHTML = StrTextOmit(comment, 17);
			}
		}

		/* "PAGE_damage_comment"を非表示(隠す)にする */
		document.getElementById("PAGE_damage_comment").classList.toggle("DAMAGE_comment_slidein");

	}
	
}

/*------------------------------------------*/
/* 指定文字数以上の時、以降を省略( …)する。文字列の改行以降も省略( …)する */
/*------------------------------------------*/
/* str_ : 対象文字列                       */
/* maxlength : MAX文字数                   */
function StrTextOmit(str_, maxlength){
	var pos;
    var afterTxt = ' …'; // 文字カット後に表示するテキスト
	var str_ret = '';
	var strcutFlg = false;

	str_ret = str_;

	/* 改行を検索する */
	pos = str_.indexOf('\r');
	if ( pos < 0 ){
		pos = str_.indexOf('\n');
	}

	/* 改行が含まれていたとき、改行以降をカットする */
	if ( 0 <= pos ){
		/* 改行以降をカットする */
		str_ret = str_ret.substring(0, pos)
		strcutFlg = true;
	}

	/* 指定文字数以降を、カットする */
	if ( maxlength < str_ret.length ){
		str_ret = str_ret.substring(0, maxlength)
		strcutFlg = true;
	}

	/* 文字列がカットされた時は ...を追加 */
	if ( strcutFlg == true ){
		str_ret = str_ret + afterTxt;	
	}

	return str_ret;
}

