//20191217155150

//----------------------------------------------
// 壁紙制御
//----------------------------------------------

// 横データ
var WALL_W			= 15700 - 184 - 184;
var WALL_Xreso		= 30 + 2;

var WALL_Xleft		= 1;
var WALL_Xright		= WALL_W;
var WALL_XleftEx	= 166;
var WALL_XrightEx	= WALL_W - 166;

var WALL_Xmeters	= [	166,					// セル位置メートル表
						500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
						500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
						500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 
						166
					];
var WALL_Xpercents = [];						// セル位置％表
var WALL_Xpoints = new Array(100);				// マウス位置（％）→セル位置（％）添え字対応表

var WALL_Xmin;
var WALL_Xmax;
var WALL_XminEx;
var WALL_XmaxEx;

// 縦データ
var WALL_H			= 1300 + 6506 + 857;
var WALL_Yreso		= 50;

var WALL_Ytop		= 1300;
var WALL_Ybottom	= WALL_Ytop + 6506;
var WALL_YtopEx		= WALL_Ybottom + 369;
var WALL_YbottomEx	= WALL_H;

var WALL_Ymeters	= [	169, 169, 169, 169, 	// セル位置メートル表
						152, 
						228, 
						125, 
						100, 100, 
						125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 
						125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 
						125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 
						125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 
						125
					];
var WALL_Ypercents = [];						// セル位置％表
var WALL_Ypoints = new Array(100);				// マウス位置（％）→セル位置（％）添え字対応表

var WALL_Ymin;
var WALL_Ymax;
var WALL_YminEx;
var WALL_YmaxEx;



var ACCURACY = 1000;
function roundit(value) {
	return Math.round(value * ACCURACY) / ACCURACY;
}


function WALL_init() {
	var i, j;
	
	WALL_Xmin	= roundit(WALL_Xleft / WALL_W);
	WALL_Xmax	= roundit(WALL_Xright / WALL_W);
	WALL_XminEx	= roundit(WALL_XleftEx / WALL_W);
	WALL_XmaxEx	= roundit(WALL_XrightEx / WALL_W);
	
	var Xtotal = 0;
	for (i=0; i<WALL_Xreso; i++) {
		Xtotal = Xtotal + (WALL_Xmeters[i] / WALL_W);
		WALL_Xpercents.push(roundit(Xtotal));
	}
	for (j=0; j<100; j++) {
		for (i=0; i<WALL_Xreso; i++) {
			WALL_Xpoints[j] = i;
			if (WALL_Xpercents[i] > (j/100))	break;
		}
	}

	WALL_Ymin	= roundit(WALL_Ytop / WALL_H);
	WALL_Ymax	= roundit(WALL_Ybottom / WALL_H);
	WALL_YminEx	= roundit(WALL_YtopEx / WALL_H);
	WALL_YmaxEx	= roundit(WALL_YbottomEx / WALL_H);
	
	var Ytotal = 0;
	for (i=0; i<WALL_Yreso; i++) {
		Ytotal = Ytotal + (WALL_Ymeters[i] / WALL_H);
		WALL_Ypercents.push(roundit(Ytotal));
	}
	for (j=0; j<100; j++) {
		for (i=0; i<WALL_Yreso; i++) {
			WALL_Ypoints[j] = i;
			if (WALL_Ypercents[i] > (j/100))	break;
		}
	}
}

function WALL_getXY(targetX, targetY) {
	var xp, yp;
	var x, y;

	var [xp, yp] = WALL_getXpYp(targetX, targetY);
	
	if (yp < WALL_Ymin) {
		return [-1, -1, -1];
		
	} else if ((WALL_Ymax < yp) && (yp < WALL_YminEx)) {
		return [-1, -1, -1];
		
	} else if (WALL_YmaxEx < yp) {
		return [-1, -1, -1];
		
	} else if (yp <= WALL_Ymax) {
		yp = yp - WALL_Ymin;

		// シーケンシャルサーチ
//		for (y=0; y<WALL_Yreso; y++) {
//			if (WALL_Ypercents[y] > yp)	break;
//		}
//		if (y == WALL_Yreso) {
//			return [-1, -1, -1];
//		}
//
		// クイックサーチ
//		y = WALL_qsearchY(yp);
//
		// 添え字対応表によるサーチ
		y = WALL_Ypoints[Math.round(yp*100)];
	
	} else if (yp <= WALL_YmaxEx) {
		y = WALL_Yreso;
		
	}

	var from, to, min, max;
	if (y == WALL_Yreso) {
		from	= 1;
		to		= WALL_Xreso - 1;
		if ((xp < WALL_XminEx)	|| (WALL_XmaxEx < xp))	return [-1, -1, -1];
	} else {
		from	= 0;
		to		= WALL_Xreso;
		if ((xp < WALL_Xmin)	|| (WALL_Xmax < xp))	return [-1, -1, -1];
	}
	xp = xp - WALL_Xmin;

	// シーケンシャルサーチ
//	for (x=from; x<to; x++) {
//		if (WALL_Xpercents[x] > xp)	break;
//	}
//	if (x == to) {
//		return [-1, -1, -1];
//	}
//
	// クイックサーチ
//	x = WALL_qsearchX(xp, from, to);
//
	// 添え字対応表によるサーチ
	x = WALL_Xpoints[Math.round(xp*100)];

	return [0, x, y];
}

