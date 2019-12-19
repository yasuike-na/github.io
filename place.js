//20191217155150
/*********************************************************************/
/* 検査箇所入力画面                                                  */
/*********************************************************************/

/*------------------------------------------*/
/* 検査箇所入力画面 表示、非表示処理        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン          */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */

function PLACE_toggle( btnkbn ) {

	/* メニューから要求の時 */
	if ( btnkbn == 0 ){

		/* 検査箇所入力画面を表示する */
		PLACE_display();
	}
	/* 完了ボタンまたはキャンセルボタンからの要求の時 */
	else{
		/* 検査箇所入力画面を非表示(隠す)にする */
		PLACE_Hidden( btnkbn );			
	}

};


/*------------------------------------------*/
/* 検査箇所入力画面を表示する                 */
/*------------------------------------------*/
function PLACE_display() {

	/* 検査箇所入力画面が表示されていない(classが含まれていない)時、画面を表示する */
	if ( document.getElementById("PAGE_place").classList.contains("PLACE_slidein") == false ){

		/*メインメニューからの表示 */
		var MENU_place_id = document.getElementById("MENU_place_value")

		/* 検査箇所入力画面を表示する */
		/* 炉団No.を取り込む */
		var rodanno = MENU_place_id.getAttribute('RODANNO');
		if ( rodanno == null ){
			rodanno = 0;
		}
		rodanno = Number(rodanno);

		/* 炭化室No.を取り込む */
		var tankaroomno = MENU_place_id.getAttribute('TANKAROOMNO');
		if ( tankaroomno == null ){
			tankaroomno = 1;
		}
		tankaroomno = Number(tankaroomno);

		/* 若番,末番を取り込む */
		var wakmatu = MENU_place_id.getAttribute('WAKMATU');
		if ( wakmatu == null ){
			wakmatu = "";
		}

		/* 炉団選択 色替え表示処理 */
		ChangeRodanColor(rodanno);

		/* 若番、末番選択 色替え表示処理 */
		ChangeWakaMatuColor(wakmatu);

		/* 炭化室No.の選択リストを作成する */
		var html_ = "";
		var no = 0;
		for(var loop01=0; loop01<256; loop01++){
			no = loop01 + 1;
			html_ = html_ + '<option value="' + no + '">　　　' + no + '　　　　</option>';
		}
		document.getElementById("PLACE_tankaval_sel").innerHTML = html_;
	
		/* 炭化室No.をセットする */
		var index = tankaroomno - 1;
		document.getElementById("PLACE_tankaval_sel").options[index].selected = true;

		/* "PAGE_place"を表示する */
		document.getElementById("PAGE_place").classList.toggle("PLACE_slidein");

	}

}


/*------------------------------------------*/
/* 検査箇所入力画面を非表示(隠す)にする        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン           */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function PLACE_Hidden( btnkbn ) {

	/* 検査箇所入力画面が表示されている(classが含いる)時、画面を非表示に(隠す)する */
	if ( document.getElementById("PAGE_place").classList.contains("PLACE_slidein") == true ){

		/* 完了ボタンを押したとき */
		if ( btnkbn == 1 ){

			/* 入力情報を反映させる */
			var MENU_place_id = document.getElementById("MENU_place_value")

			/* 炉団No.を保存する */
			var rodanno = SelectRodanGet();
			MENU_place_id.setAttribute('RODANNO',rodanno);
			/* 炭化室No.を保存する */
			var tankaroomno = document.getElementById("PLACE_tankaval_sel").value;
			MENU_place_id.setAttribute('TANKAROOMNO',tankaroomno);
			/* 若番,末番を保存する */
			var wakmatu = SelectWakaMatuGet();
			MENU_place_id.setAttribute('WAKMATU',wakmatu);

			/* メニューに表示する */
			MENU_place_id.innerHTML = AREA + " " + rodanno + "炉<br>" + " #" + tankaroomno + " 炭化室" + " " + wakmatu;

		}

		/* "PAGE_place"を非表示(隠す)にする  */
		document.getElementById("PAGE_place").classList.toggle("PLACE_slidein");

	}
	
}

