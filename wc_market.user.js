// ==UserScript==
// @name           Warchaos Market
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Like WC Pro market but with some additional options
// @include        http://warchaos.ru/f/a
// @match          http://warchaos.ru/f/a
// ==/UserScript==

(function () {
	function source() {
		function l() {
			var t = "";
			for (var i = 0; i < arguments.length; i++)
				t += arguments[i] + ' ';
			if (navigator.appName == "Opera")
				opera.postError(new Date().toTimeString() + ": " + t);
		}

		function removeElement(el) {
			el.parentNode.removeChild(el);
		}

		/**
		 * Description: search tables with specified class name
		 * Return: array of tables
		 */
		function getTablesByClassName(className) {
			var result = new Array();
			var tables = document.getElementsByTagName('table');
			for (i = 0; i < tables.length; i++)
				if (tables[i].hasAttribute('class') && tables[i].getAttribute('class') == className) {
					result.push(tables[i]);
				}
			return result;
		}

		function insertAfter(el1,el2) {
			if (!el2.parentNode)return;
			if (el2.nextSibling)
				el2.parentNode.insertBefore(el1,el2.nextSibling);
			else
				el2.parentNode.appendChild(el1);
		}

		function getWindowObject() {
			return window;
		}
		/**
		*
		*/
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

		function dummy() {l(arguments);};

		var allMarkets = new Array();
		/** lastResName contain name of last pressed span e.g. Все, Ресурсы, Войска etc. */
		var lastResName = ""; // I don`t think user wants to print all markets after preference change
		function getBlockName(resName) {
			var blocks = ["Древесина","Ресурсы","Поселенцы", "Артефакты", "Зелье здоровья", "Зелья",
							"Благословение", "Свитки", "Ополченцы", "Войска", "Рецепт: Благословение",
							"Рецепты", "Руна силы", "Руны",]
			for (var i = 0; i < blocks.length; i++) {
				if (resName == blocks[i]) {
					return blocks[i+1];
				}
			}
			return null;
		}

		var goodsList = [
				"Древесина", "Камень", "Металл",  "Папоротник", "Кровь орков", "Щупальца кракена", "Чешуя дракона", "Мандрагора", "Белый жемчуг", "Черный жемчуг", "Красный жемчуг", "Древняя пыль", "Новогодняя шишка", "Домовые",
				"Поселенцы", "Письмо", "Подзорная труба", "Сокол", "Молодильное яблочко", "Спиритический шлем", "Шапка-невидимка", "Молот силы", "Короткий меч", "Посох патриарха", "Дубинка орков", "Разрывчатый лук", "Меч-самосек", "Булава", "Меч инквизитора", "Деревянный щит", "Кожаная броня", "Золотая броня", "Сапоги-скороходы", "Сапоги", "Амулет", "Зубы орка", "Роза", "Плеть Креспа",
				"Зелье здоровья",  "Спринт", "Лесной дух", "Личная защита", "Зелье ловкости", "Анти-ослепление", "Анти-забывчивость", "Анти-ослабление", "Узы смерти",
				"Благословение",  "Куст терновника", "Радуга", "Проклятие", "Огненная стена", "Суперсенсинг", "Дождь", "Слабость", "Паутина", "Отражение", "Маскировка", "Рассеивание", "Забывчивость", "Вихрь", "Пентаграмма", "Перемирие", "Очищение", "Ослепление", "Обездвиживание", "Портал", "Отмена	",
				"Ополченцы", "Пикинеры", "Лучники", "Арбалетчики", "Мечники", "Кнехты", "Разведчики", "Рыцари", "Маги", "Элефанты", "Кочевники", "Джинны", "Ассасины", "Эльфы",
				"Рецепт: Благословение", "Рецепт: Куст терновника", "Рецепт: Радуга", "Рецепт: Проклятие", "Рецепт: Огненная стена", "Рецепт: Суперсенсинг", "Рецепт: Дождь", "Рецепт: Слабость", "Рецепт: Паутина", "Рецепт: Отражение", "Рецепт: Маскировка", "Рецепт: Рассеивание", "Рецепт: Забывчивость", "Рецепт: Вихрь", "Рецепт: Пентаграмма", "Рецепт: Ослепление", "Рецепт: Подзорная труба", "Рецепт: Сокол", "Рецепт: Спиритический шлем", "Рецепт: Молот силы", "Рецепт: Короткий меч", "Рецепт: Посох патриарха", "Рецепт: Дубинка орков", "Рецепт: Разрывчатый лук", "Рецепт: Меч-самосек", "Рецепт: Булава", "Рецепт: Деревянный щит", "Рецепт: Кожаная броня", "Рецепт: Золотая броня", "Рецепт: Сапоги", "Рецепт: Зубы орка",
				"Руна силы", "Руна цели", "Руна жизни", "Руна стойкости", "Руна времени", "Руна мистицизма",

			]

		// addEventListener('load', function () {addCalcCost(document.getElementsByTagName("input"))}, false);

		function addCalcCost(inputs) {
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].type == "text") {
					var span = document.createElement("span");
					insertAfter(span, inputs[i]);
					// insertAfter(span, document.createElement("br"));
					span.innerHTML = '<img border="0" src="it/204.gif" width="20" height="15" align="absmiddle" tooltip="Золотые">0';
					function calcCost(input) {
						if (input.parentNode.parentNode.parentNode.parentNode.rows[0].cells[0].childNodes[1].data.match(/Покупка$/) == null) {
								var cost = input.previousSibling.previousSibling.data.match(/\d*\.\d*/);
								var discount = input.parentNode.parentNode.parentNode.parentNode.nextSibling.getElementsByTagName("font")[0].childNodes[0].data.match(/\d+/);
								discount = discount ? 1 - discount/100 : "1";
								var cb = input.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.childNodes[2];
								var express = 0;
								if (cb.checked) {
									express = cb.nextSibling.data.match(/\d+\.*\d*/) * input.value;
									if (express < cb.nextSibling.nextSibling.nextSibling.data.match(/\d+/)) {
										express = cb.nextSibling.nextSibling.nextSibling.data.match(/\d+/);
									}
								}
								input.nextSibling.childNodes[1].data = Math.ceil((cost * input.value) * discount + Number(express));
							} else {
								var cost = input.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.data.match(/\d*\.\d*/);
								input.nextSibling.childNodes[1].data = Math.ceil(cost * input.value);
							}
					}
					inputs[i].addEventListener("keyup", function (e) {calcCost(e.target);}, false);
					if (inputs[i].nextSibling.nextSibling != null)
						inputs[i].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.childNodes[2].addEventListener("click", function (e) {
							calcCost(e.target.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling);
						}, false);
				}
			}
		}

		function getIndexInGoodsList(goodName) {
			for (var i = 0; i < goodsList.length; i++) {
				if (goodsList[i] == goodName)
					return i;
			}
			return -1;
		}

		function clearDisplayedMarkets() {
			var rw = getTablesByClassName("rw");
			for (var i = 2; i < rw.length - 1; i++) {
				removeElement(rw[i]);
			}
		}

		function createSpanLooksLikeLink(resName) {
			var span = document.createElement("SPAN");
			span.setAttribute("class", "slnk");
			span.setAttribute("style", "color:#31004A");
			span.innerHTML = resName;
			span.addEventListener("click", function (e) {
					lastResName = e.target.innerHTML;
					printListOfMarketsWithChoosenResource(resName);
				}, false);
			return span;
		}

		function checkResNameAndIcoNum(resName, icoNum) {
			if ((resName == 'Все')
				|| (resName == 'Древесина' && parseInt(icoNum) == 214)
				|| (resName == 'Камень' && parseInt(icoNum) == 234)
				|| (resName == 'Металл' && parseInt(icoNum) == 224)
				|| (resName == 'Ресурсы' && parseInt(icoNum) >= 244 && parseInt(icoNum) <= 474)
				|| (resName == 'Артефакты' && parseInt(icoNum) >= 504 && parseInt(icoNum) <= 1214)
				|| (resName == 'Зелья' && parseInt(icoNum) >= 24 && parseInt(icoNum) <= 114)
				|| (resName == 'Свитки' && parseInt(icoNum) >= 1934 && parseInt(icoNum) <= 2204)
				|| (resName == 'Войска' && parseInt(icoNum) >= 2254 && parseInt(icoNum) <= 2474)
				|| (resName == 'Рецепты' && parseInt(icoNum) == 1914)
				|| (resName == 'Руны' && parseInt(icoNum) >= 1504 && parseInt(icoNum) <= 1764)) {
					return true;
			}
			return false;
		}

		var alliesList = new Array();

		function makeAlliesList() {
			ajaxRequest("http://warchaos.ru/user/game/", "GET", [], function (t, args) {
				var m = t.responseText.match(/Мирные договоры\:<\/b><\/font><br><table class=xtabl>(.*)<\/table>/);
				var t = document.createElement("table");
				t.innerHTML = m[1];
				var a = t.getElementsByTagName("a");
				for (var i = 0; i < a.length; i++) {
					alliesList.push(a[i].innerHTML);
				}
			}, dummy, []);
		}


		function printListOfMarketsWithChoosenResource(resName) {
			var w = getWindowObject();
			if (resName == "")  // in case of lastResName == ""
				return;
			clearDisplayedMarkets();
			if (allMarkets.length == 0) {
				var w = getWindowObject();
				w.help1 = "Рынок";
				w.help2 = "<div id=\"progbar\">Идёт скачивание...</div>";
				w.ShowWin();
				downloadAllMarkets(0, resName);
			}
			var marketsToPrint = new Array();
			for (var i = 0; i < allMarkets.length; i++) {
				if (allMarkets[i] != null) {
					var t = document.createElement("table");
					t.setAttribute("class", "rw");
					t.setAttribute("cellpadding", "3");
					t.setAttribute("cellspacing", "0");
					t.innerHTML = allMarkets[i].innerHTML;
					var m = t.getElementsByTagName("button")[0].getAttribute("onclick").match(/(\d+),(\d+),(\d+),(\d+)/)[0];
					t.getElementsByTagName("button")[0].setAttribute("cm", m);
					t.getElementsByTagName("button")[0].setAttribute("onclick", "return false;");
					t.getElementsByTagName("button")[0].addEventListener("click", function (e) {
						var m = e.target.getAttribute("cm").match(/(\d+),(\d+),(\d+),(\d+)/);
						var w = getWindowObject();
						w.help1 = "Лавка";
						w.help2 = "Загрузка лавки...";
						w.ShowWin();
						ajaxRequest("http://warchaos.ru/f/a", "POST", "a="+w.mobjects[w.obja+5]+"&b="+w.mobjects[0]
							+"&c="+w.subb+"&d="+m[1]+"&x="+m[2]+"&y="+m[3]+"&z="+m[4], function (t, cm) {
								var m = t.responseText.split('\";\ng.underleft=\"')[0];
								m = m.split('\";\ng.upblock+=\"');
								var w = getWindowObject();
								w.help1 = "Лавка";
								w.help2 = "";
								for (var i = 2; i < m.length; i++) {
									w.help2 += m[i];
								}								
								var Wlt = w.Wlt('i29');
								w.help2 = w.help2.replace('"+Wlt(\'i29\')+"', Wlt);
								w.help2 = w.help2.replace('input type=submit', 'input type=button id=buysellbutton');
								w.ShowWin();
								if (document.getElementById("buysellbutton") == null) {
									return;
								}
								var cells = document.getElementById("buysellbutton").parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.previousSibling.rows[1].cells;
								for (var i = cells.length - 1; i >= 0; i--) {
									if (cells[i].getElementsByTagName("span")[0]) {
										if (cells[i].getElementsByTagName("span")[0].getAttribute("tooltip") != e.target.parentNode.parentNode.cells[0].innerHTML)
											removeElement(cells[i]);
									} else
										removeElement(cells[i]);
								}
								var inputs = document.getElementById("tipwin").getElementsByTagName("table")[0].rows[0].cells[0].getElementsByTagName("table")[1].rows[0].cells[0].getElementsByTagName("form")[0].getElementsByTagName("input");
								addCalcCost(inputs);
								document.getElementById("buysellbutton").setAttribute("cm", cm);
								document.getElementById("buysellbutton").addEventListener("click", function (e) {
									e.target.disabled = true;
									var resName = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.previousSibling.rows[1].cells[0].childNodes[0].getAttribute("tooltip");
									var form = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
									var req = "";
									var inputs = form.getElementsByTagName("input");
									for (var i = 0; i < inputs.length; i++) {
										if (inputs[i].type == "hidden") {
											if (i == 0)
												req += inputs[i].name + '=' + inputs[i].value;
											else
												req += '&' + inputs[i].name + '=' + inputs[i].value;
										} else if (inputs[i].type == "text" && Number(inputs[i].value) > 0)
											req += '&' + inputs[i].name + '=' + Number(inputs[i].value);
										else if (inputs[i].type == "checkbox" && inputs[i].checked == true)
											req += '&' + inputs[i].name + '=' + '1';
									}
									var select = document.getElementsByName("i29")[0];
									req += '&i29=' + select.options[select.selectedIndex].value;
									// a=2015&b=0&c=b8&d=555&e=989036992&x=104&y=164&z=2193&i3=1&i29=2015
									ajaxRequest("http://warchaos.ru/f/a", "POST", req, function (t, args) {
										var cm = args[0];
										var resName = args[1];
										var m = t.responseText.match(/g\.rtxt\+="([^"]+)";/);
										document.getElementById("tipwin").getElementsByTagName("table")[0].rows[0].cells[0].getElementsByTagName("table")[1].rows[0].cells[0].innerHTML = m[1];
										m = t.responseText.split("\";\ng.nextpage\=");
										var markets = m[0].split('\";\ng.upblock+=\"');
										for (var j = 2; j < markets.length; j++) {
											if (markets[j].search(cm) != -1) {
												var t = document.createElement("table");
												t.setAttribute("class", "rw");
												t.setAttribute("cellpadding", "3");
												t.setAttribute("cellspacing", "0");
												t.innerHTML = markets[j].match(/<table [^>]+>(.*)<\/table>/)[1];
												for (var i = 0; i < allMarkets.length; i++) {
													if (allMarkets[i].getElementsByTagName("button")[0].getAttribute("onclick").search(cm) != -1 && 
															allMarkets[i].rows[0].cells[0].innerHTML == resName) {
														for (var k = 0; k < t.rows[1].cells.length; k++) {
															l(k, t.rows[1].innerHTML);
															// try...
															if (t.rows[1].hasChildNodes()
																	&& t.rows[1].cells[k].childNodes.length > 0
																	&& t.rows[1].cells[k].childNodes[0].hasAttribute("tooltip")
																	&& t.rows[1].cells[k].childNodes[0].getAttribute("tooltip") == resName
																	&& t.rows[1].cells[k].childNodes[0].childNodes[t.rows[1].cells[k].childNodes[0].childNodes.length - 1].nodeName == "#text") {
																allMarkets[i].rows[0].cells[3].innerHTML = t.rows[1].cells[k].childNodes[0].childNodes[t.rows[1].cells[k].childNodes[0].childNodes.length - 1].data;
																printListOfMarketsWithChoosenResource(lastResName);
																return;
															}
														}
														// not found...
														
														allMarkets.splice(i,1);
														printListOfMarketsWithChoosenResource(lastResName);
														return;
													}
												}
											}
										}
									}, dummy, [e.target.getAttribute("cm"), resName]);
								}, false);
							}, dummy, e.target.getAttribute("cm"));

					}, false);

					var wc_market_options = w.localStorage.getItem("wc_market_options");
					if (wc_market_options == null) {
						wc_market_options = new Array();
						for (var i = 0; i < goodsList.length; i++) {
							wc_market_options[i] = '1';
						}
						w.localStorage.setItem("wc_market_options", wc_market_options);
					} else
						wc_market_options = wc_market_options.toString().split(',');
					// filter
					var icoNum = parseInt(t.rows[0].cells[0].getAttribute("icoNum"));
					if (checkResNameAndIcoNum(resName, icoNum)) {
						var index = getIndexInGoodsList(t.rows[0].cells[0].innerHTML.match(/^( *[А-Яа-я:-])*/)[0]);
						if (index != -1 && wc_market_options[index] != 0) {
							if (getTablesByClassName("rw").length == 3)
								insertAfter(t, getTablesByClassName("rw")[1]);
							else
								insertAfter(t, getTablesByClassName("rw")[getTablesByClassName("rw").length - 2]);
						}
					}
				}
			}
		}
		var regDistance = /\((\d+)\)/;
		var regResName = /([А-Яа-я: ]+)(?:[x0-9IVSLFCRr ]+|)\$/;
		
		function addMarketByName(market) {
			var mPrice = parseFloat(market.rows[0].cells[1].innerHTML);
			if (mPrice < 1 && isBuyPage())
				return;
			if (allMarkets.length == 0) {
				allMarkets.push(market);
				return;
			}
			for (var i = 0; i < allMarkets.length; i++) {
				if (market.rows[0].cells[0].innerHTML.match(regResName)[1] < allMarkets[i].rows[0].cells[0].innerHTML.match(regResName)[1]) {
					allMarkets.splice(i, 0, market);
					return;
				} else if (market.rows[0].cells[0].innerHTML.match(regResName)[1] == allMarkets[i].rows[0].cells[0].innerHTML.match(regResName)[1]) {
					
					var miPrice = parseFloat(allMarkets[i].rows[0].cells[1].innerHTML);
					if (!isBuyPage()) {
						if (mPrice < miPrice) {
							allMarkets.splice(i, 0, market);
							return;
						} else if (mPrice == miPrice) {
							var mDistance = parseInt(market.rows[0].cells[2].innerHTML.match(regDistance)[1]);
							var miDistance = parseInt(allMarkets[i].rows[0].cells[2].innerHTML.match(regDistance)[1]);
							if (mDistance <= miDistance) {
								allMarkets.splice(i, 0, market);
								return;
							}
						}
					} else if (mPrice > miPrice && isBuyPage()) {
						allMarkets.splice(i, 0, market);
						return;
					}
				}
			}
			allMarkets.push(market);
		}
		
		/**
		 * Desc: divide market so every market had only one good
		 */		
		function parseMarket(market) {
			while (market.rows[1].cells.length > 2) {
				var t = document.createElement("table");
				t.setAttribute("class", "rw");
				t.setAttribute("cellpadding", "3");
				t.setAttribute("cellspacing", "0");
				t.innerHTML = market.innerHTML;
				while (t.rows[1].cells.length > 2) {
					t.rows[1].deleteCell(t.rows[1].cells.length - 1);
				}
				reorderCellsInMarket(t);
				market.rows[1].deleteCell(0);
				market.rows[1].deleteCell(0);
			}
			reorderCellsInMarket(market);
		}
		
		function reorderCellsInMarket(market) {
			var m = market.rows[1].cells[0].childNodes[0].getAttribute("tooltip").match(/x(\d+)\$/);
			if (m) {
				var totalPrice = parseFloat(market.rows[1].cells[1].innerHTML);
				var pricePerItem =  parseInt(totalPrice / m[1]);
				market.rows[1].cells[1].innerHTML = pricePerItem + "(" + totalPrice + ")";
			}
			market.rows[0].insertCell(0);
			market.rows[0].cells[0].appendChild(document.createTextNode(market.rows[1].cells[0].childNodes[0].getAttribute("tooltip")));
			market.rows[0].cells[0].setAttribute("icoNum", market.rows[1].getElementsByTagName("img")[0].getAttribute("src").match(/(\d+)/)[1]);
			
			market.rows[0].insertCell(1);
			market.rows[0].cells[1].appendChild(document.createTextNode(market.rows[1].cells[1].innerHTML));
			
			market.rows[0].insertCell(3);
			// /*
			if (market.rows[1].cells[0].getElementsByTagName("span")[0].childNodes[
					market.rows[1].cells[0].getElementsByTagName("span")[0].childNodes.length - 1].nodeName == "#text") {
				market.rows[0].cells[3].appendChild(market.rows[1].cells[0].getElementsByTagName("span")[0].childNodes[market.rows[1].cells[0].getElementsByTagName("span")[0].childNodes.length - 1]);
			}
			// */
			market.rows[0].insertCell(4);
			market.rows[0].cells[4].appendChild(market.rows[0].cells[2].getElementsByTagName("a")[0]);
			removeElement(market.rows[0].cells[2].childNodes[0]);
			market.rows[0].cells[2].childNodes[0].innerHTML = market.rows[0].cells[2].childNodes[0].innerHTML.replace("Доставка: ", "");
			market.rows[0].cells[2].childNodes[0].innerHTML = market.rows[0].cells[2].childNodes[0].innerHTML.replace(" кл.", "");
			
			market.deleteRow(1);
			// /*
			market.rows[0].cells[0].setAttribute("width", "25%");
			market.rows[0].cells[1].setAttribute("width", "5%");
			market.rows[0].cells[2].setAttribute("width", "12%");
			
			market.rows[0].cells[2].setAttribute("colspan", "");
			market.rows[0].cells[3].setAttribute("width", "12%");
			market.rows[0].cells[4].setAttribute("width", "10%");
			market.rows[0].cells[4].setAttribute("align", "right");
			market.rows[0].cells[5].setAttribute("width", "15%");
			market.rows[0].cells[5].setAttribute("colspan", "");
			// */
			addMarketByName(market);
		}
		
		/**
		 * Desc: download all markets except markets with alliance tag
		 */
		function downloadAllMarkets(nextpage, resName) {
			clearDisplayedMarkets();
			var w = getWindowObject();
			w.help1 = "";
			w.help2 = "";
			ajaxRequest("http://warchaos.ru/f/a", "POST", "a="+w.mobjects[w.obja+5]+"&b="+w.mobjects[0]
						+"&c="+w.subb+"&d=0"+"&e="+''+"&x="+w.g.rpa[5]+"&y=0"+"&z=" + nextpage ,
						function (t) {
							var m = t.responseText.split("\";\ng.nextpage\=");
							var nextpage = parseInt(m[1]);
							var markets = m[0].split('\";\ng.upblock+=\"');
							outerloop:
							for (var j = 2; j < markets.length; j++) {
								if (markets[j].search(">Дерево<") != -1)  //skip WC Pro toolbar
									continue;
								var t = document.createElement("table");
								t.setAttribute("class", "rw");
								t.setAttribute("cellpadding", "3");
								t.setAttribute("cellspacing", "0");
								t.innerHTML = markets[j].match(/<table [^>]+>(.*)<\/table>/)[1];
								//WCBUG: there are can be empty market
								if (!t.rows[1].cells[0].hasAttribute("align"))
									continue;								
								// remove market name
								var fonts = t.getElementsByTagName("font");
								for (var k = 0; k < fonts.length; k++) {
									if (fonts[k].getAttribute("color") == "#A00000") {
										fonts[k].removeChild(fonts[k].childNodes[0]);
										removeElement(fonts[k]);
										break;
									}
								}
								if (t.rows[0].cells[0].childNodes[0].nodeName == "#text") {
									removeElement(t.rows[0].cells[0].childNodes[0]);
								}
								// remove town name
								var a = t.getElementsByTagName("a")[0].nextSibling;
								a.nextSibling.parentNode.removeChild(a.nextSibling);
								a.nextSibling.parentNode.removeChild(a.nextSibling);
								// remove empty cells
								for (var i = t.rows[1].cells.length - 1; i > 1; i--) {
									if (!t.rows[1].cells[i].hasAttribute("align")) {
										t.rows[1].deleteCell(i);
									}
								}
								// delete markets with alliance tag
								if (t.innerHTML.search("#FFFF00") == -1) {
									parseMarket(t);
									// hlp(405,2015,0,11796,2)
								} else {
									for (var i = 0; i < alliesList.length; i++) {
										if (alliesList[i] == t.getElementsByTagName("a")[0].innerHTML) {
											parseMarket(t);
											break;
										}
									}
								}
							}
							var pb = document.getElementById("progbar");
							if (nextpage == 0) {
								pb.innerHTML += 'Готово';
								setTimeout("HideWin()", 1000);
								printListOfMarketsWithChoosenResource(resName);
							} else {
								pb.innerHTML += '.';
								downloadAllMarkets(nextpage, resName);
							}
						}
						, dummy);
		}

		
		
		var buyPage = -1;
		function isBuyPage() {
			if (getTablesByClassName("rw")[2].rows[0].cells[0].innerHTML.search("<font color=\"#800000\">Покупка") == -1 && buyPage == -1)
				buyPage = false;
			else if (buyPage == -1)
				buyPage = true;
			return buyPage;
		}

		/**
		 * check: if resources on your market are set for free and clan/alliance check is set
		 */
		function addCheck() {
			var inputs = document.getElementsByTagName("input");
			if (inputs) {
				for (var i = 0; i < inputs.length; i++) {
					if (inputs[i].hasAttribute("value") && inputs[i].getAttribute("value") =="Установить") {
						inputs[i].addEventListener("click", function(e) {
							var t = e.target.parentNode.parentNode.parentNode.parentNode;
							var checked = false;
							var inputs = t.getElementsByTagName("input");
							for (var j = 0; j < inputs.length; j++) {
								if (inputs[j].getAttribute("type") == "checkbox" && inputs[j].checked) {
									return;
								}
							}
							var priceInputs = t.previousSibling.getElementsByTagName("input");
							if (priceInputs) {
								for (var j = 0; j < priceInputs.length; j++) {
									if (priceInputs[j].value == "0.01") {
										alert("Вы установили на один или более товаров цену 0.01 и не установили галки для союзников или сокланов");
										return;
									}
								}
							}
						}, false);
						break;
					}
				}
			}
		}

		(function wcMarket() {
			var resources = ["Все", "Древесина", "Камень", "Металл", "Ресурсы", "Артефакты", "Зелья", "Свитки", "Войска", "Рецепты", "Руны",]
			var w = getWindowObject();
			if (!w.g || !w.g.rpa)
				return;
			if (w.g.rpa[5] == 0) {
				addCheck();
			}
			if ((w.g == null || w.g.rpa==null)
					|| (w.g.rpa[5] != 1 && w.g.rpa[5] != 6 && w.g.rpa[5] != 4)) //sell, buy, clan markets
				return;

			var tables = document.getElementsByTagName('table');

			var rwh = getTablesByClassName("rwh");
			if (rwh) {
				if (rwh[0] && rwh[0].innerHTML.search("Рынок") != -1) {
					var sellButton = document.getElementsByTagName("button")[0];
					if (sellButton) {
						isBuyPage();
						makeAlliesList();
						// add resource line
						var t = document.createElement("table");
						insertAfter(t, sellButton.parentNode.parentNode.parentNode.parentNode);
						t.setAttribute("class", "rw");
						t.setAttribute("cellpadding", "3");
						t.setAttribute("cellspacing", "0");
						t.insertRow(0);
						t.rows[0].insertCell(0);
						t.rows[0].cells[0].setAttribute("align","center");
						for (var j = 0; j < resources.length; j++) {
							t.rows[0].cells[0].appendChild(createSpanLooksLikeLink(resources[j]));
							if (j != resources.length - 1)
								t.rows[0].cells[0].appendChild(document.createTextNode("| "));
						}

						//Options button
						var b = document.createElement("button");
						insertAfter(b, document.getElementsByTagName("button")[1]);
						// b.parentNode.setAttribute("width", "60%");
						b.setAttribute("class", "cmb");
						b.setAttribute("style", "width:80px;");
						b.innerHTML = "Настройки";
						b.addEventListener("click", function () {
							var w = getWindowObject();
							var wc_market_options = w.localStorage.getItem("wc_market_options");
							if (wc_market_options == null) {
								wc_market_options = new Array();
								for (var i = 0; i < goodsList.length; i++) {
									wc_market_options[i] = '1';
								}
								w.localStorage.setItem("wc_market_options", wc_market_options);
							} else
								wc_market_options = wc_market_options.toString().split(',');
							w.help1 = "Настройки";
							w.help2 = "<div id='wc_market_options'></div>";
							w.ShowWin();

							var t = document.createElement("table");
							t.setAttribute("style", "color:black; font-size:12px; width:1100px;");
							for (var i = 0; i < 40; i++) {
								t.insertRow(i);
								for (var j = 0; j < 20; j++) {
									if (i == 0)
										t.rows[i].appendChild(document.createElement("th"));
									else
										t.rows[i].insertCell(j);
								}
							}
							var columns = -2;
							var row = 0;
							for (var i = 0; i < goodsList.length; i++, row++) {
								if (getBlockName(goodsList[i]) != null) {
									columns += 2;
									row = 0;
									t.rows[0].cells[columns].innerHTML = getBlockName(goodsList[i]);
									row++;
								}
								t.rows[row].cells[columns].innerHTML = goodsList[i];
								var cb = document.createElement("input");
								cb.setAttribute("type", "checkbox");
								cb.setAttribute("id", "cb" + i);
								t.rows[row].cells[columns + 1].appendChild(cb);
								if (wc_market_options[i] == 1) {
									cb.checked = true;
								} else {
									cb.checked = false;
								}
							}

							// Save button
							var b = document.createElement("button");
							t.insertRow(t.rows.length).insertCell(0).appendChild(b);
							b.setAttribute("class", "cmb");
							b.setAttribute("style", "height:30px;");
							b.innerHTML = "Сохранить и Выйти";
							b.addEventListener("click", function (e) {
								var w = getWindowObject();
								var wc_market_options = new Array();
								for (var i = 0; i < goodsList.length; i++) {
									var cb = document.getElementById("cb" + i);
									if (cb) {
										if (cb.checked == true) {
											wc_market_options[i] = '1';
										} else {
											wc_market_options[i] = '0';
										}
									}
								}

								w.localStorage.setItem("wc_market_options", wc_market_options);
								var w = getWindowObject();
								w.HideWin();
								printListOfMarketsWithChoosenResource(lastResName);
							}, false);
							//Select All
							b = document.createElement("button");
							b.setAttribute("class", "cmb");
							b.setAttribute("style", "height:30px;");
							t.rows[t.rows.length - 1].insertCell(1);
							t.rows[t.rows.length - 1].insertCell(2).appendChild(b);
							b.setAttribute("class", "cmb");
							b.innerHTML = "Выделить всё";
							b.addEventListener("click", function (e) {
								var cbs = e.target.parentNode.parentNode.parentNode.getElementsByTagName("input");
								for (var i = 0; i < cbs.length; i++) {
									cbs[i].checked = true;
								}
							}, false);
							//Clear All
							b = document.createElement("button");
							b.setAttribute("class", "cmb");
							b.setAttribute("style", "height:30px;");
							t.rows[t.rows.length - 1].insertCell(3);
							t.rows[t.rows.length - 1].insertCell(4).appendChild(b);
							b.setAttribute("class", "cmb");
							b.innerHTML = "Очистить всё";
							b.addEventListener("click", function (e) {
								var cbs = e.target.parentNode.parentNode.parentNode.getElementsByTagName("input");
								for (var i = 0; i < cbs.length; i++) {
									cbs[i].checked = false;
								}
							}, false);

							var optionsDiv = document.getElementById("wc_market_options");
							optionsDiv.appendChild(t);
						}, false);

					}
				}
			}
		})();
	}
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
})();