function WALL_getXpYp(targetX, targetY) {
	var xp = ((targetX - ZOOMER_nowX) / ZOOMER_nowS / ZOOMER_conW);
	var yp = ((targetY - ZOOMER_nowY) / ZOOMER_nowS / ZOOMER_conH);
	return [xp, yp];
}
/*
var ypoint;
var ydiff;
function WALL_qsearchY(yp) {
	ydiff = ypoint	= Math.ceil(WALL_Yreso/2);
	while (ydiff > 1) {
		ydiff = Math.ceil(ydiff/2);
		if (yp < WALL_Ypercents[ypoint]) {
			if (ypoint == 0)						return ypoint;
			if (WALL_Ypercents[ypoint-1] <= yp)		return ypoint;
			ypoint = ypoint - ydiff;
		} else {
			ypoint = ypoint + ydiff;
		}
	}
	return ypoint;
}
var xpoint;
var xdiff;
function WALL_qsearchX(xp, from, to) {
	xdiff = xpoint	= Math.ceil(to/2);
	while (xdiff > 1) {
		xdiff = Math.ceil(xdiff/2);
		if (xp < WALL_Xpercents[xpoint]) {
			if (xpoint == from)						return xpoint;
			if (WALL_Xpercents[xpoint-1] <= xp)		return xpoint;
			xpoint = xpoint - xdiff;
		} else {
			xpoint = xpoint + xdiff;
		}
	}
	return xpoint;
}
*/

function WALL_getXsYs(x, y) {
	//document.getElementById("misc").innerHTML = "";

	var x1, x2, y1, y2;

	x2 = WALL_Xpercents[x] + WALL_Xmin;
	if (x == 0)		x1 = WALL_Xmin;
	else			x1 = WALL_Xpercents[x-1] + WALL_Xmin;
	//document.getElementById("misc").innerHTML = "x=" + x + ", x1=" + x1 + ", x2=" + x2; //DEBUG;

	if (y==WALL_Yreso) {
		y1 = WALL_YminEx;
		y2 = WALL_YmaxEx;
	} else {
		y2 = WALL_Ypercents[y] + WALL_Ymin;
		if (y == 0)		y1 = WALL_Ymin;
		else			y1 = WALL_Ypercents[y-1] + WALL_Ymin;
	}
	//document.getElementById("misc").innerHTML = "y=" + y + ", y1=" + y1 + ", y2=" + y2; //DEBUG;

	return [x1, x2, y1, y2];
}

