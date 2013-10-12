// ==UserScript==
// @name           Warchaos Market
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Like WC Pro market but with some additional options
// @match          http://warchaos.ru/f/a
// @version        1.0
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_market.user.js
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
			else
				console.log(new Date.toTimeString() + ": " + t);
		}

		function removeElement(el) {
			el.parentNode.removeChild(el);
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
		/** lastResType contain name of last pressed span e.g. Все, Ресурсы, Войска etc. */
		var lastResType = ""; // I don`t think user wants to print all markets after preference change
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

		function addCalcCost() {
			var inputs = $("input[type='text'][class='itxt']");
			for (var i = 0; i < inputs.length; i++) {
				var span = document.createElement("span");
				insertAfter(span, inputs[i]);
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

		function clearDisplayedMarkets() {
			$("#markets>*").remove();
			$("#tmarkets tr").each(function(i, tr) {
				if (i > 0)
					$(tr).remove();
			});
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


		function printListOfMarketsWithChoosenResource(resType) {
			var w = getWindowObject();
			if (resType == "")  // in case of lastResType == ""
				return;
			clearDisplayedMarkets();
			if (allMarkets.length == 0) {
				var w = getWindowObject();
				w.help1 = "Рынок";
				w.help2 = "<div id=\"progbar\">Идёт скачивание...</div>";
				w.ShowWin();
				downloadAllMarkets(0, resType);
			} else {
				for (var i = 0; i < allMarkets.length; i++) {
					if (allMarkets[i] != null) {
						var tmarkets = document.getElementById("tmarkets");
						var t = document.createElement("table");
						t.innerHTML = allMarkets[i].innerHTML;			
						t.rows[0].cells[0].getElementsByTagName("span")[0].addEventListener("click", function (e) {
							var m = e.target.getAttribute("cm").split(",");
							var w = getWindowObject();
							w.help1 = "Лавка";
							w.help2 = "Загрузка лавки...";
							w.ShowWin();
							
							// market loading
							ajaxRequest("http://warchaos.ru/f/a", "POST", "a="+w.mobjects[w.obja+5]+"&b="+w.mobjects[0]
								+"&c="+w.subb+"&d="+m[0]+"&x="+m[1]+"&y="+m[2]+"&z="+m[3], function (t, args) {									
									var cm = args[0];
									var tooltip = args[1];
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
									
									$("#tipwin td[width='16%'][align='center']").remove(); // !!!
									$("span[class='tlnx'][onclick][tooltip!='"+e.target.parentNode.getAttribute("tooltip")+"']").parent().remove();
									//console.log($("#tipwin table[class='rw3'] tbody tr td[valign='top']").length);
									if ($("td[valign='top']").length == 0 || $("#tipwin table[class='rw3'] tbody tr td[valign='top']").length == 0 ) {
										$(allMarkets).each(function(i, market) {
											if (market.innerHTML.search(e.target.parentNode.getAttribute("tooltip")) == -1) {
												allMarkets[i] = null;
												printListOfMarketsWithChoosenResource(lastResType);
												return;
											}
										});
									}
									if (document.getElementById("buysellbutton") == null) {
										return;
									}
									addCalcCost();
									document.getElementById("buysellbutton").setAttribute("cm", cm);
									document.getElementById("buysellbutton").addEventListener("click", function (e) {
										e.target.disabled = true;
										var tooltip = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.previousSibling.rows[1].cells[0].childNodes[0].getAttribute("tooltip");
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
										// sell/buy request
										// a=2015&b=0&c=b8&d=555&e=989036992&x=104&y=164&z=2193&i3=1&i29=2015
										ajaxRequest("http://warchaos.ru/f/a", "POST", req, function (t, args) {
											var srge = t.responseText.match(/g\.srge\=(new Array.+);/);
											w.srge = eval(srge[1]);
											w.storg2();
											w.storg1();
											var cm = args[0];
											var tooltip = args[1];
											var m = t.responseText.match(/g\.rtxt\+="([^"]+)";/);
											// print transfer result in window
											document.getElementById("tipwin").getElementsByTagName("table")[0].rows[0].cells[0].getElementsByTagName("table")[1].rows[0].cells[0].innerHTML = m[1];
											m = t.responseText.split("\";\ng.nextpage\=");
											var markets = m[0].split('\";\ng.upblock+=\"');
											for (var j = 2; j < markets.length; j++) {
												if (markets[j].search(cm) != -1) {
													var t = document.createElement("table");
													t.innerHTML = markets[j].match(/<table [^>]+>(.*)<\/table>/)[1];
													for (var i = 0; i < allMarkets.length; i++) {
														if (allMarkets[i].rows[0].cells[0].getElementsByTagName("span")[0].getAttribute("cm") == cm &&
																allMarkets[i].rows[0].cells[0].getAttribute("tooltip") == tooltip) {
															for (var k = 0; k < t.rows[1].cells.length; k+=2) {
																if (t.rows[1].cells[k].getElementsByTagName("span").length > 0
																	&& t.rows[1].cells[k].getElementsByTagName("span")[0].getAttribute("tooltip") == tooltip) {
																	// update quantity
																	allMarkets[i].rows[0].cells[0].childNodes[
																		allMarkets[i].rows[0].cells[0].childNodes.length - 1].data
																		= t.rows[1].cells[k].childNodes[0].childNodes[
																			t.rows[1].cells[k].childNodes[0].childNodes.length - 1].data;
																	printListOfMarketsWithChoosenResource(lastResType);
																	return;
																}
															}
															// not found
															allMarkets.splice(i,1);
															printListOfMarketsWithChoosenResource(lastResType);
															return;
														}
													}
												}
											}
										}, dummy, [e.target.getAttribute("cm"), tooltip]); // ajax for sell/buy request
									}, false); // handler buy/sell request
									$("table[class='rw3'][style*='ctrl/bg_5.gif']").attr("style", "background:url('ctrl/bg_5.gif');width:98%;");
							}, dummy, [e.target.getAttribute("cm"), e.target.parentNode.getAttribute("tooltip")]); // ajax for market loading
							
						}, false); // handler for market click
						displayMarket(t, resType);
					}// if
				} // for
				// _.each(_.groupBy(allMarkets, function(a) {return a.rows[0].cells[0].innerHTML.match(regResName)[1];}), function(set) {
					// _.each(_.toArray(set), function(market) {
						// displayMarket(market, lastResType);
					// });
					// if ($("#markets").children().last().html() != "")
						// $("#markets").append("<hr>");
				// });
			}
			
		}


		function displayMarket(market, resType) {
			var w = getWindowObject();
			var wc_market_options = window.localStorage.getItem("wc_market_options");
			if (wc_market_options == null) {
				wc_market_options = new Array();
				for (var i = 0; i < goodsList.length; i++) {
					wc_market_options[i] = '1';
				}
				w.localStorage.setItem("wc_market_options", wc_market_options);
			} else
				wc_market_options = wc_market_options.toString().split(',');
			// filter
			var icoNum = parseInt(market.rows[0].cells[0].getAttribute("icoNum"));
			if ((resType == 'Все')
				|| (resType == 'Древесина' && icoNum == 214)
				|| (resType == 'Камень' && icoNum == 234)
				|| (resType == 'Металл' && icoNum == 224)
				|| (resType == 'Ресурсы' && icoNum >= 244 && icoNum <= 474)
				|| (resType == 'Артефакты' && icoNum >= 504 && icoNum <= 1214)
				|| (resType == 'Зелья' && icoNum >= 24 && icoNum <= 114)
				|| (resType == 'Свитки' && icoNum >= 1934 && icoNum <= 2204)
				|| (resType == 'Войска' && icoNum >= 2254 && icoNum <= 2474)
				|| (resType == 'Рецепты' && icoNum == 1914)
				|| (resType == 'Руны' && icoNum >= 1504 && icoNum <= 1764)) {
				var index = goodsList.indexOf(market.rows[0].cells[0].getAttribute("resName"));
				if (index != -1 && wc_market_options[index] != 0) {
					$("#tmarkets").append(market.rows[0]);
				}
			}
		}

		function addMarketByName(market) {
			var mPrice = parseFloat(market.rows[0].cells[0].getAttribute("price"));
			if (mPrice < 1 && isBuyPage())
				return;
			if (allMarkets.length == 0) {
				allMarkets.push(market);
				return;
			}
			
			for (var i = 0; i < allMarkets.length; i++) {
				if (market.rows[0].cells[0].getAttribute("resName") < allMarkets[i].rows[0].cells[0].getAttribute("resName")) {
					allMarkets.splice(i, 0, market);
					return;
				} else if (market.rows[0].cells[0].getAttribute("resName") == allMarkets[i].rows[0].cells[0].getAttribute("resName")) {
					var miPrice = parseFloat(allMarkets[i].rows[0].cells[0].getAttribute("price"));
					if (!isBuyPage()) {
						if (mPrice < miPrice) {
							allMarkets.splice(i, 0, market);
							return;
						} else if (mPrice == miPrice) {
							var mDistance = parseInt(market.rows[0].cells[0].getAttribute("distance"));
							var miDistance = parseInt(allMarkets[i].rows[0].cells[0].getAttribute("distance"));
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

		function filterMarkets(e) {
			if (allMarkets.length == 0)
				return;
			clearDisplayedMarkets();
			var newAllMarkets = new Array();
			_.each(_.groupBy(allMarkets, function(a) {return a.rows[0].cells[0].getAttribute("resName");}), function(set) {
				_.each(_.sortBy(_.toArray(set), function(market) {
					if (typeof e == null || e.target.innerHTML == "Цена") {
						return parseFloat(market.rows[0].cells[0].getAttribute("price"));
					} else {
						return parseInt(market.rows[0].cells[0].getAttribute("time"));
					}
				}), function(market) {
					newAllMarkets.push(market);});
			});
			allMarkets = newAllMarkets;
			printListOfMarketsWithChoosenResource(lastResType);
		}

		/**
		 * Desc: divide market so every market had only one good
		 */
		function parseMarket(market) {
			while (market.rows[1].cells.length > 2) {
				var t = document.createElement("table");
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
			var regResName = /([А-Яа-я: ]+)(?: [0-9IVSLFCRr ]+| x\d+|)\$/;
			var time = /(\d+)\:(\d+)\:(\d+)|(\d+)дн/;
			
			market.rows[0].insertCell(0);
			// price
			var m = market.rows[1].cells[0].childNodes[0].getAttribute("tooltip").match(/x(\d+)\$/);
			if (m) {
				var totalPrice = parseFloat(market.rows[1].cells[1].innerHTML);
				var pricePerItem =  parseInt(Math.ceil(totalPrice / m[1]));
				market.rows[1].cells[1].innerHTML = totalPrice + "(" + pricePerItem  + ")";
			}
			market.rows[0].cells[0].setAttribute("price", market.rows[1].cells[1].innerHTML);
			// ico
			market.rows[0].cells[0].setAttribute("icoNum", market.rows[1].getElementsByTagName("img")[0].getAttribute("src").match(/(\d+)/)[1]);
			img = market.rows[1].cells[0].getElementsByTagName("img")[0];
			img.setAttribute("width", parseInt(img.getAttribute("width") * 0.6));
			img.setAttribute("height", parseInt(img.getAttribute("height") * 0.6));
			market.rows[0].cells[0].appendChild(img);
			// res name
			var span = document.createElement("span");
			span.setAttribute("style", "color:#000080;text-decoration:underline;margin-right:5px;cursor:pointer;");
			span.innerHTML = market.rows[1].cells[0].getElementsByTagName("span")[0].getAttribute("tooltip").replace("$Осталось:", " ");
			span.innerHTML = span.innerHTML.replace("$", "");
			market.rows[0].cells[0].appendChild(span);
			// cm
			m = market.getElementsByTagName("button")[0].getAttribute("onclick").match(/\d+,\d+,\d+,\d+/)[0];
			span.setAttribute("cm", m);
			// tooltip
			market.rows[0].cells[0].setAttribute("tooltip", market.rows[0].cells[0].getElementsByTagName("img")[0].getAttribute("tooltip"));

			try {
				market.rows[0].cells[0].setAttribute("resName", market.rows[0].cells[0].getAttribute("tooltip").match(regResName)[1]);
			} catch (e) {
				l(market.rows[0].cells[0].innerHTML);
			}
			
			market.rows[0].insertCell(1);
			market.rows[0].cells[1].appendChild(document.createTextNode(market.rows[1].cells[1].innerHTML));

			market.rows[0].insertCell(3);
			if (market.rows[1].cells[0].getElementsByTagName("span")[0].hasChildNodes() &&  market.rows[1].cells[0].getElementsByTagName("span")[0].childNodes[
					market.rows[1].cells[0].getElementsByTagName("span")[0].childNodes.length - 1].nodeName == "#text") {
				market.rows[0].cells[0].appendChild(market.rows[1].cells[0].getElementsByTagName("span")[0].childNodes[
					market.rows[1].cells[0].getElementsByTagName("span")[0].childNodes.length - 1]);
			}
			market.rows[0].insertCell(4);
			market.rows[0].cells[4].appendChild(market.rows[0].cells[2].getElementsByTagName("a")[0]);
			removeElement(market.rows[0].cells[2].childNodes[0]);
			if (!isBuyPage()) {
				m = market.rows[0].cells[2].childNodes[0].innerHTML.match(time);
				market.rows[0].cells[0].setAttribute("time", m[4] ? parseInt(m[4]) * 86400 : parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseInt(m[3]));
			}
			market.rows[0].deleteCell(2);
			var cell = market.rows[0].insertCell(2);
			if (!isBuyPage()) {
				cell.innerHTML = m[0];
			}
			market.rows[0].cells[3].innerHTML = market.rows[0].cells[4].innerHTML;
			market.rows[0].cells[3].getElementsByTagName("a")[0].setAttribute("style", "color:#005825");
			market.rows[0].deleteCell(4);
			market.rows[0].deleteCell(4);
			market.deleteRow(1);
			addMarketByName(market);
		}

		/**
		 * Desc: download all markets except markets with alliance tag
		 */
		function downloadAllMarkets(nextpage, resType) {
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
								printListOfMarketsWithChoosenResource(resType);
							} else {
								pb.innerHTML += '.';
								downloadAllMarkets(nextpage, resType);
							}
						}
						, dummy);
		}

		var buyPage = -1;
		function isBuyPage() {
			if ($(".rw")[2].rows[0].cells[0].innerHTML.search("<font color=\"#800000\">Покупка") == -1 && buyPage == -1)
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
		(function wcMarket() {
			if (typeof _ === "undefined") {
				addScript("http://underscorejs.org/underscore-min.js");
			}			
			if (typeof $ === "undefined") {
				addScript("http://code.jquery.com/jquery-1.9.1.js");
				addScript("http://yandex.st/jquery-ui/1.10.3/jquery-ui.min.js");
				var link = document.createElement("link");
				link.setAttribute("rel", "stylesheet");
				link.setAttribute("href", "http://warchaosujs.gixx.ru/jquery-ui/css/sunny/jquery-ui-1.10.3.custom.css");
				document.head.appendChild(link);
			}
			if (typeof $ === "undefined" || typeof $.ui === "undefined" || typeof _ === "undefined") {
				setTimeout(wcMarket, 1000);
				return;
			}
			var resources = ["Все", "Древесина", "Камень", "Металл", "Ресурсы", "Артефакты", "Зелья", "Свитки", "Войска", "Рецепты", "Руны",]
			var w = getWindowObject();
			if (!w.g || !w.g.rpa)
				return;
			if (w.g.rpa[5] == 0) {
				addCheck();
			}
			if (w.g.rpa[5] != 0 && w.g.upblock.search("<div align=center><table cellpadding=3 class=rwh><tr><td width=30>&nbsp;</td><td width=250 align=center>Рынок") != null)
				addCalcCost();
			if ((w.g == null || w.g.rpa == null)
					|| (w.g.rpa[5] != 1 && w.g.rpa[5] != 6 && w.g.rpa[5] != 4)) //sell, buy, clan markets
				return;

			var tables = document.getElementsByTagName('table');
			var rwh = $(".rwh");
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
						t.rows[0].cells[0].setAttribute("align", "center");
						for (var j = 0; j < resources.length; j++) {
							var span = document.createElement("span");
							span.setAttribute("class", "slnk");
							span.setAttribute("style", "color:#31004A");
							span.innerHTML = resources[j];
							span.addEventListener("click", function (e) {
									lastResType = e.target.innerHTML;
									printListOfMarketsWithChoosenResource(lastResType);
								}, false);
							t.rows[0].cells[0].appendChild(span);
							if (j != resources.length - 1)
								t.rows[0].cells[0].appendChild(document.createTextNode("| "));
						}

						// add sort by price | by time
						t = document.createElement("table");
						insertAfter(t, sellButton.parentNode.parentNode.parentNode.parentNode.nextSibling);
						t.setAttribute("class", "rw");
						t.setAttribute("cellpadding", "3");
						t.setAttribute("cellspacing", "0");
						t.setAttribute("id", "tmarkets");
						var row = t.insertRow(0);
						var cell = row.insertCell(0);
						var span = document.createElement("span");
						span.setAttribute("style", "color:#31004A");
						span.innerHTML = "Товар";
						cell.appendChild(span);
						cell = row.insertCell(1);
						span = document.createElement("span");
						
						span.setAttribute("style", "color:#31004A");
						span.innerHTML = "Цена";
						if (!isBuyPage()) {
							span.addEventListener("click", filterMarkets, false);
							span.setAttribute("class", "slnk");
						}
						cell.appendChild(span);
						span = document.createElement("span");
						span.setAttribute("class", "slnk");
						span.setAttribute("style", "color:#31004A");
						cell = row.insertCell(2);
						if (!isBuyPage()) {
							span.innerHTML = "Время";
							span.addEventListener("click", filterMarkets, false);
							cell.appendChild(span);
						}
						span = document.createElement("span");
						span.setAttribute("style", "color:#31004A");
						if (!isBuyPage())
							span.innerHTML = "Продавец";
						else
							span.innerHTML = "Покупатель";
						cell = row.insertCell(3);
						cell.appendChild(span);
							
						var div = document.createElement("div");
						div.setAttribute("id", "markets");
						insertAfter(div, t);
						$.each($(".rw"), function(i, rwi) {
							if (i > 2 && i < $(".rw").length - 1)
								$("#markets").append(rwi);
						});
						//Options button
						var b = document.createElement("button");
						insertAfter(b, document.getElementsByTagName("button")[1]);
						// b.parentNode.setAttribute("width", "60%");
						b.setAttribute("class", "cmb");
						b.setAttribute("style", "width:80px;");
						b.innerHTML = "Настройки";
						$(b).click(function() {$("#wc_market_options").dialog("open");});
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
						// w.ShowWin();

						var t = document.createElement("table");
						t.setAttribute("id", "wc_market_options");
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
							printListOfMarketsWithChoosenResource(lastResType);
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
						$(t).dialog({autoOpen: false, width: 1100, title: "Настройки рынка"});
					}
				}
			}
		})(); // wcMarket


	} // source

	
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
	
})();
