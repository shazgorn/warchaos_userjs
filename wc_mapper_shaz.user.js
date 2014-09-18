// ==UserScript==
// @name           Warchaos Mapper for Mortal
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Mapper use iframe and window.postMessage
// @include        http://dragonmap.ru/thispageshouldneverexist
// @include        http://warchaos.ru/*
// @include        http://warchaos.ru/f/a
// @include        http://warchaos.ru/snapshot/*
// @include        http://warchaos.ru/~snapshot/*
// @match          http://dragonmap.ru/thispageshouldneverexist
// @match          http://warchaos.ru/*
// @match          http://warchaos.ru/f/a
// @match          http://warchaos.ru/snapshot/*
// @match          http://warchaos.ru/~snapshot/*
// @version        1.0
// @downloadURL    https://raw.githubusercontent.com/shazgorn/warchaos_userjs/master/wc_mapper_shaz.user.js
// ==/UserScript==


(function() {
	 // return;

	function source() {
		parseMapAndDoSomeOtherStaff.WORLD = "Мортал";

		function l() {
			var t = "";
			for (var i = 0; i < arguments.length; i++)
				t += arguments[i] + ' ';
			if (navigator.appName == "Opera")
				opera.postError(new Date().toTimeString() + ": " + t);
		}

		function insertAfter(el1, el2) {
			if (!el2.parentNode) return;
			if (el2.nextSibling)
				el2.parentNode.insertBefore(el1,el2.nextSibling);
			else
				el2.parentNode.appendChild(el1);
		}

		function ajaxRequest(url, method, param, onSuccess, onFailure, args) {
			var xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open(method, url, true);
			xmlHttpRequest.setRequestHeader('Content-Type', 'text/plain');
			xmlHttpRequest.onreadystatechange = function (e) {
				if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
					onSuccess(xmlHttpRequest, args);
				}
				else if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200)
					onFailure(xmlHttpRequest);
			};
			xmlHttpRequest.send(param);
		}

		function addOptionsButton() {
			// this button will show map in iframe. uncomment it in parseMapAndDoSomeOtherStaff()
			var cntr = document.getElementById('cntr');
			if (cntr) {
				var tbl = cntr.parentNode.parentNode.parentNode.parentNode;
				var b = document.createElement('button');
				b.setAttribute('class', 'but40');
				var img = document.createElement('img');
				img.setAttribute('src', 'ctrl/map.gif'); //http://warchaos.ru/fp
				b.appendChild(img);
				if (tbl.rows.length == 4) {
					tbl.insertRow(4).insertCell(0).appendChild(b);
					b.addEventListener('click', function() {
						var sd_map_iframe = document.getElementById('sd_map');
						if (sd_map_iframe) {
							if (sd_map_iframe.getAttribute('style').search('display: none') == -1) {
								sd_map_iframe.setAttribute('style', 'width: 1000px; height: 1000px; margin: 30px 50px 30px 50px; display: none;');
								sd_map_iframe.setAttribute('src', 'http://dragonmap.ru/404');
							}
							else {
								sd_map_iframe.setAttribute('style', 'width: 1000px; height: 1000px; margin: 30px 50px 30px 50px; display: inline;');
								sd_map_iframe.setAttribute('src', 'http://dragonmap.ru/mortal/');
							}
						}
					}, false);
				}
			}
		}
		/**
		 * parse table with map, return string for server
		 */
		function parseMap(tbl) {
			if (typeof tbl == 'undefined') {
				return;
			}
			var m = '';
			var bgReg = /land\d\/(\d+)\.gif/; //landscape
			var xyReg = /x\:(\d+) y\:(\d+)/; //cell coords example: x:424 y:270
			var delReg = /<(?:\w+|\s|=|\/|#|:|\.)+>/gi; //delete tags
			for (var i = 0; i < tbl.rows.length; i++) {
				for (var j = 0; j < tbl.rows[i].cells.length; j++) {
					var c = tbl.rows[i].cells[j];
					if (c.hasAttribute('background')) {
						//unit on the ground
						var res = bgReg.exec(c.getAttribute('background'));
						if (res != null) {
							var img = c.getElementsByTagName('img')[0];
							var xy = xyReg.exec(img.getAttribute('tooltip'));
							if (xy && (img.getAttribute('tooltip').search("Темнота") == -1) ) {
								m += (xy[1] * 10000 + xy[2] * 1) + '$';
								m += res[1];
								res = img.getAttribute('src').replace('.gif','');
								if (res != 19 && res != 29 && res != 39 && res != 49 && res != 59 && res != 69) {  //peon
									m += '$' + res;
									var d = img.getAttribute('tooltip');
									d = d.replace(delReg,'');
									d = d.split('$');
									for (var n = 0; n < d.length-1; n++) {
										m += '$' + d[n];
									}
								}
								m += '&';
							}
						}
					} else {
						//ground
						var img = c.getElementsByTagName('img')[0];
						if (img) {
							var res = bgReg.exec(img.getAttribute('src'));
							if (res != null) {
								var xy = xyReg.exec(img.getAttribute('tooltip'));
								if (xy && (img.getAttribute('tooltip').search("Темнота") == -1) ) {  //terra incognita check
									m += (xy[1] * 10000 + xy[2] * 1) + '$';
									m += res[1] + '&';
								}
							}
						}
					}
				}
			}
			return m;
		}

		/**
		 * Desc: this fun will be called from async XHR. Fun should parse profile page(XHR.responseText), get nickname and world.
		 */
		function addToAccounts(XHR) {
			// >Мир:</td><td>Лиаф</td>
			var nickname = XHR.responseText.match(/color=#182809>([^<]+)/)[1];
			var world = XHR.responseText.match(/>[^<]+<\/td><td>[^<]+<\/td>/g)[1].match(/>[^<]+<\/td><td>([^<]+)<\/td>/)[1];
			var accounts = sessionStorage.getItem('accounts');
			if (accounts == null) {
				accounts = new Array();
			} else {
				accounts = accounts.split(',');
			}
			accounts.push(nickname);
			accounts.push(world);
			localStorage.setItem('accounts', accounts);
			return world;
		}

		function findWorldByPlayersName(name) {
			var accounts = sessionStorage.getItem('accounts');
			if (accounts == null) {
				accounts = new Array();
			} else {
				accounts = accounts.split(',');
				for (var i = 0; i < accounts.length; i += 2) {
					if (accounts[i] == name) {
						return accounts[i+1];
					}
				}
			}
			return null;
		}

		function formRequest(tbl) {
			var m = parseMap(tbl);
			if (!(m == null || (m != null && m.length <= 0))) {
				var nickname = localStorage.getItem('nickname');
				while (nickname == null) {
					nickname = prompt("Введите ваш ник", "nickname");
					if (nickname != 'nickname' && nickname != 'new-dragon' && nickname != '' && nickname != null) {
						localStorage.setItem('nickname', nickname);
						break;
					}
				}
				return nickname + '&&' + m;
			}
		}

		/**
		 * Desc: add update map button on page with snapshot
		 */
		function addUpdateMapButton() {
			var b = document.createElement("input");
			b.setAttribute("type", "button");
			b.setAttribute("class", "cmb");
			b.setAttribute("style", "margin-left: 5%;");
			b.value = "Обновить карту";
			document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[0]
				.rows[0].cells[1].appendChild(b);
			b.addEventListener("click", function() {
				this.disabled = true;
				var tbl = document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[
					document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table").length - 2];  //snapshot
				var req = formRequest(tbl);
				document.getElementById('sd_map').contentWindow.postMessage(req, "http://dragonmap.ru/thispageshouldneverexist");
			}, false);
		}

		function addGoToMapLink() {
			var a = document.createElement("a");
			a.innerHTML = "На карту";
			a.target = "_blank";
			var tbl = document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[
					document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table").length - 2];
			var xyReg = /x\:(\d+) y\:(\d+)/; //cell coords example: x:424 y:270
			var xy = tbl.rows[tbl.rows.length/2-0.5].cells[tbl.rows[0].cells.length/2-0.5].getElementsByTagName("img")[0].getAttribute("tooltip").match(xyReg);
			a.href = "http://dragonmap.ru/mortal?x=" + xy[1] + "&y=" + xy[2] ;
			document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[0]
				.rows[0].cells[1].appendChild(document.createTextNode(" / "));
			document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[0]
				.rows[0].cells[1].appendChild(a);
		}
		function notOnTournamentArena() {
			if (typeof window.top.sitt != "undefined") {
				for (var i = 0; i < window.top.sitt.length; i++) {
					if (window.top.sitt[i] == parseMapAndDoSomeOtherStaff.WORLD) {
						return false;
					}
				}
			}
			return true;
		}

		/**
		 * Description: find table with map, parse cells coordinates and terrain type, join them into single string, send to server
		 * Params:
		 * 	onButtonPress: true - function was called by onclick event handler. Map will be updated with info from snapshot.
		 */

		function parseMapAndDoSomeOtherStaff() {
			// addOptionsButton();

			if (location.href.search('snapshot') != -1) {
				// check if in database
				var nick = document.getElementsByTagName("div")[0].getElementsByTagName("table")[0].rows[0].cells[1]
					.getElementsByTagName('a')[0].innerHTML;
				var world = findWorldByPlayersName(nick);
				if (world == parseMapAndDoSomeOtherStaff.WORLD) {
					addGoToMapLink();
					addUpdateMapButton();
				} else if (world == null) {
					ajaxRequest(document.getElementsByTagName("div")[0].getElementsByTagName("table")[0].rows[0].cells[1]
								.getElementsByTagName('a')[0].href,
								'POST', '', function(XHR, args) {
									var world = addToAccounts(XHR);
									if (world == parseMapAndDoSomeOtherStaff.WORLD) {
										addGoToMapLink();
										addUpdateMapButton();
									}
								}, function() {},[]);
				}
			} else if (location.href.search("f/a") != -1 && notOnTournamentArena() && typeof window.top.players !== "undefined") {
				var tbl;  // table with map
				var dmap = top.document.getElementById('dmap');
				if (dmap) {
					tbl = dmap.firstChild.rows[1].cells[1].firstChild;   // game map
				} else if (document.getElementsByTagName('button')[0] && document.getElementsByTagName('button')[0].innerHTML == "Вернуться") {
					tbl = document.getElementsByTagName('button')[0].nextSibling;  // Observatory -> View
				}
				var req = formRequest(tbl);
				var world = findWorldByPlayersName(window.top.players[1]);
				if (world == parseMapAndDoSomeOtherStaff.WORLD) {
					document.getElementById('sd_map').contentWindow.postMessage(req, "http://dragonmap.ru/thispageshouldneverexist");
					var fonts = document.getElementsByTagName("font");
					if (fonts) {
						for (var i = 0; i < fonts.length; i++) {
							if (fonts[i].innerHTML == "Снэпшот успешно сделан.") {
								ajaxRequest('http://warchaos.ru/snapshots/0', 'POST', '', function(XHR, font) {
									font.innerHTML = "";
									// <a href=http://warchaos.ru/snapshot/2492/166&342096535/33929>Смотреть</a>
									var link = XHR.responseText.match(/a href\=(http\:\/\/[^>]+)>Смотреть/)[1];
									var a = document.createElement("a");
									if (link) {
										a.href = link;
										a.innerHTML = "Снэпшот успешно сделан.";
										font.appendChild(a);
									}
								},
											function() {
												// l('err')
											},
											fonts[i]
										   );
							}
						}
					}
				} else if (world == null) {
					ajaxRequest('http://warchaos.ru/~uid/', 'POST', '', function(XHR, args) {
						var world = addToAccounts(XHR);
						if (world == parseMapAndDoSomeOtherStaff.WORLD) {
							document.getElementById('sd_map').contentWindow.postMessage(args, "http://dragonmap.ru/thispageshouldneverexist");
						}
					}, function() {}, req);
				}
			}
		} // fun

		if (location.href.search(/snapshot|f\/a/) != -1) {
			var sd_map_iframe = document.createElement('iframe');
			sd_map_iframe.setAttribute('src', 'http://dragonmap.ru/thispageshouldneverexist');
			sd_map_iframe.setAttribute('id', 'sd_map');
			sd_map_iframe.setAttribute('style', 'width: 80%; height: 100%; margin: 30px 50px 30px 50px; display: none;'); //display: none;
			document.body.appendChild(sd_map_iframe);
			(function(f) {
				var wc_ifr = document.getElementById("ifr");
				if (wc_ifr)
					wc_ifr.addEventListener("load", function () {
						setTimeout(f, 0);
					}, false);
				f();
			})(parseMapAndDoSomeOtherStaff);
		} else if (location.href == "http://dragonmap.ru/thispageshouldneverexist") {
			addEventListener('message', function(e) {
				if (e.origin = 'http://warchaos.ru') {
					// l('incoming ' + ' from ' + e.origin + ' ' + e.data );
					var mapperURL = "http://dragonmap.ru/cgi-bin/mapper_mortal";
					ajaxRequest(mapperURL, 'POST', e.data, function(XHR) { /* l(XHR.responseText); */ }, function() {} );
				}
			}, false);
		}
		/*
		else {
			setTimeout(function() {
				var a = document.getElementById("scripts_options_a");
				if (a) {
					a.addEventListener("click", function() {
						setTimeout(function() {
							var div = document.getElementById("scripts_options_div");
							div.innerHTML += "<b>Warchaos Mapper for Liaf</b>";
						}, 0);
					}, false);
				}
			}, 0);

		}
		*/
	}
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
})();
