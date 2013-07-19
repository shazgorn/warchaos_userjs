// ==UserScript==
// @name           Warchaos Main Menu
// @namespace      http://shazgorn.110mb.com
// @description    Add some links to main menu
// @include        http://warchaos.ru/*
// @exclude        http://warchaos.ru/f/a
// @match          http://warchaos.ru/*
// ==/UserScript==


(function() {
	//return;

	function source() {
		function insertAfter(el1, el2) {
		if (!el2.parentNode) return;
		if (el2.nextSibling)
			el2.parentNode.insertBefore(el1,el2.nextSibling);
		else
			el2.parentNode.appendChild(el1);
		}

		function getTableByClassName(className) {
			var tables = document.getElementsByTagName('table');
			for (i=0; i<tables.length; i++)
				if (tables[i].hasAttribute('class') && tables[i].getAttribute('class') == className)
					return tables[i];
			return null;
		}

		function highlightLink(pagename, linkname) {
			if (document.URL.search(pagename) != -1) {
				var lis = document.getElementsByTagName('li');
				for (var i=0; i<lis.length; i++)
					if (lis[i].getAttribute('class') != "lis" && lis[i].childNodes[0].innerHTML == linkname) {
						lis[i].setAttribute('class', "lis");
						lis[i].childNodes[0].setAttribute('style',"font-style:italic");
						break;
					}
			}
		}

		function unhighlightLink(pagename, linkname) {
			if (document.URL.search(pagename) != -1) {
				var lis = document.getElementsByTagName('li');
				for (var i=0; i<lis.length; i++)
					if (lis[i].getAttribute('class') == "lis" && lis[i].childNodes[0].innerHTML == linkname) {
						lis[i].removeAttribute('class');
						lis[i].childNodes[0].setAttribute('style',"font-style:normal");
						break;
					}
			}
		}

		function addCheckAllButton() {
			var b = document.createElement("input");
			b.setAttribute("type", "button");
			b.setAttribute("class", "xcmb");
			b.setAttribute("value", "Выделить все");
			b.setAttribute("style", "margin-left: 4px;");
			b.addEventListener("click", function () {
				var cb = document.getElementsByTagName("input");
				for (var i = 0; i < cb.length; i++) {
					if (cb[i].getAttribute("type") == "checkbox") {
						cb[i].checked = true;
					}
				}
			}, false);
			var inputs = document.getElementsByTagName("input");
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].hasAttribute("value") && inputs[i].getAttribute("value") == "Удалить") {
					insertAfter(b, inputs[i]);
				}
			}
		}

		(function mainMenuUpgrade() {
			if (document.URL != "http://warchaos.ru/f/a") {//add some if (skin) later
				var bookBlockId = "me500i";
				var clanBlockId = "me200i";
				var clan_uid = "17748";
				var as = document.getElementsByTagName('a');
				for (i = 0; i < as.length; i++) {
					if (as[i].parentNode.tagName == "LI" && as[i].href.search("http://warchaos.ru/clan/manager/") != -1) {
						//Clan Profile
						li = document.createElement('li');
						document.getElementById(clanBlockId).appendChild(li);
						a = document.createElement('a');
						a.href = "http://warchaos.ru/uid/" + clan_uid;
						li.appendChild(a);
						document.links[++i].innerHTML = "Профиль клана";
						if (document.URL == "http://warchaos.ru/uid/" + clan_uid) {
							li.setAttribute('class', "lis");
							a.setAttribute('style',"font-style:italic");
						}
					}
					if (as[i].parentNode.tagName == "LI" && as[i].href == "http://warchaos.3dn.ru/forum/") {
						//Profile
						li = document.createElement('li');
						document.getElementById(bookBlockId).appendChild(li);
						a = document.createElement('a');
						a.href = "http://warchaos.ru/uid/" ;
						li.appendChild(a);
						document.links[++i].innerHTML = "Мой профиль";
						if (document.URL=="http://warchaos.ru/uid/") {
							li.setAttribute('class', "lis");
							a.setAttribute('style',"font-style:italic");
						}
						//Scripts
						li = document.createElement('li');
						document.getElementById(bookBlockId).appendChild(li);
						a = document.createElement('a');
						a.href = "javascript://";
						li.appendChild(a);
						document.links[++i].innerHTML =  "Скрипты";
						a.addEventListener('click', function (e) {
							var w = window;
							w.help1 = "Скрипты";
							w.help2 = "<div id='scripts_list'></div>";
							w.ShowWin();
							function addLinkToScriptsList(link, name, description) {
								var div = document.getElementById("scripts_list");
								var a = document.createElement("a");
								a.href = link;
								a.innerHTML = name;
								div.appendChild(a);
								div.appendChild(document.createTextNode(description));
								div.appendChild(document.createElement("br"));
							}
							var div = document.getElementById("scripts_list");
							var b = document.createElement("b");
							b.innerHTML = "Главное меню";
							div.appendChild(b);
							div.appendChild(document.createElement("br"));
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_main_menu.user.js", "Warchaos Main Menu"," - Добавляет полезные ссылки в главное меню.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_continent_names.user.js", "Warchaos Continent Names", " - Заменяет названия материков.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_clear_msg.user.js","Warchaos Clear Msg"," - Удаляет сообщения.");
							b = document.createElement("b");
							b.innerHTML = "Игра";
							div.appendChild(b);
							div.appendChild(document.createElement("br"));
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_icon_replacer.user.js","Warchaos Icon Replacer"," - Заменяет иконки рецов и добавляет инфу об артах.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_mapper_akrit.user.js","Warchaos Mapper for Akrit"," - Маппер для Акрита.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_buildings.user.js","Warchaos Buildings"," - Добавляет иконки и уровни зданий в городе.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_buy_force.user.js","Warchaos Buy Force"," - Добавляет кнопку max для покупки форса.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_loot_button.user.js","Warchaos Loot Button"," - Добавляет кнопку для выделения лута.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_ap_calc.user.js","Warchaos AP Calc"," - Показывает реген ходов.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_numpad_arrows.user.js","Warchaos Numpad Arrows"," - Позволяет двигать юниты numpad`om.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_market.user.js","Warchaos Market"," - Скрипт для рынка.");
							addLinkToScriptsList("http://disk.webhop.org/shazgorn@jabber.ru/wc_replace_force_size.user.js","Warchaos Replace Army Size"," - Заменяет буквенные обозначения армий на численные.");
							// addLinkToScriptsList(,"","");
							div.appendChild(document.createElement("hr"));
							a = document.createElement("a");
							a.href = "http://silentdragons.ru/forum/viewtopic.php?f=4&t=1319";
							a.target = "_blank";
							a.innerHTML = "Тема на форуме";
							div.appendChild(a);
						},false);
						//Scripts options
						li = document.createElement('li');
						document.getElementById(bookBlockId).appendChild(li);
						a = document.createElement('a');
						a.href = "javascript://";
						a.setAttribute("id", "scripts_options_a");
						li.appendChild(a);
						document.links[++i].innerHTML =  "Настройки скриптов";
						a.addEventListener('click', function (e) {
							var w = window;
							w.help1 = "Настройки скриптов";
							w.help2 = "<div id='scripts_options_div'></div>";
							w.ShowWin();
						},false);
						//Map
						li = document.createElement('li');
						document.getElementById(bookBlockId).appendChild(li);
						a = document.createElement('a');
						a.href = "http://dragonmap.ru/akrit/";
						a.target = "_blank";
						li.appendChild(a);
						document.links[++i].innerHTML =  "Карта";
						//box
						li = document.createElement('li');
						document.getElementById(bookBlockId).appendChild(li);
						a = document.createElement('input'); //ybox
						a.type="text";
						a.setAttribute('class', "ybox");
						a.setAttribute("style", "width:120px;");
						a.setAttribute("maxlength", "15");
						a.id = "qq";
						li.appendChild(a);
						a.addEventListener('keydown', function (e) {
							if (e.keyCode == 13) window.open('http://warchaos.ru/search/?q=' + document.getElementById('qq').value, "_self");
						}, false);
						//button
						li = document.createElement('li');
						document.getElementById(bookBlockId).appendChild(li);
						a = document.createElement('input');
						a.type="button";
						a.setAttribute('class', "xcmb");
						a.value="Искать";
						a.addEventListener('click', function () {
							window.open('http://warchaos.ru/search/?q=' + document.getElementById('qq').value, "_self");
						},false);
						li.appendChild(a);
						break;
					}
				}//for
				
				//Add next/prev links at top of pages. use with care
				if (document.URL.search(/msg|log|archive|clan\/\d|lenta|snapshots|top/) != -1) {
					var mtext = getTableByClassName("mtext");
					if (mtext != null && mtext.innerHTML.search("Следующая") != -1) {
						var	nextPrevBar = mtext.cloneNode(true);
						var firstMsg = getTableByClassName("xrw xmsg");
						if (!firstMsg)
							firstMsg = getTableByClassName("xrw");
						if (firstMsg)
							firstMsg.parentNode.insertBefore(nextPrevBar, firstMsg);
					} else if (document.URL.search("msg/1") == -1) {  //change font color to black in messages everywhere except trade messages
						var tds = document.getElementsByTagName("TD");
						if (tds) {
							for (var i = 0; i < tds.length; i++) {
								if (tds[i].hasAttribute("class") && tds[i].getAttribute("class") == "rwRight") {
									var fonts = tds[i].getElementsByTagName("FONT");
									if (fonts) {
										for (var j=0; j<fonts.length; j++) {
											if (fonts[j].hasAttribute("color"))
												fonts[j].setAttribute("color", "black");
										}
									}
								}
							}
						}
					}
				}				
				// add check all button to snapshots, msg, archive pages
				if (document.URL.search("snapshots") != -1) {
					addCheckAllButton();	
				} else if (document.URL.search(/msg|archive/) != -1) {
					if (document.getElementById("delbut") != null) {  //if on redirect page
						document.getElementById("delbut").getElementsByTagName("a")[0].addEventListener("click", function () {
							addCheckAllButton();
						}, false);
					}
				}
				// pro seat
				if (document.URL.search("user/game") != -1) {
					var cb = document.getElementsByTagName("input");
					for (var i = 0; i < cb.length; i++) {
						if (cb[i].getAttribute("type") == "checkbox") {
							cb[i].checked = true;
						}
					}
					if (document.getElementsByName('y')) {							
						document.getElementsByName('y')[0].value = 1;
						if (document.getElementsByName('i11')[0] != null)
							document.getElementsByName('i11')[0].value = 21;
					}
				}
				highlightLink("lenta/7/", "Лиаф");
				highlightLink("group", "Группа");
				//unhighlightLink("lenta/2/", "Лиаф");
				//unhighlightLink("/uid", "Энциклопедия");

				
			}

		})();
	}

	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
})();

