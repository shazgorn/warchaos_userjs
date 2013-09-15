// ==UserScript==
// @name           Warchaos Fleet Movement
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Move vessel by dblclick
// @include        http://warchaos.ru/f/a
// @match          http://warchaos.ru/f/a
// ==/UserScript==

(function() {
	function source() {
		var destX = 0, destY = 0;

		function move() {
			var units = [9252, 9032, 9262, 9042, 9242, 9232, 9052]; // units allowed to move
			var dmap = window.top.document.getElementById("dmap");
			var map = dmap.getElementsByTagName("table")[1];
			var row = map.rows[parseInt(map.rows.length/2)];
			var cell = row.cells[parseInt(row.cells.length/2)];
			if (cell.hasChildNodes() && cell.childNodes[0].hasAttribute("src")) {
				var src = parseInt(cell.childNodes[0].getAttribute("src").match(/\d+/)[0]);
				var coords = cell.childNodes[0].getAttribute("sck").match(/(\d+),(\d+)/);
				var curX = parseInt(coords[1]), curY = parseInt(coords[2]);
				for (var i = 0; i < units.length; i++) {
					if (src == units[i]) {
						if (destX != 0 && destY != 0) {
							if (curX == destX && curY == destY) {
								destX = 0;
								destY = 0;
							} else if (curX > destX && curY > destY && !map.rows[parseInt(map.rows.length/2)-1].cells[parseInt(row.cells.length/2)-1].hasAttribute("background")) {
								move1(0);
							} else if (curX == destX && curY > destY && !map.rows[parseInt(map.rows.length/2)-1].cells[parseInt(row.cells.length/2)].hasAttribute("background")) {
								move1(1);
							} else if (curX < destX && curY > destY && !map.rows[parseInt(map.rows.length/2)-1].cells[parseInt(row.cells.length/2)+1].hasAttribute("background")) {
								move1(2);
							}  else if (curX > destX && curY == destY && !cell.previousSibling.hasAttribute("background")) {
								move1(3);
							} else if (curX < destX && curY == destY && !cell.nextSibling.hasAttribute("background")) {
								move1(5);
							} else if (curX > destX && curY < destY && !map.rows[parseInt(map.rows.length/2)+1].cells[parseInt(row.cells.length/2)-1].hasAttribute("background")) {
								move1(6);
							} else if (curX == destX && curY < destY && !map.rows[parseInt(map.rows.length/2)+1].cells[parseInt(row.cells.length/2)].hasAttribute("background")) {
								move1(7);
							} else if (curX < destX && curY < destY && !map.rows[parseInt(map.rows.length/2)+1].cells[parseInt(row.cells.length/2)+1].hasAttribute("background")) {
								move1(8);
							}
						}
						return;
					}
				}
			}	
		}
		
		function move1(arr) {
			var button = document.getElementById("nav" + arr);
			button.click();
		}
		
		addEventListener("mousedown", function(e) {
			if (e.button == 2) {
				destX = 0;
				destY = 0;
			}
		}, false);
		
		addEventListener("dblclick", function(e) {
			var m = e.target.getAttribute("tooltip").match(/Вода x\:(\d+) y:(\d+)/);
			if (m) {
				destX = parseInt(m[1]);
				destY = parseInt(m[2]);
			}
			move();
		}, false);
		
		(function(f) {
			var wc_ifr = document.getElementById("ifr");
			if (wc_ifr) {
				wc_ifr.addEventListener("load", function() {
					setTimeout(move, 100);
				}, false);
			}
			//f();
		})(move);
	};
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
})();
