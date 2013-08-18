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

	function forceType(bld, ico, price, lvl) {
		this.bld = bld;
		this.ico = ico;
		this.price = price;
		this.lvl = lvl;
		this.mark = 0;
		this.quantity = 0;
		this.rc = "";
	};
	
	var forceTable = [
		new forceType("Казармы", "it/2254.gif", [1,0,0,0,0], 0),
		new forceType("Гарнизон", "it/2264.gif", [2,0,0,0,0], 1),
		new forceType("Стрельбище", "it/2274.gif", [0,1,0,0,0], 0),
		new forceType("Полигон", "it/2284.gif", [1,0,1,0,0], 1),
		new forceType("Орден меча", "it/2294.gif", [5,0,0,0,0], 0),
		new forceType("Орден щита", "it/2304.gif", [4,0,1,0,0], 1),
		new forceType("Конюшни", "it/2314.gif", [5,1,0,0,0], 0),
		new forceType("Арена", "it/2324.gif", [5,1,1,0,0], 1),
		new forceType("Башня магов", "it/2334.gif", [0,0,0,0,1], 0),
		new forceType("Храм", "???", [], 0),
	];

	function cloneArray(arr) {
		var res = [];
		for (var i = 0; i < arr.length; i++)
		res.push(arr[i]);
		return res;
	};

	function addBuyAllButton() {
		function getTotalCost() {				
			var totalCost = [0,0,0,0,0];
			$("#buyforcetable input[type=checkbox]").each(function(i, cb) {
				if (cb.checked) {
					$($(cb).parent().parent().find("td[maxprice]").attr("maxprice").split(",")).each(function(j, price) {
						totalCost[j] = parseInt(totalCost[j]) + parseInt(price);
					});
				}
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
					cell.append(img);
					cell.append(document.createTextNode(totalCost[i]));
				}
			});
		};
		/**
		 * j - index in forceTable/buyforcetable
		 */
		function calcCost(j, quantity) {
			var avalquantity = parseInt($("#buyforcetable tr:nth-child("+(j+1)+") td[name='avalquantity']").html());
			//l(avalquantity);
			//l(quantity);
			var cell = $("#buyforcetable tr:nth-child("+(j+1)+") td[maxprice]").get(0);
			cell.innerHTML = "";
			var resources = findAmountOfStorageResources();			
			
			if ($("#buyforcetable tr:nth-child("+(j+1)+") td input[type=checkbox]").get(0).checked) {
				if (forceTable[j].lvl == 0 && forceTable[j+1].lvl == 1 && forceTable[j+1].mark == 1
					&& $("#buyforcetable tr:nth-child("+(j+2)+") td input[type=checkbox]").get(0).checked) {
					var altq = parseInt($("#buyforcetable tr:nth-child("+(j+2)+") input[name='quantity']").val());
					if (quantity < 0)
						quantity = 0;
					else if (isNaN(altq))
						altq = 0;
					//l(avalquantity,  altq, quantity);
					if (quantity > avalquantity) {
						quantity = avalquantity;
						$("#buyforcetable tr:nth-child("+(j+1)+") input[name='quantity']").val(quantity);
						altq = 0;
						$("#buyforcetable tr:nth-child("+(j+2)+") input[name='quantity']").val(altq);
						calcCost(j+1, altq);
					}
					
					if ((avalquantity - altq - quantity < 0) && altq > 0) {
						altq = avalquantity - quantity;
						$("#buyforcetable tr:nth-child("+(j+2)+") input[name='quantity']").val(altq);
						calcCost(j+1, altq);
					}
				} else if (forceTable[j].lvl == 1 && $("#buyforcetable tr:nth-child("+(j)+") td input[type=checkbox]").get(0).checked) {
					var altq = parseInt($("#buyforcetable tr:nth-child("+(j)+") input[name='quantity']").val());
					if (quantity < 0)
						quantity = 0;
					else if (isNaN(altq))
						altq = 0;
					if (quantity > avalquantity) {
						quantity = avalquantity;
						$("#buyforcetable tr:nth-child("+(j+1)+") input[name='quantity']").val(quantity);
						altq = 0;
						$("#buyforcetable tr:nth-child("+(j)+") input[name='quantity']").val(altq);
						calcCost(j-1, altq);
					}					
					if ((avalquantity - altq - quantity < 0) && altq > 0) {
						altq = avalquantity - quantity;
						$("#buyforcetable tr:nth-child("+(j)+") input[name='quantity']").val(altq);
						calcCost(j-1, altq);
					}
				}
			}
			
			//l(quantity);
			var min = quantity;
			cell.setAttribute("maxPrice", "0,0,0,0,0");
			var price = cloneArray(forceTable[j].price);
			var maxPrice = cloneArray(forceTable[j].price);
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
					cell.appendChild(img);
					cell.appendChild(document.createTextNode(maxPrice[i]));
				}
			});
			cell.setAttribute("maxPrice", maxPrice.toString());
			printTotalCost();
			return min;
		};
		// init forceTable
		$("td[class='bld']:has(small), td[class='btxt']:has(small), td[class='bld']").each(function(i, td) {
			$(forceTable).each(function(j, force) {
				if (td.innerHTML.search(force.bld) != -1
					|| (j < forceTable.length-1 && td.innerHTML.search(forceTable[j+1].bld) != -1 && forceTable[j+1].lvl == 1)) {
					force.mark = 1;
					if ($(td).find("small").length > 0)
						force.quantity = $(td).find("small").html().match(/\d+/);
					else
						force.quantity = 250;
					force.rc = td.getAttribute("rc").match(/(b\d+)/)[1];
				}
			});
		});
		var cell;
		var button;
		// init table
		var t = document.createElement("table");
		t.setAttribute("id", "buyforcetable");		
		$(t).dialog({autoOpen: false, width: 600, title: "Найм войск"});
		var button = document.createElement("button");
		button.innerHTML = "Нанять войска";
		$("td[class='bld']:first").parent().parent().parent().parent().append($(button));
		$(button).button().click(function() {$("#buyforcetable").dialog("open");});			
		var resources = findAmountOfStorageResources();
		for (var i = 0; i < forceTable.length + 1; i++) {
			t.insertRow(0);
			for (var j = 0; j < 7; j++) {
				t.rows[0].insertCell(0);
			}
		}
		var wcBuyForce = localStorage.getItem("wc_buy_force");
		if (wcBuyForce) {
			wcBuyForce = wcBuyForce.toString().split(",");
		} else {
			wcBuyForce = new Array();
			$(forceTable).each(function() {
				wcBuyForce.push(1);
			});
			localStorage.setItem("wc_buy_force", wcBuyForce);
		}
		
		$(forceTable).each(function(i, force) {
			if (force.mark == 1) {
				if (force.bld == "Храм") {
					return;
				}
				var cellCounter = 0;
				var row = t.rows[i];
				var cell = row.cells[cellCounter++];
				var input = document.createElement("input");
				input.setAttribute("type", "checkbox");
				if (wcBuyForce[i] == "1")
					input.checked = true;
				else
					input.checked = false;
				cell.appendChild(input);
				$(input).click(function(e) {
					if (e.target.checked)
						wcBuyForce[i] = 1;
					else
						wcBuyForce[i] = 0;
					localStorage.setItem("wc_buy_force", wcBuyForce);
					printTotalCost();
				});
				
				cell = row.cells[cellCounter++];
				cell.innerHTML = '<img src="' + forceTable[i].ico + '">';

				cell = row.cells[cellCounter++];
				var quantity;
				quantity = force.quantity;
				cell.innerHTML = quantity;
				cell.setAttribute("name", "avalquantity");			

				cell = row.cells[cellCounter++];
				input = document.createElement("input");
				input.setAttribute("type", "text");
				input.setAttribute("name", "quantity");
				input.setAttribute("index", i);
				cell.appendChild(input);
				$(input).spinner({
					min: 0,
					max: $(cell).prev().html(),
					spin: function(e, ui) {
						calcCost(parseInt(e.target.getAttribute("index")),
								 parseInt(ui.value));
					},
				});
				
				$(input).keyup(function(e) {
					calcCost(parseInt(e.target.getAttribute("index")),
							 parseInt(e.target.value));
				});
				
				// max
				cell = row.cells[cellCounter++];
				var button = document.createElement("button");
				button.innerHTML = "max";
				button.setAttribute("index", i);
				button.setAttribute("quantity", quantity);
				cell.appendChild(button);
				$(button).button().click(function(e) {
					var input = $(e.target).parent().prev().find("input[name='quantity']")
					var min = calcCost(parseInt(e.target.getAttribute("index")),
									  parseInt($(e.target).parent().parent().find("td[name='avalquantity']").html()));
					input.val(min);
				});
				
				cell = row.cells[cellCounter++];
				cell.setAttribute("maxprice", "0,0,0,0,0");
				cell = row.cells[cellCounter++];
				button = document.createElement("button");
				button.innerHTML = "Нанять";
				button.setAttribute("c", force.rc);
				button.setAttribute("z", i+1);
				button.setAttribute("bld", force.bld);
				if (force.lvl == 1)
					t.rows[i-1].cells[cellCounter-1].getElementsByTagName("button")[0].setAttribute("bld", force.bld);	
				$(button).button().click(function(e) {
					var w = window;
					var quantity = parseInt($(e.target).parent().parent().find("input[name=quantity]").val());
					var c = e.target.getAttribute("c");
					var z = e.target.getAttribute("z");
					// w.ecod  !!!! get new w.ecod for every request
					var req = "a="+w.mobjects[w.obja+5]+"&b="+w.mobjects[0]+"&c="+c+"&d=8&e="+w.ecod+"&x="+quantity+"&y=&z="+z;
					$.ajax({
						url: "http://warchaos.ru/f/a",
						type: "POST",
						data: req,
						async: false,
						success: function(data) {
							var w = window;
							var quantity = 0;
							w.ecod = data.match(/ecod\=(\d+)/)[1];
							// "Казармы<BR><small>(87)</small>",0,0, new RegExp(e.target.getAttribute("bld")
							var m  = data.match(new RegExp(e.target.getAttribute("bld") + "<BR><small>\\((\\d+)"));							
							if (m)
								quantity = m[1];
							$(e.target).parent().parent().parent().parent().find(
								"button[bld='" + e.target.getAttribute("bld")
									+ "']").parent().parent().find("td[name='avalquantity']").html(quantity);							
							var srge = data.match(/g\.srge\=(new Array.+);/);
							w.srge = eval(srge[1]);
							w.storg2();
							w.storg1();
						},
						error: function() {
							l("error");
						},
					});
				}); // click				
				cell.appendChild(button);				
			} // if
		}); // each

		// clear all
		button = document.createElement("button");
		button.innerHTML = "Очистить";
		row = t.rows[t.rows.length-1];
		row.cells[3].appendChild(button);
		$(button).button().click(function(e) {
			$("#buyforcetable input[name=quantity]").val("");
			$("#buyforcetable td[maxprice]").attr("maxprice", "0,0,0,0,0");
			$("#buyforcetable td[maxprice]").html("");
			$("#buyforcetable #totalCost").attr("totalcost", "0,0,0,0,0");
			$("#buyforcetable #totalCost").html("");
		});
		// max all
		button = document.createElement("button");
		button.innerHTML = "max";
		row.cells[4].appendChild(button);
		cell = row.cells[5];
		$(button).button().click(function(e) {
			$("#buyforcetable #totalCost").attr("totalcost", "0,0,0,0,0");
			$("#buyforcetable #totalCost").html("");
			$("#buyforcetable input[type='checkbox']").each(function(i, cb) {
				if (cb.checked) {
					$(cb).parent().parent().find("button[quantity]").click();
				} else {
					$(cb).parent().parent().find("input[name=quantity]").val(0);
					var td = $(cb).parent().parent().find("td[maxprice]")[0];
					td.setAttribute("maxprice", "0,0,0,0,0");
					td.innerHTML = "";					
				}
			});
			printTotalCost();			
		});
		cell.setAttribute("id", "totalCost");
		cell.setAttribute("totalCost", "0,0,0,0,0");
		// hire all
		button = document.createElement("button");
		button.innerHTML = "Нанять всех";
		cell = row.cells[6];
		cell.appendChild(button);
		$(button).button().click(function(e) {
			$("#buyforcetable input[type='checkbox']").each(function(i, cb) {
				if (cb.checked) {
					$(cb).parent().parent().find("button[bld]").click();
				}
			})
		});
		// test rountines
		$(function() {
			return;
			//$("#buyforcetable img[src='it/2254.gif']").parent().next().next().find("input[name='quantity']").val(10);
			//$("#buyforcetable img[src='it/2264.gif']").parent().next().next().find("input[name='quantity']").val(10);
		});
	};
	function addScript(src) {
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++) {
			if (scripts[i].getAttribute("src") == src)
				return;
		};
		var script = document.createElement("script");
		script.src = src;
		document.head.appendChild(script);
	}

	(function addButtons() {
		if (typeof $ === "undefined") {
			addScript("http://warchaosujs.gixx.ru/jquery-ui/js/jquery-1.9.1.js");
		} else if (typeof $.ui === "undefined") {
			addScript("http://warchaosujs.gixx.ru/jquery-ui/js/jquery-ui-1.10.3.custom.min.js");
			var link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("href", "http://warchaosujs.gixx.ru/jquery-ui/css/sunny/jquery-ui-1.10.3.custom.css");
			document.head.appendChild(link);
		}
		if (typeof $ === "undefined" || typeof $.ui === "undefined") {
			setTimeout(addButtons, 1000);
			return;
		}
		if (typeof window.g === "undefined" || typeof window.g.cons === "undefined" || typeof window.g.blds === "undefined")
			return;
		var bRg = /Казармы|Гарнизон|Стрельбище|Полигон|Орден|Конюшни|Арена|Башня|Храм/;
		var t = document.getElementsByTagName('table');
		for (var i = 0; i < t.length; i++) {
			if (t[i].hasAttribute('class') && t[i].getAttribute('class') == "rwh" && t[i].innerHTML.search(bRg) != -1) {
				findUnitCost();
				break;
			}
		}
		addBuyAllButton();
	})();

	}
	
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
	//document.body.removeChild(script);
})();