/*------------------------------------------*/
/* 炉団選択 色替え表示処理                  */
/*------------------------------------------*/
/* rodanno_p : 炉団No                       */
function ChangeRodanColor( rodanno_p ){

	/* 表示色クリア */
	document.getElementById( "PLACE_rodan1" ).style.color = 'blue';
	document.getElementById( "PLACE_rodan2" ).style.color = 'blue';
	document.getElementById( "PLACE_rodan3" ).style.color = 'blue';
	document.getElementById( "PLACE_rodan4" ).style.color = 'blue';
	document.getElementById( "PLACE_rodan5" ).style.color = 'blue';

	document.getElementById( "PLACE_rodan1" ).style.backgroundColor = 'white';
	document.getElementById( "PLACE_rodan2" ).style.backgroundColor = 'white';
	document.getElementById( "PLACE_rodan3" ).style.backgroundColor = 'white';
	document.getElementById( "PLACE_rodan4" ).style.backgroundColor = 'white';
	document.getElementById( "PLACE_rodan5" ).style.backgroundColor = 'white';


	var id = "";
	switch (rodanno_p) {
		case 1:
			id = "PLACE_rodan1";
			break;
		case 2:
			id = "PLACE_rodan2";
			break;
		case 3:
			id = "PLACE_rodan3";
			break;
		case 4:
			id = "PLACE_rodan4";
			break;
		case 5:
			id = "PLACE_rodan5";
			break;
		default:
			id = "PLACE_rodan1";
			break;
	}

	/* 選択箇所色替え表示 */
	document.getElementById( id ).style.backgroundColor = 'blue';
	document.getElementById( id ).style.color = 'white';

}

/*------------------------------------------*/
/* 選択されている炉団No.を取り込む            */
/*------------------------------------------*/
/* 返り値        : 炉団No.                   */
function SelectRodanGet(){
	var rodan1_color = document.getElementById( "PLACE_rodan1" ).style.backgroundColor;
	var rodan2_color = document.getElementById( "PLACE_rodan2" ).style.backgroundColor;
	var rodan3_color = document.getElementById( "PLACE_rodan3" ).style.backgroundColor;
	var rodan4_color = document.getElementById( "PLACE_rodan4" ).style.backgroundColor;
	var rodan5_color = document.getElementById( "PLACE_rodan5" ).style.backgroundColor;

	var rodan_ret = 1;
	if ( rodan1_color == 'blue' ){
		rodan_ret = 1;
	}
	else if ( rodan2_color == 'blue' ){
		rodan_ret = 2;
	}
	else if ( rodan3_color == 'blue' ){
		rodan_ret = 3;
	}
	else if ( rodan4_color == 'blue' ){
		rodan_ret = 4;
	}
	else if ( rodan5_color == 'blue' ){
		rodan_ret = 5;
	}
	else{
		rodan_ret = 1;
	}

	return( rodan_ret );
}

/*------------------------------------------*/
/* '若番'、'末番'選択 色替え表示処理           */
/*------------------------------------------*/
/* wakmatu_p : '若番'、'末番'区分             */
/*               : '若番'                   */
/*               : '末番'                   */
function ChangeWakaMatuColor( wakmatu_p ){

	/* 表示色クリア */
	document.getElementById( "PLACE_wka" ).style.color = 'blue';
	document.getElementById( "PLACE_matu" ).style.color = 'blue';

	document.getElementById( "PLACE_wka" ).style.backgroundColor = 'white';
	document.getElementById( "PLACE_matu" ).style.backgroundColor = 'white';

	var id = "";
	switch (wakmatu_p) {
		case "若番":
			id = "PLACE_wka";
			break;
		case "末番":
			id = "PLACE_matu";
			break;
		default:
			id = "PLACE_wka";
			break;
	}

	/* 選択箇所色替え表示 */
	document.getElementById( id ).style.backgroundColor = 'blue';
	document.getElementById( id ).style.color = 'white';
}

/*------------------------------------------*/
/* 選択されている'若番'、'末番'を取り込む     */
/*------------------------------------------*/
/* 返り値        : '若番'、'末番'区分        */
/*               : '若番'                   */
/*               : '末番'                   */
function SelectWakaMatuGet( ){
	var waka_color = document.getElementById( "PLACE_wka" ).style.backgroundColor;
	var matu_color = document.getElementById( "PLACE_matu" ).style.backgroundColor;

	var wakamatu_ret = '若番';
	if ( waka_color == 'blue' ){
		wakamatu_ret = '若番';
	}
	else if ( matu_color == 'blue' ){
		wakamatu_ret = '末番';
	}
	else{
		wakamatu_ret = '若番';
	}

	return( wakamatu_ret );
}


/*------------------------------------------*/
/* 検査箇所入力済みかをチェックする         */
/*------------------------------------------*/
/* 返り値 :                                 */
/*          false = 未入力                  */
/*          true = 入力済み                 */
function PlaceInputCheak(){
	retc = false;

	/* 未入力の文字が含まれていなとき、入力済み */
	var place_value = document.getElementById("MENU_place_value").innerText;
	if (place_value.indexOf( "未入力" ) == -1) {
		retc = true;
	}	
	return retc;
}	


/*------------------------------------------*/
/* 検査箇所を取り込む                         */
/*------------------------------------------*/
/* 返り値 : 検査箇所                         */
function PlaceValueGet(){
	Title_ret = ''

	/* 未入力の文字が含まれていなとき、入力済み */
	var Title_ret = document.getElementById("MENU_place_value").innerHTML;
	if (Title_ret.indexOf( "未入力" ) != -1) {
		Title_ret = '';
	}	
	return Title_ret;
}	