//------------------------------------------
// ズーム部の背景描画処理
//------------------------------------------
function WALL_drawZOOMER() {
/*
	var i;
	for(i=0; i<WALL_Xreso; i++) {
		var name = "ZOOMER_vline" + i;
		var elm = document.createElementNS("http://www.w3.org/2000/svg", "line");
		elm.setAttribute("x1",				(WALL_Xmin + WALL_Xpercents[i]) * ZOOMER_conW);
		elm.setAttribute("y1",				(WALL_Ymin * ZOOMER_conH));
		elm.setAttribute("x2",				(WALL_Xmin + WALL_Xpercents[i]) * ZOOMER_conW);
		elm.setAttribute("y2",				(WALL_Ymax * ZOOMER_conH));
		elm.setAttribute("stroke",			"red");
		elm.setAttribute("stroke-width",	1);
		elm.setAttribute("id",				name);
		elm.setAttribute("pointer-events",	"none");
		elm.setAttribute("position",		"fixed");
		ZOOMER_obj.appendChild(elm);
	}
	for(i=0; i<WALL_Yreso; i++) {
		var name = "ZOOMER_hline" + i;
		var elm = document.createElementNS("http://www.w3.org/2000/svg", "line");
		elm.setAttribute("x1",				(WALL_Xmin * ZOOMER_conW));
		elm.setAttribute("y1",				(WALL_Ymin + WALL_Ypercents[i]) * ZOOMER_conH);
		elm.setAttribute("x2",				(WALL_Xmax * ZOOMER_conW));
		elm.setAttribute("y2",				(WALL_Ymin + WALL_Ypercents[i]) * ZOOMER_conH);
		elm.setAttribute("stroke",			"red");
		elm.setAttribute("stroke-width",	1);
		elm.setAttribute("id",				name);
		elm.setAttribute("pointer-events",	"none");
		elm.setAttribute("position",		"fixed");
		ZOOMER_obj.appendChild(elm);
	}
	var elm = document.createElementNS("http://www.w3.org/2000/svg", "line");
	elm.setAttribute("x1",				WALL_Xmin * ZOOMER_conW);
	elm.setAttribute("y1",				0);
	elm.setAttribute("x2",				WALL_Xmin * ZOOMER_conW);
	elm.setAttribute("y2",				ZOOMER_conH);
	elm.setAttribute("stroke",			"red");
	elm.setAttribute("stroke-width",	1);
	elm.setAttribute("id",				"Xmin");
	elm.setAttribute("pointer-events",	"none");
	elm.setAttribute("position",		"fixed");
	ZOOMER_obj.appendChild(elm);
	var elm = document.createElementNS("http://www.w3.org/2000/svg", "line");
	elm.setAttribute("x1",				WALL_Xmax * ZOOMER_conW);
	elm.setAttribute("y1",				0);
	elm.setAttribute("x2",				WALL_Xmax * ZOOMER_conW);
	elm.setAttribute("y2",				ZOOMER_conH);
	elm.setAttribute("stroke",			"red");
	elm.setAttribute("stroke-width",	1);
	elm.setAttribute("id",				"Xmax");
	elm.setAttribute("pointer-events",	"none");
	elm.setAttribute("position",		"fixed");
	ZOOMER_obj.appendChild(elm);
	var elm = document.createElementNS("http://www.w3.org/2000/svg", "line");
	elm.setAttribute("x1",				0);
	elm.setAttribute("y1",				WALL_Ymin * ZOOMER_conH);
	elm.setAttribute("x2",				ZOOMER_conW);
	elm.setAttribute("y2",				WALL_Ymin * ZOOMER_conH);
	elm.setAttribute("stroke",			"red");
	elm.setAttribute("stroke-width",	1);
	elm.setAttribute("id",				"Ymin");
	elm.setAttribute("pointer-events",	"none");
	elm.setAttribute("position",		"fixed");
	ZOOMER_obj.appendChild(elm);
	var elm = document.createElementNS("http://www.w3.org/2000/svg", "line");
	elm.setAttribute("x1",				0);
	elm.setAttribute("y1",				WALL_Ymax * ZOOMER_conH);
	elm.setAttribute("x2",				ZOOMER_conW);
	elm.setAttribute("y2",				WALL_Ymax * ZOOMER_conH);
	elm.setAttribute("stroke",			"red");
	elm.setAttribute("stroke-width",	1);
	elm.setAttribute("id",				"Ymax");
	elm.setAttribute("pointer-events",	"none");
	elm.setAttribute("position",		"fixed");
	ZOOMER_obj.appendChild(elm);
*/
}

//------------------------------------------
// マップ部の背景描画
//------------------------------------------
function WALL_drawMAP() {
/*
	var i;
	for(i=0; i<=WALL_Xreso; i++) {
		var name = "MAP_vline" + i;
		var elm = document.createElementNS("http://www.w3.org/2000/svg", "line");
		elm.setAttribute("x1",				(WALL_Xmin + WALL_Xpercents[i]) * MAP_w);
		elm.setAttribute("y1",				(WALL_Ymin * MAP_h));
		elm.setAttribute("x2",				(WALL_Xmin + WALL_Xpercents[i]) * MAP_w);
		elm.setAttribute("y2",				(WALL_Ymax * MAP_h));
		elm.setAttribute("stroke",			"black");
		elm.setAttribute("stroke-width",	0.2);
		elm.setAttribute("id",				name);
		elm.setAttribute("pointer-events",	"none");
		elm.setAttribute("position",		"fixed");
		MAP_obj.appendChild(elm);
	}
	for(i=0; i<=WALL_Yreso; i++) {
		var name = "MAP_hline" + i;
		var elm = document.createElementNS("http://www.w3.org/2000/svg", "line");
		elm.setAttribute("x1",				(WALL_Xmin * MAP_w));
		elm.setAttribute("y1",				(WALL_Ymin + WALL_Ypercents[i]) * MAP_h);
		elm.setAttribute("x2",				(WALL_Xmax * MAP_w));
		elm.setAttribute("y2",				(WALL_Ymin + WALL_Ypercents[i]) * MAP_h);
		elm.setAttribute("stroke",			"black");
		elm.setAttribute("stroke-width",	0.2);
		elm.setAttribute("id",				name);
		elm.setAttribute("pointer-events",	"none");
		elm.setAttribute("position",		"fixed");
		MAP_obj.appendChild(elm);
	}
*/
}
