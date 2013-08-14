// ==UserScript==
// @name           Warchaos Buy Force
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Add "max" button
// @include        http://warchaos.ru/f/a
// @match          http://warchaos.ru/f/a
// ==/UserScript==

(function () {
	// return;
	function source() {
	function l() {
		var t = "";
		for (var i = 0; i < arguments.length; i++)
			t += arguments[i] + ' ';
		if (navigator.appName == "Opera")
			opera.postError(new Date().toTimeString() + ": " + t);
	}

	function insertAfter(el1,el2) {
		if (!el2.parentNode) return;
		if (el2.nextSibling)
			el2.parentNode.insertBefore(el1,el2.nextSibling);
		else
			el2.parentNode.appendChild(el1);
	}
	
	function ajaxRequest(url, method, param, onSuccess, onFailure, args) {
			var xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.onreadystatechange = function() {
				if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
					onSuccess(xmlHttpRequest, args);
				}
				else if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200)
							onFailure(xmlHttpRequest);
			};
			xmlHttpRequest.open(method, url, true);
			if (method == 'POST')
				xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xmlHttpRequest.send(param);
	}
		
	/**
	 * Unit object
	 */
	function Unit() {
		this.cost = new Array();  // unit cost
		this.available = 0;       // number of available units to hire
		this.img = new Array();   // images of resource
		this.min = 0;			  // how many units you can hire
		this.box = 0;             // input text element
	}
	/** Print number of units to hire in box */
	Unit.prototype.printTotalCost = function () {
		var totalCost = new Array();
		for (var i = 0; i < this.box.parentNode.childNodes.length; i++) {
			if (this.box.parentNode.childNodes[i].nodeName == "#text") {
				totalCost.push(this.box.parentNode.childNodes[i]);
			}
		}
		for (var i = 0; i < this.img.length; i++) {
			totalCost[i].data = Number(this.cost[i][1]) * this.box.value;
		}
	}
	var units = new Array();

	function findAmountOfStorageResources() {
		// gold, lamber, metal, stone, mandragora
		var resources = [["it/204.gif",0], ["it/214.gif", 0], ["it/224.gif",0], ["it/234.gif", 0], ["it/284.gif",0], ]; //[4][1]
		$("#stor img[src^='it/2']").each(function(i, img) {
			$(resources).each(function(j, res) {
				if ($(img).attr("src") == resources[j][0]) {
					resources[j][1] = $(img).parent().contents().last().text();
				}
			});
		});
		return resources;
	}
	
	function findUnitCost() {
		var res = findAmountOfStorageResources();
		var unit;
		var imgs = document.getElementsByTagName("img");
		for (var i = 0; i < imgs.length; i++) {
			var m = imgs[i].getAttribute('src').match(/(\d+).gif/);
			if (m && m[1] > 9000) {
				var buyButton = imgs[i].parentNode.nextSibling.nextSibling.getElementsByTagName("input")[1];
				if (buyButton.hasAttribute('value')) {
					buyButton.setAttribute('style', 'width:120px;');

					table = buyButton.parentNode.parentNode.parentNode.parentNode;
					var cost = table.rows[0].cells[buyButton.parentNode.cellIndex-1];
					unit = new Unit();
					img = cost.getElementsByTagName('img');
					for (var j = 0; j < img.length; j++) {
						if (img[j].hasAttribute('tooltip') ) {
							for (var k = 0; k < res.length; k++)
								if (img[j].getAttribute('src') == res[k][0]) {
									unit.cost.push([res[k][0],img[j].nextSibling.data]);
									unit.img.push(img[j].cloneNode(true));
								}
						}
					}
					unit.available = table.rows[0].cells[buyButton.parentNode.cellIndex-2].getElementsByTagName('small')[0].innerHTML;

					var min = Number.MAX_VALUE;
					for (var ii = 0 ,jj = 0; ii < res.length; ii++) {
						if (res[ii][0] == unit.cost[jj][0]) {
							if (min > res[ii][1] / unit.cost[jj][1]) {
								min = res[ii][1] / unit.cost[jj][1];
							}
							if (jj < unit.cost.length - 1)
								jj++;
						}
					}
					min = Math.floor(min);
					if (min > unit.available)
						min = unit.available;
					unit.min = min;

					var input = document.createElement('input');
					input.setAttribute("type", "button");
					input.setAttribute("class", "cmb");
					input.setAttribute("value", "max");
					input.setAttribute("style", "width:30px;");

					var br = document.createElement('br');
					insertAfter(br, buyButton);
					insertAfter(input, br);
					unit.box = input.parentNode.childNodes[0];
					units.push(unit);
					var box = input.parentNode.childNodes[0];
					box.setAttribute("blockNum", units.length-1);
					for (var k = unit.img.length - 1; k >= 0; k--) {
						text = document.createTextNode(Number(unit.cost[k][1]));
						insertAfter(text, input);
						insertAfter(unit.img[k],input);
					}
					box.addEventListener("keyup", function () {
							var blockNum = this.getAttribute("blockNum");
							unit = units[blockNum];
							unit.printTotalCost();
					}, false)
					input.addEventListener("click", function () {
							box = this.parentNode.childNodes[0];
							var blockNum = box.getAttribute("blockNum");
							unit = units[blockNum];
							box.value = unit.min;
							unit.printTotalCost();
					}, false)
				}
			}
		}
	}
	var tbl = [
		["Казармы", "it/2254.gif", [1,0,0,0,0], 0],
		["Гарнизон", "it/2264.gif", [2,0,0,0,0], 1],
		["Стрельбище", "it/2274.gif", [0,1,0,0,0], 0],
		["Полигон", "it/2284.gif", [1,0,1,0,0], 1],
		["Орден меча", "it/2294.gif", [5,0,0,0,0], 0],
		["Орден щита", "it/2304.gif", [4,0,1,0,0], 1],
		["Конюшни", "it/2314.gif", [5,1,0,0,0], 0],
		["Арена", "it/2324.gif", [5,1,1,0,0], 1],
		["Башня магов", "it/2334.gif", [0,0,0,0,1], 0],
	];

	function cloneArray(arr) {
		var res = [];
		for (var i = 0; i < arr.length; i++)
		res.push(arr[i]);
		return res;
	};


	(function addButtons() {
		if (typeof $ === "undefined") {
			var script = document.createElement("script");
			script.src = "http://code.jquery.com/jquery-2.0.3.min.js";
			document.body.appendChild(script);
		} else if (typeof $.ui === "undefined") {
			script = document.createElement("script");
			script.src = "http://code.jquery.com/ui/jquery-ui-git.js";
			document.body.appendChild(script);
		}
		if (typeof $ === "undefined" || typeof $.ui === "undefined") {
			setTimeout(addButtons, 1000);
			return;
		}
		var div = document.createElement("div");
		div.setAttribute("id", "dialog");
		div.setAttribute("title", "just title");
		div.innerHTML = "some content";
		document.body.appendChild(div);
		$(function() {
			$("#dialog").dialog();
		});

		function getTotalCost() {
			var totalCost = [0,0,0,0,0];
			$("#totalCost").parent().parent().parent().find("td[maxprice]").each(function(i,td) {
				$(td.getAttribute("maxprice").split(",")).each(function(j, price) {
					totalCost[j] = parseInt(totalCost[j]) + parseInt(price);
				});
			});
			return totalCost;
		};
		function printTotalCost() {
			var cell = $("#totalCost");			
			var resources = findAmountOfStorageResources();
			cell.html("");
			var totalCost = getTotalCost();
			$(totalCost).each(function(i) {
				if (totalCost[i]) {
					var img = document.createElement("img");
					img.setAttribute("src", resources[i][0]);
					img.setAttribute("style", "width:20px;height:15px;");
					cell.append(img);
					cell.append(document.createTextNode(totalCost[i]));
				}
			});
		};
		var bRg = /Казармы|Гарнизон|Стрельбище|Полигон|Орден|Конюшни|Арена|Башня|Храм/;
		var t = document.getElementsByTagName('table');
		for (var i = 0; i < t.length; i++) {
			if (t[i].hasAttribute('class') && t[i].getAttribute('class') == "rwh" && t[i].innerHTML.search(bRg) != -1) {
				findUnitCost();
				break;
			}
		}
		var imgs = document.getElementsByTagName('img');
		for (var i = 0; i < imgs.length; i++) {
			if (imgs[i].getAttribute('src') == "ctrl/lu0.gif") {
				var t = imgs[i].parentNode.parentNode.parentNode.parentNode;
				//alert(t);
				
				t.insertRow(1);
				t.rows[1].insertCell(0);
				
				var button = document.createElement("input");
				button.setAttribute("type", "button");
				button.setAttribute("class", "cmb");
				button.setAttribute("style", "width: 90px;");
				button.setAttribute("value", "Нанять войска");
				//t.rows[1].cells[0].appendChild(button);
				t.parentNode.appendChild(button);
				button.addEventListener('click', function() {
					var resources = findAmountOfStorageResources();
					var w = window;
					w.help1 = "Нанять войска";
					w.help2 = "<div id='buyforce'></div>";
					w.ShowWin();
					// alert("clicked");
					var div = document.getElementById("buyforce");
					var t = document.createElement("table");
					t.setAttribute("style", "color:black;font:normal;font-size:10;width:600px;");
					for (var i = 0; i < tbl.length + 1; i++) {
						t.insertRow(0);
						for (var j = 0; j < 10; j++) {
							t.rows[0].insertCell(0);
						}
					}
					// max all
					var input = document.createElement("input");
					input.setAttribute("type", "button");
					input.setAttribute("class", "cmb");
					input.setAttribute("value", "max");
					input.setAttribute("style", "width:30px;");
					t.rows[t.rows.length-1].cells[0].appendChild(input);
					input.addEventListener("click", function(e) {
						t.rows[t.rows.length-1].cells[1].setAttribute("totalCost", "0,0,0,0,0");
						$(e.target.parentNode.parentNode.parentNode.parentNode).find("input[type='checkbox']").each(function(i, cb) {
							if (cb.checked == true) {
								$(cb).parent().parent().find("input[value='max']").click();
							}
						});
					}, false);
					t.rows[t.rows.length-1].cells[1].setAttribute("id", "totalCost");
					t.rows[t.rows.length-1].cells[1].setAttribute("totalCost", "0,0,0,0,0");
					//totalCost.cell = t.rows[t.rows.length-1].cells[1];
					div.appendChild(t);
					var td = document.getElementsByTagName("td");
					for (var i = 0; i < td.length; i++) {
						if (td[i].hasAttribute('class') && (td[i].getAttribute('class') == "bld" || td[i].getAttribute('class') == "btxt")
								&& td[i].hasChildNodes()) {
							for (var j = 0; j < tbl.length; j++) {
								if ( ( j + 1 < tbl.length && (j % 2 == 0) && td[i].innerHTML.search(tbl[j+1][0]) != -1)
								|| td[i].innerHTML.search(tbl[j][0]) != -1) {
									var input = document.createElement("input");
									input.setAttribute("type", "checkbox");
									input.checked = true;
									t.rows[j].cells[0].appendChild(input);
									t.rows[j].cells[1].innerHTML = '<img src="' + tbl[j][1] + '">';
									var quantity;
									if (td[i].getElementsByTagName("small").length > 0) {
										quantity = parseInt(td[i].getElementsByTagName("small")[0].innerHTML.match(/(\d+)/)[1]);
										t.rows[j].cells[2].innerHTML = quantity;
										t.rows[j].cells[2].setAttribute("name", "avalquantity");
									}
									input = document.createElement("input");
									input.setAttribute("type", "text");
									input.setAttribute("class", "cmb");
									input.setAttribute("name", "quantity");
									input.setAttribute("index", j);
									t.rows[j].cells[3].appendChild(input);
									//input.addEventListener("click", function() {
									//});
									$(input).keyup(function(e) {
										calcCost(parseInt(e.target.value), parseInt(e.target.getAttribute("index")),
												 e.target.parentNode.nextSibling.nextSibling);
									});
									var cellCounter = 4;
									var cell = t.rows[j].cells[cellCounter++];
									input = document.createElement('input');
									input.setAttribute("type", "button");
									input.setAttribute("class", "cmb");
									input.setAttribute("value", "max");
									input.setAttribute("style", "width:30px;");
									input.setAttribute("index", j);
									input.setAttribute("quantity", quantity);
									cell.appendChild(input);
									// !!!
									input.addEventListener("click", function(e) {
										var min = calcCost(parseInt(e.target.parentNode.previousSibling.previousSibling.innerHTML), parseInt(e.target.getAttribute("index")), e.target.parentNode.nextSibling);
										e.target.parentNode.previousSibling.childNodes[0].value = min;
									}, false);
									cell = t.rows[j].cells[cellCounter++];
									function calcCost(quantity, j, cell) {
										cell.innerHTML = "";
										var resources = findAmountOfStorageResources();
										var min = quantity;
										cell.setAttribute("maxPrice", "0,0,0,0,0");
										var price = cloneArray(tbl[j][2]);
										var maxPrice = cloneArray(tbl[j][2]);
										var totalCost = getTotalCost();
										$(maxPrice).each(function(i) {
											maxPrice[i] = price[i] * min;
										});
										$(maxPrice).each(function(i) {
											if (maxPrice[i] > resources[i][1] - totalCost[i]) {
												var tmpMin = parseInt((resources[i][1] - totalCost[i]) / price[i]);
												if (tmpMin < min) {
													min = tmpMin;
												}
											}
										});
										$(maxPrice).each(function(i) {
											maxPrice[i] = price[i] * min;
										});
										var totalCost = getTotalCost();
										$(totalCost).each(function(i) {
											if (totalCost[i] > resources[i][1]) {
											}
										});
										// print price
										$(maxPrice).each(function(i) {
											if (maxPrice[i]) {
												var img = document.createElement("img");
												img.setAttribute("src", resources[i][0]);
												img.setAttribute("style", "width:20px;height:15px;");
												cell.appendChild(img);
												cell.appendChild(document.createTextNode(maxPrice[i]));
											}
										});
										cell.setAttribute("maxPrice", maxPrice.toString());
										printTotalCost();
										return min;
									};
									cell = t.rows[j].cells[cellCounter++];
									input = document.createElement("input");
									input.setAttribute("type", "button");
									input.setAttribute("class", "cmb");
									input.setAttribute("value", "Нанять");
									input.setAttribute("c", td[i].getAttribute("rc").match(/(b\d+)/)[1]);
									input.setAttribute("z", j+1);
									if ( j + 1 < tbl.length && (j % 2 == 0) && td[i].innerHTML.search(tbl[j+1][0]) != -1)
										input.setAttribute("bld", tbl[j+1][0]);
									else
										input.setAttribute("bld", tbl[j][0]);
									//input.setAttribute("unitType", tbl[j][3]);
									input.addEventListener("click", function(e) {										
										var quantity = parseInt(e.target.parentNode.parentNode.cells[3].childNodes[0].value);
										// var b = w.subb;
										var c = e.target.getAttribute("c");
										var z = e.target.getAttribute("z");
										// w.ecod  !!!! get new w.ecod for every request
										var req = "a="+w.mobjects[w.obja+5]+"&b="+w.mobjects[0]+"&c="+c+"&d=8&e="+w.ecod+"&x="+quantity+"&y=&z="+z;
										ajaxRequest("http://warchaos.ru/f/a", "POST", req,
										function(t){
											l(t.responseText);
											w.ecod = t.responseText.match(/ecod\=(\d+)/)[1];
											// "Казармы<BR><small>(87)</small>",0,0, new RegExp(e.target.getAttribute("bld")
											var quantity = t.responseText.match(new RegExp(e.target.getAttribute("bld") + "<BR><small>\\((\\d+)"))[1];
											//e.target.parentNode.parentNode.cells[2].innerHTML = quantity;
											$(tbl).each(function(i) {
												if (tbl[i][0] == e.target.getAttribute("bld") && tbl[i][3] == 1) {
												//	e.target.parentNode.parentNode.previousSibling.cells[2].innerHTML = quantity;
												} //else if (tbl[i][0] == e.target.getAttribute("bld") && tbl[i][3] == 0 && tbl)
											});
											$(e.target).parent().parent().parent().parent().find("input[bld='" + e.target.getAttribute("bld") + "']").parent().parent().find("td[name='avalquantity']").html(quantity);
											var srge = t.responseText.match(/g\.srge\=(new Array.+);/);
											w.srge = eval(srge[1]);
											w.storg2();
											w.storg1();
										}, function() {l("bad")});
									}, false);
									
									cell.appendChild(input);
									var z = td[i].getAttribute("rc").match(/b(\d+)/)[1];
									// Нанять cmD(8,document.getElementById("buy3").value,3);
									// function cmD(d,x,z,evt) { return cm(mobjects[obja+5],mobjects[0],subb,d,x,'',z,evt?evt:0);}
									// function cm(a,b,c,d,x,y,z,evt)
									/* +td[i].getAttribute("rc").match(/b(\d+)/)[0]
									 */
									
									// var params = "a="+w.g.mobjects[w.g.obja+5]+"&b="+w.g.mobjects[0]+"&c="+w.g.subb+"&d=8&e="+w.g.ecod+"&x="+quantity+"&y=&z="+(j+1);
									
								}
							}
						}
					}
				}, false);

				//t.parentNode.appendChild(button);
				//insertAfter(t, button);
				//alert(t.rows.length);
			}
		}
	})();

	}
	
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
	//document.body.removeChild(script);
})();

