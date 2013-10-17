// ==UserScript==
// @name           Warchaos Main Menu
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Add some links to main menu
// @match          http://warchaos.ru/*
// @version        1.24
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_main_menu.user.js
// ==/UserScript==


(function() {
	//return;
	function source() {
		var navLinks = [
		["Боевые", "http://warchaos.ru/log/1/0/"],
		["Архив", "http://warchaos.ru/archive/0/1/"],
		["Обзор аккаунта", "http://warchaos.ru/report/0/65535"],
		["Управление", "http://warchaos.ru/user/game/"],
		["Настройки", "http://warchaos.ru/user/preferences/"]
		];
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
		
		function getWindowObject() {
			return window;
		}

		function highlightLink(pagename, linkname) {
			if (document.URL.search(pagename) != -1) {
				var lis = document.getElementsByTagName('li');
				for (var i = 0; i < lis.length; i++)
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
				for (var i = 0; i < lis.length; i++)
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
			//document.body.appendChild(b);
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
					$(b).appendTo(inputs[i].parentNode);
				}
			}
		}
		function addMenuItem(ul, text, link) {
			var li = document.createElement("li");
			var a = document.createElement("a");
			a.setAttribute("href", link);
			a.innerHTML = text;
			li.appendChild(a);
			ul.appendChild(li);
		}
		function getTownLinks() {
			var bs = $("#cise > table > tbody > tr > td button[rc]");
			var buttons = [];
			// var div = document.createElement("div");
			var button;
			for (var i = 0; i < bs.length; i++) {
				// console.log(bs[i].getAttribute("rc"), bs[i].nextSibling.nextSibling.data);
				button = document.createElement("button");
				button.setAttribute("rc", bs[i].getAttribute("rc"));
				button.setAttribute("onclick", bs[i].getAttribute("onclick"));
				$(button).button({label: bs[i].childNodes[0].childNodes[0]
					.nextSibling.nextSibling.data}).click(function(){
					
				});
				buttons.push(button);
			}
			return buttons;
		}
		var seats = [];
		function getSeats(page) {
			$.ajax({
				url: "http://warchaos.ru/archive/0/" + page,
				type: "GET",
				// async: true,
				success: function(data) {
					var m = data.split('<table class="xrw xmsg" cellspacing=0 cellpadding=0>');
					for (var i = 0; i < m.length; i++) {
						if (m[i].search("Вы можете принять управление данным аккаунтом на") != -1) {
							var name = m[i].match(/<td class=rwleft valign=top><b>([^<]+)</)[1];
							console.log(name);
							seats.push(m[i]);
							console.log(m[i]);
						}
					}
					console.log(seats.length);
					m = data.match(/href=http:\/\/warchaos.ru\/archive\/0\/(\d+)\/\d+>Следующая/);
					console.log(m);
					if (m !== null && m.length == 2) {
						getSeats(m[1]);
					}
				}
			});
		}
		function createTopNavBar() {
			var i;
			// getSeats(1);
			if ($("#navBar").length === 0 && $("#mnd").length == 1) {
				var div = document.createElement("div");
				div.setAttribute("id", "navBar");
				div.setAttribute("style", "position: fixed; top:0");
				// div.setAttribute("class", "ui-widget-header ui-corner-all");
				var buttons = getTownLinks();
				for (i = 0; i < buttons.length; i++) {
					div.appendChild(buttons[i]);
				}
				for (i = 0; i < navLinks.length; i++) {
					var a = document.createElement("a");
					a.innerHTML = navLinks[i][0];
					a.setAttribute("href", navLinks[i][1]);
					div.appendChild(a);
					$(a).button();
				}
				var mnd = $("#mnd").get(0);
				mnd.appendChild(div);
				$(div).prependTo(mnd);
			}
		}
		function addAdditionalNav() {
			// return;
			createTopNavBar();
			return;
			// getTownLinks();
			if ($("#addmenu").length === 0 && $("#drig").length == 1) {
				// var table = $("#drig > table").get(0);
				// var row = table.insertRow(table.rows.length - 2);
				// var row = table.rows[1];
				// var cell = row.insertCell(1);
				var cell = $("#drig > table > tbody > tr").get(1).cells[1];
				
				// cell = row.insertCell(1);
				// row.insertCell(2);
				// cell.setAttribute("colspan", "2");
				// if ($("#addmenu").length === 0 && $("#cise table").length == 1) {
				/*
                var table = $("#cise table").get(0);
                var row = table.insertRow(table.rows.length);
				var cell;
				for (var i = 0; i < table.rows[0].cells.length; i++) {
					cell = row.insertCell(row.cells.length)
					if (table.rows[0].cells[i].getElementsByTagName("img")[0].getAttribute("src") == "ctrl/54.gif")
						break;
				}
				*/
				var ul = document.createElement("ul");
				ul.setAttribute("id", "addmenu");
                cell.appendChild(ul);
				$(ul).prependTo(cell);
				// $(ul).prependTo($("#mnd"));
				var li = document.createElement("li");
				var a = document.createElement("a");
				a.href = "/f/a";
				a.innerHTML = "Перейти";
				li.appendChild(a);
				ul.appendChild(li);
				var inUl = document.createElement("ul");
				li.appendChild(inUl);
				
				for (var i = 0; i < navLinks.length; i++) {
					addMenuItem(inUl, navLinks[i][0], navLinks[i][1]);
				}
				$("#addmenu").menu({position: {my:"left top", at: "left+0 top-90"}});
            }
		}

		(function mainMenuUpgrade() {
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
				setTimeout(mainMenuUpgrade, 100);
				return;
			}
			var li, a, i, j;
			if (document.URL != "http://warchaos.ru/f/a") {
				var bookBlockId = "me500i";
				var clanBlockId = "me200i";
				var as = document.getElementsByTagName('a');
				for (i = 0; i < as.length; i++) {
					if (as[i].parentNode.tagName == "LI" && as[i].href.search("http://warchaos.ru/clan/manager/") != -1) {
						//Clan Profile
						var clan_uid = sessionStorage.getItem("clan");
						if (clan_uid === null)
							$.ajax({
								url: "http://warchaos.ru/uid/",
								type: "GET",
								async: false,
								success: function(data) {
									var m;
									m = data.match(
											/<b>Клан\:<\/b><\/td><td height=21 width=50%>&nbsp;<a href=http:\/\/warchaos\.ru\/uid\/(\d+)>(.+)<\/a>/);
									if (m !== null) {
										clan_uid = m[1];
									} else {
										clan_uid = "";
									}
								}
							});
						if (clan_uid !== "") {
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
						// Sripts
						li = document.createElement('li');
						document.getElementById(bookBlockId).appendChild(li);
						a = document.createElement('a');
						a.href = "https://github.com/shazgorn/warchaos_userjs/wiki/Описания-скриптов";
						a.target = "_blank";
						li.appendChild(a);
						document.links[++i].innerHTML =  "Скрипты";
						//Scripts options
						/*
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
						*/
						//Map
						li = document.createElement('li');
						document.getElementById(bookBlockId).appendChild(li);
						a = document.createElement('a');
						a.href = "http://dragonmap.ru/akrit/";
						a.target = "_blank";
						li.appendChild(a);
						document.links[++i].innerHTML =  "Карта";
						break;
					}
				}//for
				
				//Add next/prev links at top of pages. Use with caution
				if (document.URL.search(/msg|log|archive|clan\/\d|lenta|snapshots|top/) != -1) {
					var mtext = $(".mtext").get(0);
					if (mtext !== null && mtext.innerHTML.search("Следующая") != -1) {
						var	nextPrevBar = mtext.cloneNode(true);
						var firstMsg = $(".xrw xmsg").get(0);
						if (!firstMsg)
							firstMsg = $(".xrw").get(0);
						if (firstMsg)
							firstMsg.parentNode.insertBefore(nextPrevBar, firstMsg);
					} else if (document.URL.search("msg/1") == -1) {
						//change font color to black in messages everywhere except trade messages
						var tds = document.getElementsByTagName("TD");
						if (tds) {
							for (i = 0; i < tds.length; i++) {
								if (tds[i].hasAttribute("class") && tds[i].getAttribute("class") == "rwRight") {
									var fonts = tds[i].getElementsByTagName("FONT");
									if (fonts) {
										for (j = 0; j < fonts.length; j++) {
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
					if (document.getElementById("delbut") !== null) {  //if on redirect page
						document.getElementById("delbut").getElementsByTagName("a")[0].addEventListener("click", function () {
							addCheckAllButton();
						}, false);
					}
				}
				// pro seat
				if (document.URL.search("user/game") != -1) {
					var cb = $("input[type='checkbox']");
					for (i = 0; i < cb.length; i++) {
						if (i != 1 && i != 2) {
							cb[i].checked = true;
						}
					}
					if (document.getElementsByName('y') !== null && document.getElementsByName('y')[0] !== null) {							
						document.getElementsByName('y')[0].value = 1;
						if (document.getElementsByName('i11')[0] !== null)
							document.getElementsByName('i11')[0].value = 21;
					}
				}
				highlightLink("lenta/7/", "Лиаф");
				highlightLink("group", "Группа");
				//unhighlightLink("lenta/2/", "Лиаф");
				unhighlightLink("/uid", "Энциклопедия");
				
				if (document.URL.search("worlds") != -1) {
					var b = document.getElementsByTagName('b');
					var tables;
					for (i = 0; i < b.length; i++) {
						if (b[i].innerHTML == "Материк") {
							tables = b[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('table');
							break;
						}
					}
					var onclickReg = /(\d+)/g;  //get coords of continent rectangle
					for (i = 1; i < tables.length; i++) {
						var contName = tables[i].getElementsByTagName('span')[0].innerHTML;
						var coords = tables[i].getElementsByTagName('span')[0].getAttribute('onclick').match(onclickReg);
						var w = getWindowObject();
						var o = document.getElementById('worldmap');
						var span = document.createElement('span');
						var top = w.GetTop(o) + (Number(coords[2])+Number(coords[3]))/2;
						var left = w.GetLeft(o) + (Number(coords[0])+Number(coords[1]))/2;

						if (i == 32 && document.getElementsByTagName('font')[0].innerHTML == "Акрит") {
							top += 32;
							left += 32;
						}

						span.setAttribute('class', 'slnk');
						span.setAttribute('style', "position:absolute; top:" + top + "px; left:" + left + "px; color:orange; font-size:12pt;");
						span.setAttribute('onclick', tables[i].getElementsByTagName('span')[0].getAttribute('onclick'));
						span.setAttribute("tooltip", tables[i].rows[0].cells[4].innerHTML);
						var s = contName.split(" ");
						if (s != contName) {
							for (j = 0; j < s.length; j++) {
								span.appendChild(document.createTextNode(s[j]));
								span.appendChild(document.createElement("br"));
							}
						} else {
							span.appendChild(document.createTextNode(contName));
						}
						document.getElementById('worldmap').parentNode.appendChild(span);
					}
				}
			} else if (document.URL == "http://warchaos.ru/f/a") {
				setTimeout(addAdditionalNav, 100);	
				var wc_ifr = document.getElementById("ifr");
				if (wc_ifr) {
					wc_ifr.addEventListener("load", function() {
						setTimeout(addAdditionalNav, 100);
					}, false);
				}
			}
		})();
		


	} // source

	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
})();
