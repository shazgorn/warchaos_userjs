// ==UserScript==
// @name           Warchaos Buildings
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Add some icons to town screen and blds lvls
// @match          http://warchaos.ru/f/a
// @version        1.0
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_astar.user.js
// ==/UserScript==

(function() {
	// return;
	function source() {
		// by Taulrom
		var tbl = [
			["Казармы", "it/2254.gif"],
			["Гарнизон", "it/2264.gif"],
			["Стрельбище", "it/2274.gif"],
			["Полигон", "it/2284.gif"],
			["Орден меча","it/2294.gif"],
			["Орден щита","it/2304.gif"],
			["Конюшни", "it/2314.gif"],
			["Арена","it/2324.gif"],
			["Башня магов","it/2334.gif"], //8

			["Храм", "data:image/gif;base64,R0lGODlhFgAoAMIEAP7LAP/LAP7MAP/MAP///////////////yH5BAEKAAQALAAAAAAWACgAAAOdSLo7IgGwSYezmGrMs2aBxVjhp3ijaArqWJrRoIXBZwm28wHtNAQ4W20zkNiMFSRRRhEoK7pJiGkCBBkAoEnBoyog24aX5V1FCcUw9ocuL0I8pPX3QpM7DkjM0r3g/4AcUyQ/N3hOF045bmqIQ2opaZCRT5AYV5NtZ5l9mWIok2Q8ngSDjCZ4nqanOx2edz1qfbFhq54dAJWoHZgLCQA7"],
			["Смотровая башня", "112.gif"],
			["Обсерватория","112.gif"],
			["Кузница", "data:image/gif;base64,R0lGODlhKAAoAOfkACgkIysnJiwoJy0pKC4qKS8qKTEtLDMvLjQvLjUxMDczMjs2NTs3Njw4Nz05OD46OT87OkE8O0M+PUM/PkRAP0ZCQUdDQUhDQklEQ0pFREtGRUxIR01JSE5KSU9LSlBMSlFNS1NOTVRPTlZRUFdSUVhTUllUU1lVVFpWVVtXVlxYVrdHAF1ZV15aWF1bXmBbWmFcW2JdXGNeXeVDAGVgX+ZEAGZhYOdGAGhjYulHAGlkY+pIAGplZOtJAGtmZexKAWxnZu5LA29qaXBraXBsauJWAHFta3JubHNvbeRZAHRwbuxYBnVxb3ZycHdycXhzcnl0c3p1dOFiAXt2deJkA3x3duNlBH14d+VmAORmBn55eNhtAIB7eoJ9fIN+fd1xAIR/ft5yAIWAf+BzAIaBgH6DhuF0AIeCgYWDh+J1AIiDgoCFiImEg4GGieV3AIqFhIKHiup2BIuGhYmHi4yHhth+AO14AI2Ih4uJjY6JiIyKjtuBAJCKiY2Lj5GLiomOkZKMi4+NkeCEAJONjN+EBpCOkuKGAJSPjeeFAJWQjo6SlZORlZaRj5SSlpeSkJWTl5iTkZaUmJmUkpqVk5iWmpuWlNySAMaaAJqYnJ2Ylt6UAJuZneCVAp+ameGWBOOXAOSYANWdAaKdnJqfoaGeoqOenaSfnu2aAKOgpKWgn9+fAKahoOueAOGhAOOiAN6kAOSjAO6gBaulpOalBKympa2npumnANqsAt2uAMm0AO2qAN+vANSyBLGsquCwALKtq+GxAO+tALOurOKyAOOzAOW0APOwBue2A966ANW9AN+7AuG8ANfAAb23tu68ANzEAPG/AN7FAOjDAMG8ut/GAODHAPTBBOvFAOHIAOLJAOTKA+XLAOjNAPPLAOnPAOrQAM3Hxu3SAO7TAPPXAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAP8ALAAAAAAoACgAAAj+AP8JHEiwoMGDCBMqXMiwocOHECNKnEhxYbKKDJNpw8bRG0aLHDsqjIYRW7WT1bQt9EjRJMpq3wTmQjjOobZwBbFR27kzGkyWBb3hbMhrWbeBy5AtW8p0qTSD0pY9dXjLV7F/xXxp3cr1qkBrzrICu/RvGDSGqlyF+ufqldu3cF0Z+xesrVtdAnXNYmiJkydQnAILHhzYEqu+gk8J/AQqlkJDhghJnky5smVCiATWMbQHYZo0Y0KLHk269Og4Y7aEtpOmIJUsVGLLnk27dm0rs7EQXLGkiO/fwIMLHx48ScEfO3Iov6G8eY4bzJ9Dz/Gjh3Pp0LPn+PjRhZAjZf7+BNIzp82cPpEKweGjaJGjRgLxoCmz5g+lTaNQkcKE6VElgg2E0EIJRrzBxxtvkEGGH5kwYiAkk0ziCCD/8EHGGXxMUsoqopRSCR8HCRDBBReo4IMQQiCBRBVvDHIgG3wMAsggLqpBhhyDQJJJJom8oVADEShgQAISYCCBBjEwwQUXYHgBhhpggMEGGV1w8YYfgyQCYkQABIAABzogccQTVVShxRVVXKHFFE54IYccbFAUQAENmKCDEU84wUQVXlShxBRaQAFGjBgVsEAINhDRRBNGNMHFFUxEQYYafHz40QUi2CAEE0woqkUVT0RBhyOS0HLpCCroQAQTTSDBBBSYUTwxxSClpCLMRyPAYIMRRyjBhBJNOIGEEUz4IYopvUAikQYmqNCBCTDgMCwQPPgAhA8yvBDDFHxIUksz4ERE5wcfjDCCCTHQwIIJJZBgwgggfBCDEl1AIoos00A0QAERcKDBvx+E0AEHHJBosAYfmECEF4z8Iq4BEUQcgQQSjHhBBAsgsEAEQGZgJxfchSzyyCSXbHJFAQEAOw=="],
			["Дороги", "data:image/gif;base64,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"],
			["Фабрика", "data:image/gif;base64,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"],

			["Дворец", "23.gif"],
			["Цитадель", "13.gif"],
			["Центр деревни", "3.gif"],

			["Таверна", "data:image/gif;base64,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"],
			["Рынок", "2568.gif"],
			["Банк", "2608.gif"],

			["Школа", "data:image/gif;base64,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"],
			["Академия", "data:image/gif;base64,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"],
			["Цех", "data:image/gif;base64,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"],
			["Мастерская", "data:image/gif;base64,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"],


			["Фрегат", "252.gif"],
			["Галеон","272.gif"],
			["Линкор", "262.gif"],
			["Когг", "282.gif"],
			["Транспорт", "242.gif"],
			["Брандер", "232.gif"],
			["Субмарина", "302.gif"],
			["Пушка","152.gif"],
			["Обоз", "102.gif"],
			["Дирижабль", "122.gif"],
			["Катапульта", "62.gif"],
			["Ставка", "142.gif"],
			["Шахта", "332.gif"],
			["Строитель", "172.gif"],
			["Алхимический котел", "162.gif"],
			["Ворота", "702.gif"],
			["Бурильщик", "212.gif"],
			["Башня", "342.gif"],

			["Радуга", "it/1954.gif"],
			["Благословение", "it/1934.gif"],
			["Куст терновника", "it/1944.gif"],
			["Дождь", "it/1994.gif"],
			["Суперсенсинг", "it/1984.gif"],
			["Маскировка", "it/2034.gif"],
			["Отражение", "it/2024.gif"],
			["Рассеивание", "it/2044.gif"],
			["Отмена", "it/2134.gif"],
			["Горгулья", "it/2204.gif"],
			["Портал", "it/2124.gif"],

			["Проклятие", "it/1964.gif"],
			["Огненная стена", "it/1974.gif"],
			["Паутина", "it/2014.gif"],
			["Слабость", "it/2004.gif"],
			["Вихрь", "it/2064.gif"],
			["Пентаграмма", "it/2074.gif"],
			["Забывчивость", "it/2054.gif"],
			["Обездвиживание", "it/2114.gif"],
			["Ослепление", "it/2104.gif"],

			["Спиритический шлем", "it/604.gif"],
			["Молот силы", "it/704.gif"],
			["Короткий меч", "it/714.gif"],
			["Посох патриарха", "it/724.gif"],
			["Дубинка орков", "it/734.gif"],
			["Разрывчатый лук","it/744.gif"],
			["Деревянный щит", "it/804.gif"],
			["Кожаная броня", "it/904.gif"],
			["Золотая броня", "it/914.gif"],
			["Сапоги", "it/1014.gif"],
			["Подзорная труба", "it/524.gif"]
		];


		function dummy() {}

		/**
		*
		*/
		function ajaxRequest(url, method, param, onSuccess, onFailure, args) {
			var xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open(method, url, true);
			xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xmlHttpRequest.onreadystatechange = function () {
				if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
					onSuccess(xmlHttpRequest, args);
				}
				else if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200)
					onFailure(xmlHttpRequest);
			};
			xmlHttpRequest.send(param);
		}

		/**
		 * Search tables with specified name and return array of tables
		 * Params:
		 * className - className of searching tables
		 * Returns:
		 * result - Array of tables with specified name
		 */
		function getTablesByClassName(className) {
			var result = [];
			var tables = document.getElementsByTagName('table');
			for (i = 0; i < tables.length; i++)
				if (tables[i].hasAttribute('class') && tables[i].getAttribute('class') == className)
					result.push(tables[i]);
			return result;
		}

		/**
		 * Return: window object
		 */
		function getWindowObject() {
			return window;
		}

		function getTownId() {
			var w = getWindowObject();
			return w.g.mobjects[w.g.objcity+5];
		}

		/**
		 * Add listener on refresh button.
		 * listener will erase item in localStorage associated with current town
		 */
		function addEraseCookieActionOnRefreshButton(townId) {
			var buttons = document.getElementsByTagName("BUTTON");
			for (var i = 0; i < buttons.length; i++) {
				if (buttons[i].hasAttribute("tooltip") && buttons[i].getAttribute("tooltip") == "Обновить") {
					buttons[i].addEventListener("click", function () {
							getWindowObject().localStorage.removeItem(townId);
						}, false
					);
					break;
				}
			}
		}

		/**
		 * Add building name and level to item in localStorage
		 *
		 * Params:
		 * i - cell index containing building
		 * lvl - building level parsed from xmlHttpRequest
		 */
		function addNewBld(t, i) {
			var m = t.responseText.match(/align\=center>[^\[]+ \[(\d+)\]/);
			var lvl = m ? parseInt(m[1], 10) : 0;
			var td = document.getElementsByTagName('td');
			var div = td[i].getElementsByTagName("DIV")[0];
			var j = 0;
			for (; j < div.childNodes.length; j++)
				if (div.childNodes[j].nodeName == "#text") {
					break;
				}
			var w = getWindowObject();
			var townId = getTownId();
			var townBuildings = w.localStorage.getItem(townId).split(',');
			for (var k = 0; k < 15; k++)
				if (tbl[k][0] == div.childNodes[j].data) {
					townBuildings[k] = lvl;
					break;
				}
			w.localStorage.setItem(townId, townBuildings);
			if (lvl > 0) {
				td[i].getElementsByTagName("DIV")[0].childNodes[j].data += " [" + lvl + "]";
			}
		}

		function addIcons() {
			var townId, i, j;
			var w = getWindowObject();
			if (typeof w.g == "undefined" || typeof w.g.cons == "undefined" || typeof w.g.blds == "undefined") {		//not on town screen
				return;
			} else {
				townId = getTownId();
			}
			var townBuildings;
			if ((townBuildings = w.localStorage.getItem(townId)) !== null) {
				townBuildings = townBuildings.split(',');
			} else {
				townBuildings = [];
				for (i = 0; i < 15; i++) {
					townBuildings[i] = '-1';
				}
				window.localStorage.setItem(townId, townBuildings);
			}

			addEraseCookieActionOnRefreshButton(townId);
			
			// get building name on building screen
			var nameOfBldInTable = getTablesByClassName("rwh");
			if (nameOfBldInTable.length > 0) {
				//buildingTitle == "Фабрика [47]"
				var buildingTitle = nameOfBldInTable[0].rows[0].cells[1].innerHTML;			
				var buildingName = buildingTitle.match(/(.*) \[\d+\]/);
				if (buildingName !== null) {
					buildingName = buildingName[1];
					var buildingLvl = buildingTitle.match(/\d+/);
					for (i = 0; i < 15; i++) {
						if (tbl[i][0] == buildingName) {
							townBuildings[i] = buildingLvl;
							w.localStorage.setItem(townId, townBuildings);
							break;
						}
					}
				}
			}
			
			// buildings list
			var td = document.getElementsByTagName('td');
			for (i = 0; i < td.length; i++) {
				if (td[i].hasAttribute('class') && td[i].getAttribute('class') == "bld" && td[i].hasChildNodes()) {
					var div = td[i].getElementsByTagName("DIV")[0];
					var bldName;
					for (j = 0; j < div.childNodes.length; j++)
						if (div.childNodes[j].nodeName == "#text") {
							bldName = div.childNodes[j].data;
							break;
						}
					for (j = 0; j < tbl.length; j++) {
						if (bldName == tbl[j][0]) {
							if (j < 15) {
								var lvl = townBuildings[j]; // lvl: -1 - not checked yet, 0 - wing of building under construction, [1..255] - has some level.
								if ((lvl == -1) || (lvl === 0 && !td[i].hasAttribute("style"))) {
									if (div.hasAttribute('onclick')) {
										var c = div.getAttribute('onclick').match(/'([\w\d]+)'/)[1];
										var params = "a="+w.g.mobjects[w.g.objcity+5]+"&b="+w.g.mobjects[0]+"&c="+c+"&d="+''+"&e="+w.g.ecod+"&x=&y=&z=";
										//a=2015&b=0&c=b3&d=&e=1330509532&x=&y=&z=
										ajaxRequest("http://warchaos.ru/f/a", "POST", params,
											addNewBld, dummy, i);
									}
								} else if (lvl > 0) {
									td[i].childNodes[0].childNodes[0].data += " [" + lvl + "]";
								}
							}

							//building icons, crafts, etc.
							if (div.getElementsByTagName("IMG").length === 0) {
								var img = document.createElement('img');
								img.setAttribute("src", tbl[j][1]);
								div.insertBefore(img, div.childNodes[0]);
								if (j <= 8 && j%2 == 1) {
									img = document.createElement('img');
									img.setAttribute("src", tbl[j-1][1]);
									div.insertBefore(img, div.childNodes[0]);
								} else {
									div.insertBefore(document.createElement('br'),
											div.childNodes[1]);
								}
							}
						}
					} //foreach building in tbl
				}
			}// foreach tds
		}//func

		(function(f) {
			addEventListener('click', function () {
				//setTimeout(f, 100);
			}, false);
			var wc_ifr = document.getElementById("ifr");
			if (wc_ifr)
				wc_ifr.addEventListener("load", function () {
					setTimeout(f, 100);
				}, false);
			f();
		})(addIcons);
	}

	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
})();