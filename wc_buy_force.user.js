// ==UserScript==
// @name           Warchaos Buy Force
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Add "max" button, allows you to buy all force
// @match          http://warchaos.ru/f/a
// @version        1.0
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_buy_force.user.js
// ==/UserScript==

(function () {
	function source() {
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
			this.cost = [];				// unit cost
			this.available = 0;			// number of available units to hire
			this.img = [];				// images of resource
			this.min = 0;				// how many units you can hire
			this.box = 0;				// input text element
		}
		/** Print number of units to hire in box */
		Unit.prototype.printTotalCost = function () {
			var i, totalCost = [];
			for (i = 0; i < this.box.parentNode.childNodes.length; i++) {
				if (this.box.parentNode.childNodes[i].nodeName == "#text") {
					totalCost.push(this.box.parentNode.childNodes[i]);
				}
			}
			for (i = 0; i < this.img.length; i++) {
				totalCost[i].data = Number(this.cost[i][1]) * this.box.value;
			}
		};
		var units = [];

		function findAmountOfStorageResources() {
			// gold, lamber, metal, stone, mandragora
			var resources = [["it/204.gif",0], ["it/214.gif", 0], ["it/224.gif",0], ["it/234.gif", 0], ["it/284.gif",0]]; //[4][1]
			$("#stor img[src^='it/2']").each(function(i, img) {
				$(resources).each(function(j) {
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
						var k, cost = table.rows[0].cells[buyButton.parentNode.cellIndex-1];
						unit = new Unit();
						img = cost.getElementsByTagName('img');
						for (var j = 0; j < img.length; j++) {
							if (img[j].hasAttribute('tooltip') ) {
								for (k = 0; k < res.length; k++)
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
						for (k = unit.img.length - 1; k >= 0; k--) {
							text = document.createTextNode(Number(unit.cost[k][1]));
							insertAfter(text, input);
							insertAfter(unit.img[k],input);
						}
						box.addEventListener("keyup", function () {
							var blockNum = this.getAttribute("blockNum");
							unit = units[blockNum];
							unit.printTotalCost();
						}, false);
						input.addEventListener("click", function () {
							box = this.parentNode.childNodes[0];
							var blockNum = box.getAttribute("blockNum");
							unit = units[blockNum];
							box.value = unit.min;
							unit.printTotalCost();
						}, false);
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
			this.z = 0;
		}
		
		var forceTable = [
			new forceType("Казармы", "9010.gif", [1,0,0,0,0], 0),
			new forceType("Гарнизон", "9020.gif", [2,0,0,0,0], 1),
			new forceType("Стрельбище", "9030.gif", [0,1,0,0,0], 0),
			new forceType("Полигон", "9040.gif", [1,0,1,0,0], 1),
			new forceType("Орден меча", "9050.gif", [5,0,0,0,0], 0),
			new forceType("Орден щита", "9060.gif", [4,0,1,0,0], 1),
			new forceType("Конюшни", "9070.gif", [5,1,0,0,0], 0),
			new forceType("Арена", "9080.gif", [5,1,1,0,0], 1),
			new forceType("Башня магов", "9090.gif", [0,0,0,0,1], 0),
			new forceType("Храм", "", [0,0,0,0,0], 0)
		];

		function cloneArray(arr) {
			var res = [];
			for (var i = 0; i < arr.length; i++)
				res.push(arr[i]);
			return res;
		}

		function addBuyAllButton() {
			function getTotalCost() {				
				var totalCost = [0,0,0,0,0];
				$("#buyforcetable input[type=checkbox]").each(function(i, cb) {
					if (cb.checked) {
						$($(cb).parent().parent().find("td[maxprice]").attr("maxprice").split(",")).each(function(j, price) {
							totalCost[j] = parseInt(totalCost[j], 10) + parseInt(price, 10);
						});
					}
				});
				return totalCost;
			}
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
			}
			/**
			 * j - index in forceTable/buyforcetable
			 */
			function calcCost(j, quantity) {
				if (isNaN(quantity) || (quantity < 0))
					quantity = 0;
				var t = document.getElementById("buyforcetable");
				var avalquantity = parseInt($(t.rows[j]).find("td[name='avalquantity']").html(), 10);
				if (quantity > avalquantity)
					quantity = avalquantity;
				var maxPriceCell = $(t.rows[j]).find("td[maxprice]").get(0);
				maxPriceCell.innerHTML = "";
				var resources = findAmountOfStorageResources();
				var price = cloneArray(forceTable[j].price);
				var altPrice;
				if ($(t.rows[j]).find("input[type=checkbox]").get(0).checked) {
					if ((forceTable[j].lvl === 0 && j < forceTable.length - 1 && forceTable[j+1].lvl == 1 && forceTable[j+1].mark == 1 && $(t.rows[j+1]).find("input[type=checkbox]").get(0).checked) ||
						(forceTable[j].lvl == 1 && $(t.rows[j-1]).find("input[type=checkbox]").get(0).checked)) {
						var altj;
						if (forceTable[j].lvl === 0 && j < forceTable.length - 1 && forceTable[j+1].lvl == 1 && forceTable[j+1].mark == 1 && $(t.rows[j+1]).find("input[type=checkbox]").get(0).checked) {
							altj = j+1;
						} else if (forceTable[j].lvl == 1 && $(t.rows[j-1]).find("input[type=checkbox]").get(0).checked) {
							altj = j-1;
						}
						var altq = parseInt($(t.rows[altj]).find("input[name='quantity']").get(0).value, 10);
						if (quantity < 0)
							quantity = 0;
						if (isNaN(altq))
							altq = 0;
						if ((avalquantity - altq - quantity < 0) && altq > 0) {
							altq = avalquantity - quantity;
							$(t.rows[altj]).find("input[name='quantity']").get(0).value = altq;
							calcCost(altj, altq);
						}
						// not enough money
						altPrice = cloneArray(forceTable[altj].price);
						$(resources).each(function(i, res) {
							if (altq > 0 && quantity > 0 && price[i] !== 0 && (price[i] > (res[1] - altPrice[i]*altq - price[i]*quantity)))
								while (1) {
									if ((res[1] - altPrice[i]*altq - price[i]*quantity) < 0) {
										if (altq > 0) {
											altq--;
										}
										else {
											break;
										}
									}
									if ((res[1] - altPrice[i]*altq - price[i]*quantity) >= 0) {
										$(t.rows[altj]).find("input[name='quantity']").get(0).value = altq;
										calcCost(altj, altq);
										break;
									}
								}
						});
					}
				}

				var min = quantity;
				maxPriceCell.setAttribute("maxPrice", "0,0,0,0,0");
				price = cloneArray(forceTable[j].price);
				var maxPrice = cloneArray(forceTable[j].price);		
				var totalCost = getTotalCost();
				$(maxPrice).each(function(i) {
					maxPrice[i] = price[i] * min;
				});
				$(maxPrice).each(function(i) {
					if (maxPrice[i] > resources[i][1] - totalCost[i]) {
						var tmpMin = parseInt((resources[i][1] - totalCost[i]) / price[i], 10);
						if (tmpMin < min) {
							min = tmpMin;
						}
					}
				});
				$(maxPrice).each(function(i) {
					maxPrice[i] = price[i] * min;
				});
				// print price
				maxPriceCell.innerHTML = "";
				$(maxPrice).each(function(i) {
					if (maxPrice[i]) {
						var img = document.createElement("img");
						img.setAttribute("src", resources[i][0]);
						maxPriceCell.appendChild(img);
						maxPriceCell.appendChild(document.createTextNode(maxPrice[i]));
					}
				});
				maxPriceCell.setAttribute("maxPrice", maxPrice.toString());
				min = min ? min : "";
				// doesn`t work for spin
				$(t.rows[j]).find("input[name='quantity']").get(0).value = min;
				printTotalCost();
				return min;
			}
			// init forceTable
			$("td[class='bld']:has(small), td[class='btxt']:has(small), td[class='bld'], td[class='btxt']").each(function(i, td) {
				$(forceTable).each(function(j, force) {	
					if (force.bld == "Храм" && td.innerHTML.search("Храм") != -1) {
						var cult = sessionStorage.getItem("cult");
						if (cult == "атеизм") {
							force.mark = 0;						
						} else if (cult !== null) {
							force.mark = 1;
							if ($(td).find("small").length > 0)
								force.quantity = $(td).find("small").html().match(/\d+/);
							else
								force.quantity = 0;
							force.rc =  td.getAttribute("rc").match(/b\d+/);					
							var religions = [["силы", "9150.gif", [0,0,1,0,2], 15],
												["стремительности", "9160.gif", [0,2,0,0,0], 16],
												["магии", "9170.gif", [0,0,0,2,1], 17],
												["диверсий", "9180.gif", [4,0,0,0,0], 18],
												["лесов", "9190.gif", [0,2,0,0,0], 19]
											];
							$(religions).each(function(k, religion) {
								if (cult == religion[0]) {
									force.z = religion[3];
									force.ico = religion[1];
									force.price = religion[2];
								}
							});
						}
					} else if (td.innerHTML.search(force.bld) != -1 || (j < forceTable.length-1 && td.innerHTML.search(forceTable[j+1].bld) != -1 && forceTable[j+1].lvl == 1)) {
						force.mark = 1;
						if ($(td).find("small").length > 0)
							force.quantity = $(td).find("small").html().match(/\d+/);
						else
							force.quantity = 0;
						force.rc = td.getAttribute("rc").match(/b\d+/);
						force.z = j+1;
					}
				});
			});
			var cell;			
			// init table
			var t = document.createElement("table");
			t.setAttribute("id", "buyforcetable");		
			$(t).dialog({autoOpen: false, width: 600, title: "Найм войск"});
			var button = document.createElement("button");
			$("td[class='bld']:first").parent().parent().parent().parent().append($(button));
			$(button).button({label: "Найм войск"}).click(function() {$("#buyforcetable").dialog("open");});
			for (var i = 0; i < forceTable.length + 1; i++) {
				t.insertRow(0);
				for (var j = 0; j < 7; j++) {
					t.rows[0].insertCell(0);
				}
			}
			var wcBuyForce = localStorage.getItem("wc_buy_force_" + g.cons[5]);
			if (wcBuyForce) {
				wcBuyForce = wcBuyForce.toString().split(",");
			} else {
				wcBuyForce = [];
				$(forceTable).each(function() {
					wcBuyForce.push(1);
				});
				localStorage.setItem("wc_buy_force_" + g.cons[5], wcBuyForce);
			}
			
			$(forceTable).each(function(i, force) {
				if (force.mark == 1) {
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
						localStorage.setItem("wc_buy_force_" + g.cons[5], wcBuyForce);
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
							var target = e.target;
							var min = calcCost(parseInt(target.getAttribute("index"), 10), parseInt(ui.value, 10));
							$(this).spinner("value", min);
							return false;
						}
					});
					
					$(input).keyup(function(e) {
						var target = e.target;
						calcCost(parseInt(target.getAttribute("index"), 10), parseInt(target.value, 10));
					});
					
					// max
					cell = row.cells[cellCounter++];
					var button = document.createElement("button");
					button.setAttribute("index", i);
					button.setAttribute("quantity", quantity);
					cell.appendChild(button);
					$(button).button({label: "max"}).click(function(e) {
						var target = e.target;
						if (navigator.userAgent.search("Chrome") != -1 && target.toString() ==  "[object HTMLSpanElement]") // Chrome bug
							target = target.parentNode;
						calcCost(parseInt(target.getAttribute("index"), 10), parseInt($(target).parent().parent().find("td[name='avalquantity']").html(), 10));
					});
					cell = row.cells[cellCounter++];
					cell.setAttribute("maxprice", "0,0,0,0,0");
					// hire
					cell = row.cells[cellCounter++];
					button = document.createElement("button");
					button.setAttribute("c", force.rc);
					button.setAttribute("z", force.z);
					button.setAttribute("bld", force.bld);
					if (force.lvl == 1)
						t.rows[i-1].cells[cellCounter-1].getElementsByTagName("button")[0].setAttribute("bld", force.bld);	
					$(button).button({label: "Нанять"}).click(function(e) {
						var target = e.target;
						if (target.toString() == "[object HTMLSpanElement]") // Chrome bug
							target = target.parentNode;
						var w = window;
						var quantity = parseInt($(target).parent().parent().find("input[name=quantity]").val(), 10);
						var c = target.getAttribute("c");
						var z = target.getAttribute("z");
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
								// "Казармы<BR><small>(87)</small>",0,0, 
								var m  = data.match(new RegExp(target.getAttribute("bld") + "<BR><small>\\((\\d+)"));							
								if (m)
									quantity = m[1];
								// update avalquantity
								$(target).parent().parent().parent().parent().find(
									"button[bld='" + target.getAttribute("bld") + "']").parent().parent().find("input[name='quantity']").spinner("option", "max", quantity);
								// update max value on spinner
								$(target).parent().parent().parent().parent().find(
									"button[bld='" + target.getAttribute("bld") + "']").parent().parent().find("td[name='avalquantity']").html(quantity);
								// update quantity on max button
								$(target).parent().parent().parent().parent().find(
									"button[bld='" + target.getAttribute("bld") + "']").parent().parent().find("button[index][quantity]").attr("quantity", quantity);
								// update quantity on building
								$("td[class='bld'], td[class='btxt']").each(function(j, td) {
									if (td.innerHTML.search(target.getAttribute("bld")) != -1) {
										$(td).find("small").html("(" + quantity + ")");									
									}
								});
								var srge = data.match(/g\.srge\=(new Array.+);/);
								w.srge = eval(srge[1]);
								w.storg2();
								w.storg1();
								$(target).parent().parent().find("input[name='quantity']").val("");
								$(target).parent().parent().find("td[maxprice]").attr("maxprice", "0,0,0,0,0");
								$(target).parent().parent().find("td[maxprice]").html("");
								printTotalCost();
							}
						});
					}); // click				
					cell.appendChild(button);				
				} // if
			}); // each
			var cellCounter = 0;
			row = t.rows[t.rows.length-1];
			row.deleteCell(0);
			row.deleteCell(0);
			cellCounter = 0;
			cell = row.cells[cellCounter];
			// max & buy all blind
			button = document.createElement("button");
			cell.appendChild(button);
			cell.setAttribute("colspan", 2);
			$(button).button({label: "В тёмную"}).click(function() {
				$("#buyforcetable tr:last td button")[2].click();
				$("#buyforcetable tr:last td button")[3].click();
			});
			// clear all
			button = document.createElement("button");
			row.cells[++cellCounter].appendChild(button);
			row.cells[cellCounter].setAttribute("colspan", 2);
			$(button).button({label: "Очистить"}).click(function() {
				$("#buyforcetable input[name=quantity]").val("");
				$("#buyforcetable td[maxprice]").attr("maxprice", "0,0,0,0,0");
				$("#buyforcetable td[maxprice]").html("");
				$("#buyforcetable #totalCost").attr("totalcost", "0,0,0,0,0");
				$("#buyforcetable #totalCost").html("");
			});
			// max all
			button = document.createElement("button");
			row.cells[++cellCounter].appendChild(button);
			cell = row.cells[++cellCounter];
			$(button).button({label: "max"}).click(function() {
				$("#buyforcetable #totalCost").attr("totalcost", "0,0,0,0,0");
				$("#buyforcetable #totalCost").html("");
				$("#buyforcetable input[type='checkbox']").each(function(i, cb) {
					if (cb.checked) {
						$(cb).parent().parent().find("button[quantity]").click();
					} else {
						$(cb).parent().parent().find("input[name=quantity]").val("");
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
			cellCounter++;
			cell = row.cells[cellCounter];
			cell.appendChild(button);
			$(button).button({label: "Нанять"}).click(function() {
				$("#buyforcetable input[type='checkbox']").each(function(i, cb) {
					if (cb.checked) {
						$(cb).parent().parent().find("button[bld]").click();
					}
				});
					});
			// test rountines
			$(function() {
				return;
				//$("#buyforcetable img[src='it/2254.gif']").parent().next().next().find("input[name='quantity']").val(10);
				//$("#buyforcetable img[src='it/2264.gif']").parent().next().next().find("input[name='quantity']").val(10);
			});
		}
		function addScript(src) {
			var scripts = document.getElementsByTagName("script");
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i].getAttribute("src") == src)
					return;
			}
			var script = document.createElement("script");
			script.src = src;
			document.head.appendChild(script);
		}

		(function addButtons() {		
			if (typeof $ === "undefined") {
				addScript("http://code.jquery.com/jquery-1.9.1.js");
			} else if (typeof $.ui === "undefined") {
				addScript("http://code.jquery.com/ui/1.10.3/jquery-ui.js");
				var link = document.createElement("link");
				link.setAttribute("rel", "stylesheet");
				link.setAttribute("href", "http://warchaosujs.gixx.ru/jquery-ui/css/sunny/jquery-ui-1.10.3.custom.css");
				document.head.appendChild(link);
			}
			
			if (typeof $ === "undefined" || typeof $.ui === "undefined") {
				setTimeout(addButtons, 100);
				return;
			}

			if (sessionStorage.getItem("cult") === null) {
				$.ajax({
					url: "http://warchaos.ru/user/cult",
					type: "POST",
					async: false,
					success: function(data) {
						var m = data.match(/Вами выбрана\:<\/b><br><big><font color=#800000>Религия (.+)<\/font>/);
						if (m) {
							m[1].toLowerCase();
							sessionStorage.setItem("cult", m[1].toLowerCase());
						} else {
							sessionStorage.setItem("cult", "атеизм");
						}
					}
				});
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

