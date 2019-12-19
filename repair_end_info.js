//20191217155150
/*********************************************************************/
/* 補修情報詳細入力画面                                                */
/*********************************************************************/

/*------------------------------------------*/
/* 補修情報詳細入力画面 表示、非表示処理        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン          */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */

function REPAIR_end_info_toggle( btnkbn, rowIndex ) {

	/* メニューから要求の時 */
	if ( btnkbn == 0 ){
		/* 編集モードの時、表示しない */
		if ( EditModeCheck() == true ){
			return;
		}

		/* 補修情報詳細入力画面を表示する */
		REPAIR_end_info_display(rowIndex);
	}
	/* 完了ボタンまたはキャンセルボタンからの要求の時 */
	else{
		/* 補修情報詳細入力画面を非表示(隠す)にする */
		REPAIR_end_info_Hidden( btnkbn,rowIndex );			
	}

};

/*------------------------------------------*/
/* 補修情報詳細入力画面を表示する                 */
/*------------------------------------------*/
function REPAIR_end_info_display(rowIndex) {

	/* 補修情報詳細入力画面が表示されていない(classが含まれていない)時、画面を表示する */
	if ( document.getElementById("PAGE_repair_end_info").classList.contains("REPAIR_end_info_slidein") == false ){


		var rownode = document.getElementById("MENU_repair_lists_value").rows[rowIndex];
		var material_no = rownode.getAttribute('MATERIAL_NO');
		var use_in = rownode.getAttribute('USE_IN');

		/* 検査箇所をタイトルに表示する */
		var place_value = PlaceValueGet();

		var REPAIR_lists_No = rowIndex + 1;
		document.getElementById("REPAIR_end_info_title").innerHTML = '<b>' + place_value + ' #' + REPAIR_lists_No + '</b>';

		/* 補修材料の選択リストを作成する */
		/* JSONに登録されている 補修材料の数を取り込む */
		var MaterialCount = JSON_DATA.REPAIR_material.length;

		var htmlstr = "";
		var no = 0;
		for(var loop01=0; loop01<MaterialCount; loop01++){
			no = loop01 + 1;
			htmlstr = htmlstr + '<option value="' + no + '">' + JSON_DATA.REPAIR_material[loop01].name + '</option>';
		}
		document.getElementById("REPAIR_end_info_material_sel").innerHTML = htmlstr;

		/* 補修材料No.をセットする */
		var index = 0;
		if ( material_no != null ){
			index = Number(material_no)-1;
		}
		document.getElementById("REPAIR_end_info_material_sel").options[index].selected = true;

		/* 使用量をセットする */
		var use_in_ = 0;
		if ( use_in != null ){
			use_in_ = Number(use_in);
		}
		document.getElementById("REPAIR_end_info_use_in").value = use_in_;

		/* "PAGE_REPAIR_end_info"を表示する */
		document.getElementById("PAGE_repair_end_info").classList.toggle("REPAIR_end_info_slidein");


	}

}

/*------------------------------------------*/
/* 補修情報詳細入力画面を非表示(隠す)にする        */
/*------------------------------------------*/
/* btnkbn : ボタン区分                      */
/*          0 = メニュー画面ボタン           */
/*          1 = 完了ボタン                  */
/*          2 = キャンセルボタン            */
function REPAIR_end_info_Hidden( btnkbn, rowIndex ) {

	/* 補修情報詳細入力画面が表示されている(classが含いる)時、画面を非表示に(隠す)する */
	if ( document.getElementById("PAGE_repair_end_info").classList.contains("REPAIR_end_info_slidein") == true ){

		/* 完了ボタンを押したとき */
		if ( btnkbn == 1 ){
			var rownode = document.getElementById("MENU_repair_lists_value").rows[rowIndex];
			var material_no = document.getElementById("REPAIR_end_info_material_sel").value;
			var use_in = document.getElementById("REPAIR_end_info_use_in").value;

			rownode.setAttribute('MATERIAL_NO',material_no);
			rownode.setAttribute('USE_IN',use_in);
		}

		/* "PAGE_REPAIR_end_info"を非表示(隠す)にする */
		document.getElementById("PAGE_repair_end_info").classList.toggle("REPAIR_end_info_slidein");

	}
	
}


