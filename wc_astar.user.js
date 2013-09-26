// ==UserScript==
// @name           Warchaos Astar
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    You can your fleet like in heroes game
// @include        http://warchaos.ru/f/a
// @match          http://warchaos.ru/f/a
// ==/UserScript==


(function() {
	function source() {
		(function astar_module() {
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

			var brownDot = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAQdSURBVHja7FdfTFtVGP+d0l4KZYVVVoZTxmTDztIxkAUHAVncnHHDPZi9TF98XuLL4kxMnA/zxSU+aKJziTPGV2P8M1yiM4qMuQ2QDd0Yk7E/ZYUy6ITRQkt7e/zO7dllJANKvSTG3Jt8t98599xzfvf3/S3jnOO/fDEToAnQBGgCNAH+TwC+f+TIQ+f5B2/aYLX5wNjzJF7YFD+crjbm3dIJ75YJWqIutO+BgwcXPNea6ZdpwLKsdbBkHUYi3qA/mIkBkcm3+N2RvzBw6T22aetJlHrG6Ekik3MsGYH7+G03LJZvoCZakVQbHrooFi3Hjb7j/NSXP+Fiex3N5AmLLfUsawbgioixM+C8bNZRLBzrPENwOMOITCi41V9C4LO0Z1NhLz976ltmd7wGT1UrzQiz82UBSGZViLmWOeBqmq6wito+5DlvkbkDxOgkxkNu3ttVj+62nSmzRwv46e+PseK1+5Dv6qCZcLogl8ag1dZM7NXoxL34SgfW+zopOLpp2EcyQn4ZwyNFCmvY9SOcBed563eHUkxOunnXL/vZcy/fodFVAdtQgPzTd3Ohqnoos607L2HDpk5Sfybp0sDNPTSAyvoARodzcLnzDW2m78Iu1Gw7QSyKtaPpsJh+kMSiPvDkE5qemzcNX+1l0jqkBMQKeeB9EeMhVlbxCey5N7X3EnEFVwkksCZdctIHyNh2XS/1DCM75zppvSR3Fsh1SQqeQfLPr3VL3B7YTD8lJA5jAXJepesO5z0KltsSXHyRNxPkGjf1Ufiei+6PyrRjIEAle2w2GUcZmXuStGgafsRp/aw5s3PEB60QmrEAHc7Ts+5/o5gqRq70I7ZIarLS2np9Ys26+8GkGgtwdckZUbo1fSy4Ctd7K0krWHQPm+JFPL5Hd+WNT1+TER82FCCrrBtC4epjkhdGifdVYrKaBvnzsciPvuOiivIZaamqst7nh8st/NFvOEBKvnG2sfojSsSpjacjK3jLFx/i91+b8feo68G9yKwWfvRQORIzPyCZrE6dlKWy+hf+oGwgkvSgTEOGVhKO6sZ+hEYOoLcrxWR0aiVvP/k5rnS3INt+ArHpYcqXOVDsjRQY++dYoOmlHhQUitz5p3CS5Sl15Nxsx96vuGJ3U4dyWJ8NBXfTffe87tG05yIqan8j9RyJ8MHp5epmxFePs2ebj2PthgC/0P46/P2b5139eFmQNTb3oLBYsHZWlsS7y9bNyEvVEnSpp4U9VtaP8bFnMHitjg8OPIWJ0CrqpiOs9MkASsr9yF85RL4nKk6PbBBCS21cM+2oVc2PrLYIseMnaWNVDcU0VySTcESmkiDJsGwMppbC3L9u+eVhUzIig5IhUb4UWf7C0tdmMgFmBMAHgc5ImTD/dpoATYAmQBOgsdc/AgwATNKsLIjTNN8AAAAASUVORK5CYII=";
			var greenDot = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAQkSURBVHja7JjLbxtVFIfn4Rk7ftSO68wkcZq0CY3UpoEQgUCpwgrBoq3YIzasK7Gp6KKLbrqiEhskpHZR1H+goigRAoRQVVSgKapIaUhaJyGx42cmiR2/x/Pgd907aYSSxiljVKm2dDTnXt+5882552WzpmkyL/KHY17wTwuwBdgCbAG+7ICORhd+fvnyjvMz4zcFzuCHGZN5j2HYIU53RMWK+3Yg3XevPdWXwxL9WfueO3/eHsCdwFiDH2NN7pLB6ePWvMFrjCZWLlTd+cf5g8nPgskj33rXZQVfaf/bEc+OTUqsyd40Of2WyRrjO63RHbXBfDB1LX70/o9r4YUxTHkhbNOO+CnchGzwxh2GMQesOcCasFJCUNsKNWdZLAQyvSbOnXynidWhTN/sN3xN/DiQOXQLU+TYzaYA4lhFwExuhwvFBmfha3OAW2YNNm5yZl51FaWsvHxS6Zl/nx57IH1k5qp7M/ihWPFMYarQKOS+AGGUM/C3N6xxz9ybU/7V7nuw4X0M5yBpQFadJZ8o/33iB6HqvpsceHDxiSUrknIocrY7MpLB8BFEtRXw0VvfueFvW6EsLR176F8NA475CfI7gfvXQ+PBRH+84s21bcjLn5KJnBQ7FYodnYAVydrVRqzYcJAYjtowXK2//laqs9yeOjwDdYpKHFKlD7SEjBM+pesK/G+pvgenizlp5RTUcKPGaTyKTfZdS/VuyEleExeh/gXJPCPXGb71zpigur62Jop+ZQSXXojHXkDWfN1S8cBNBMsKhavtcaeGiF7aGjjLQVy6adqxDxAVQtnKcbxGMkseaqUBPzKxfus4OU0gL+SDOG0FdKiuny295F/rQupwUz9i90hNDqw9aY09uZAVTLqtgMhhdyxrVTy5DlSJ16AG9tqD0/khAH5gjQPp3nka8QVbAZEyEq7igauWR6b7H34ES45C9+9mRZTEIPzvK6j1qnJA6Y46S17ij1HbAZF8a/5M75doEOoba0LVFz129wulJ3IGjUFw+144Vg5wg6jV38NXR5/EGKfLS8cfQCNJOkbTkK2VxAytvBKpujfPZeVo3ZK6oLajhF3PSrFJXhcmdIeaRL5sQ0C9g2M9u/3mzoXhabHsJbnzT4jSlFJHnDv8ePQGrwkSOpRL1mTVs3kal9O73dS18OofweThX6D+BiE+WG5WN0PeOtu5OHzNm5XiSnj+k2JgdWS3xZ5sR6pz8cS0q+gnVvuVlsT1pnUzVhokCRrt1aQ7G4qobcW3ATkGOY4upkOouIu+DTnu3ZCi0BPwPVJxpmmDsLbfxvV5O2oCqaC7KSKyo5DbB+MDXZiTaRIu0lSSgiRpY1Daj+X+c8tPH1aiEZmiFiLlS6Tlr0B9TX0eMDsAt4OqVHJ2/6pjW/8PtgBbgC3AlxzwHwEGAMnet2y/NB7GAAAAAElFTkSuQmCC";
			var redDot = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAQ9SURBVHja7FhdTFNnGO7pzyktLbRMWgopAWRVy9CCbCMoXhlnFOO2ZFtidrNrk92YeLEsuxhXuuzGxERiXHblxZbNLSPLXMhiQCZDxdbNUpCfrl3/oCL0l/b09Oz5uu+YXoAUPV1M7EmenO/7znfOec7787xvywiCIHuRD7nsBT8qBCsEKwQrBF92gspSN355/vyG66eufqrKKVWdMhlzRGCYjpyS9SWrjaPzO/ffBtawhX/ac8+cPSsNwY2I8QplX16uGFTmuH5xXcVlZJp0/JPataVZq999btb25s/BRlsUl3L/m4vf/+Zzk8DIf1DwuRvyPN+/0R4Vt25rDM5c6Z34fmTXzK0+LOkApmwuLiJnVvDcOCMIO8U1kBUCTbZgWlOT0KZirCU01yzP5xTkWtV6omPv/ZEfM2rNR94Wxw0sEbcLZSEIt7IgM1xMzm0/ND3X3uNJaWv+FhhFgBH4uD6+YmpbmDqwZ/rmW9Tthu6pX4aiO5pPJXR1k1hKlEpyWwR5heoErNcjzm8e/GDSb33tNpJjClMPEBEYZWat1sTe6zr6a7La8EfPneHPqCVNdvfo6ck33l7CdAbIShqD71w7p0W8PUll177Df/maOwm53zAdAe4CC0AAWAScs7bey8jkL8R7Wryu47rECvlAQ6nxWDJBNrveyQj5NjJer9Kl59pff4DhJAUhlaFuE0HmQb/Vfimj1noL7spxLCGJYVOp3iuZICx1WBxDNkJZVkOs5QaWnqJ1+WDjLn9ao78mLpgjiw6cmoFqiWVG6BJHeGEMyfIPJcdtcWMOoeEVJ5p0rA6nRio70hFEhYgWiTEDd8eJt0vIRgH7n7iTU1WRD9IDakkJQuPGxHH9steCl2ppHDFbSJMSew+I84i5NUIzmJeUYHSHdRxcCtYyPo7UNwU8+2g2yrewfAeS46Q4X2ztmiM8qRZKRxCSEVw1mIfElIHwfmha8nZjUruZFd/7drAO5fAr7C9UFb+1wxerqSfx6JOcIMSXW2x1XESDUHiwOpPU949dvWB3j52oiS3XFT8LbpWDnA2Wu45Y7S6ks1zBOx1H7kMNiEj7qQxJWkmE6T0HH6JLOYMyNvQfyZTR4bz+dYvXOYzg/4nNpkNoEjScSn0IcXe6+Oa7+4+74vpXiHb+SSKmLKWOBPdE77vfgYAJHcqguGhYjQzgNLDZTXd6BpwQ9t8xnABIDKbL1c2Qr16FNa6ELK8GdnvGP24Izzs22xwxt4Wnuo+5HhsbiNVuEa7AStm6GbFnIAKNajIMyXiojz/qbQgv9Jkj83Z0MfUJnTGJa4GQpZ101kHEHqk4LtogPNpu4/qsHTUhGUV3k1w1NPiAUc/uPgupZFSEk1RKwkAIWAZS27Hcc7f89GUpmpFhaiFSvlha/hI01rLPQkwKgsVEsxRrUv+qYyr/D1YIVghWCL7kBP8VYADwJLhW1KDHiwAAAABJRU5ErkJggg==";
			function Node(x, y, cell, i, j, map) {
				this.x = x;
				this.y = y;
				this.state = 0; // 0 - unexplored, 1 - open, 2 - close
				this.cost = 1;  // cost to step into this node
				this.g = 0;
				this.h = 0; // heuristic
				this.f = 1;
				this.parent = null;
				this.cell = cell;
				this.i = i;
				this.j = j;
				this.accessible = 0;
				this.map = map;
				this.enemyOnAdjCell = null;
			}
			
			Node.prototype.checkForEnemyOnCell = function(dx, dy) {
				if ((this.i + dy > 0) && (this.i + dy < this.map.rows.length)
					&& (this.j + dx > 0) && (this.j + dx < this.map.rows[this.i].cells.length)) {
					var adjCell = this.map.rows[this.i+dy].cells[this.j+dx];
					if (adjCell.childNodes.length == 3
						&& adjCell.childNodes[2].hasAttribute("class")
						&& adjCell.childNodes[2].getAttribute("class") == "ind4") {
						return true;
					}
				}
				return false;
			}
			
			Node.prototype.checkForEnemyOnAdjCell = function() {
				if (this.enemyOnAdjCell == null) {
					var arr = [
						this.checkForEnemyOnCell(-1, -1),
						this.checkForEnemyOnCell(-1, 0),
						this.checkForEnemyOnCell(-1, 1),
						this.checkForEnemyOnCell(0, -1),
						this.checkForEnemyOnCell(0, 1),
						this.checkForEnemyOnCell(1, -1),
						this.checkForEnemyOnCell(1, 0),
						this.checkForEnemyOnCell(1, 1),
					];
					for (var i = 0; i < arr.length; i++) {
						if (eval(arr[i]) == true) {
							this.enemyOnAdjCell = true;
							return true;
						}
					}
					this.enemyOnAdjCell = false;
				}
				return this.enemyOnAdjCell;
			}
			
			Node.prototype.addToOpenList = function(openList, m, dx, dy) {
				if (this.i + dy >= 0 && this.j + dx >= 0 && this.i + dy < m.length && this.j + dx < m[0].length) {
					var el = m[this.i+dy][this.j+dx];
					if (this.checkForEnemyOnAdjCell() && el.checkForEnemyOnAdjCell())
						return;
					// check in openList for present in there
					if (el != null && el.accessible) {
						if (el.state == 1) {
							if (el.g > el.parent.g + el.cost) {
								el.parent = this;
							}
						}
						if (el.state == 0 && openList.indexOf(el) == -1) {
							el.state = 1;
							el.parent = this;
							el.cell.setAttribute("class", "open");
							//el.h = Math.max(Math.abs(finish.x - el.x), Math.abs(finish.y - el.y)) - 2;
							el.h = 0;
							if (el.parent != null) {
								el.g = el.parent.g + el.cost;
							}
							el.f = el.h + el.g;
							openList.push(el);
						}
					}
				}
			}

			function findMinNode(openList) {
				var min = Number.MAX_VALUE, minNode = null;
				for (var i = 0; i < openList.length; i++) {
					if (openList[i].f < min) {
						min = openList[i].f;
						minNode = openList[i];
					}
				}
				return minNode;
			}
			
			function findMoves() {
				var fonts = document.getElementsByTagName("font");
				for (var i = 0; i < fonts.length; i++) {
					if (fonts[i].innerHTML == "Ходы:") {
						return parseFloat(fonts[i].parentNode.nextSibling.innerHTML);
					}
				}
				return -1;
			}
			function isMarker(cell) {
				if (cell.hasAttribute("background")) {
					var img = cell.childNodes[0];
					if (img.src == "206.gif" || img.src == "56.gif" || img.src == "76.gif") {
						var m = img.match(/<i>(.*)<\/i>/);
						if (m)
							return m[1];
					} else
						return null;
				}
			}
			function astar(destX, destY) {
				if (typeof destX === "undefined" || typeof destY === "undefined") {
					destX = 0;
					destY = 0;
				}
				var map = window.top.document.getElementById("dmap").getElementsByTagName("table")[1];
				$("img[src='" + redDot + "']").remove();
				$("img[src='" + greenDot + "']").remove();
				$("img[src='" + brownDot + "']").remove();
				var cult = sessionStorage.getItem("cult") == null ? "" : sessionStorage.getItem("cult");
				var m = new Array();
				activeUnit = $("button[class='but40'][onclick='cm6();'] img").get(0).getAttribute("src").match(/(\d+)\.gif/)[1];
				for (var i = 0; i < map.rows.length; i++) {
					m.push(new Array());
					for (var j = 0; j < map.rows[i].cells.length; j++) {
						var cell = map.rows[i].cells[j];
						var match = cell.childNodes[0].getAttribute("tooltip").match(/(\d+) y:(\d+)/);
						var node = new Node(parseInt(match[1]), parseInt(match[2]), cell, i, j, map);
						match = parseInt(cell.childNodes[0].getAttribute("src").match(/(\d+)\.gif/)[1]);
						if (activeUnit == 9000 || activeUnit == 9180 || activeUnit == 9122)
							node.enemyOnAjdCell = false;
						// ground unit
						if (parseInt(activeUnit / 1000) == 9 && parseInt(activeUnit % 10) == 0 ||
							activeUnit == 9152 || activeUnit == 9102 || activeUnit == 9062 || activeUnit == 9092 || activeUnit == 142) {
							// you can move throw your town || naked hero... i know this looks bad
							if (cell.hasAttribute("background")
								&& !((cell.childNodes[0].hasAttribute("style") && match && (match == 23 || match == 13 || match == 3 || match == 142))
									|| (activeUnit == 9000 && match && (match == 23 || match == 13 || match == 3 || match == 332))
							)) {
								node.accessible = 0;
							} else {
								node.accessible = 1;
							}
							if (node.accessible) {
								// basic terrain
								if (match >= 48 && match <=58)
									node.cost = 1; // just to make sure
								// mountain
								else if (match >= 80 && match <= 84)
									node.cost = 3;
								// forest
								else if (match >=64 && match <= 78)
									node.cost = cult == "лесов" &&
									!(activeUnit == 9152 || activeUnit == 9102 || activeUnit == 9062 || activeUnit == 9092) ? 1 : 2;
								// swamp
								else if (match >= 112 && match <= 119)
									node.cost = 2;
								// roads
								else if (match >= 96 && match <= 110)
									node.cost = cult == "лесов" &&
									!(activeUnit == 9152 || activeUnit == 9102 || activeUnit == 9062 || activeUnit == 9092) ? 1 : 0.5;
								// own town
								else if ((match == 23 || match == 13 || match == 3))
									node.cost = 0.5;
								else
									node.accessible = 0;
							}
						// naval unit
						} else if (activeUnit == 9252 || activeUnit == 9032 || activeUnit == 9262 || activeUnit == 9042 || activeUnit == 9242 ||
								   activeUnit == 9232 || activeUnit == 9052) {
							if (cell.hasAttribute("background")) {
								var background = cell.getAttribute("background").match(/(\d+).gif/)[1];
								if (match >= 32 && match <= 47)
									node.accessible = 1;
							} else {
								if (background >= 32 && background <= 47)
									node.accessible = 1;
							}
							node.cost = 0.25;
						// air unit (zeppelin)
						} else if (activeUnit == 9122) {
							node.accessible = cell.hasAttribute("background") ? 0 : 1;
							node.cost = 1;
						}
						m[m.length-1].push(node);
					} // for cells
				} // for rows
				var curI = parseInt(m.length/2), curJ = parseInt(m[parseInt(m.length/2)].length/2);
				var start = m[curI][curJ];
				var finish = null;
				for (var i = 0; i < m.length; i++) {
					for (var j = 0; j < m[i].length; j++) {
						if (m[i][j] != null && m[i][j].accessible && m[i][j].x == destX && m[i][j].y == destY) {
							finish = m[i][j];
						}
					}
				}
				if (finish == null)
					return;
				finish.accessible = 1;
				var openList = new Array();
				var closeList = new Array();
				start.state = 1;
				start.accessible = 1;
				openList.push(start);

				for (var loops = 0; loops < 4000; loops++) {
 					curNode = findMinNode(openList);
					if (curNode != null) {
						openList.splice(openList.indexOf(curNode), 1);
						curNode.state = 2;
						closeList.push(curNode);
						if (curNode === finish)
							break;
						curNode.addToOpenList(openList, m, -1, 0);
						curNode.addToOpenList(openList, m, 0, -1);
						curNode.addToOpenList(openList, m, 0, 1);
						curNode.addToOpenList(openList, m, 1, 0);
						curNode.addToOpenList(openList, m, -1, -1);
						curNode.addToOpenList(openList, m, -1, 1);
						curNode.addToOpenList(openList, m, 1, -1);
						curNode.addToOpenList(openList, m, 1, 1);
					} else {
						break; // you can`t access that node
					}
				}
				var sum = 0;
				curNode = finish;
				var moves = findMoves();
				while (curNode !== start && curNode != null && finish.parent != null) {
					sum += curNode.g;
					var img = document.createElement("img");
					if (curNode.g <= moves) {
						if (curNode.checkForEnemyOnAdjCell() == true) {
							img.setAttribute("src", redDot);
						} else {
							img.setAttribute("src", greenDot);
						}
					} else {
						img.setAttribute("src", brownDot);
					}
					img.setAttribute("style", "display:block;position:relative;top:-20px;margin:-20px;");
					img.setAttribute("tooltip", curNode.g);
					curNode.cell.appendChild(img);
					if (curNode.parent === start) {
						return curNode;
					} else {
						curNode = curNode.parent;
					}
				}
				return null; // finish
			} // function astar
			
			if (typeof $ === "undefined") {
				addScript("http://code.jquery.com/jquery-1.9.1.js");
			}
			if (typeof $ === "undefined") {
				setTimeout(astar_module, 1000);
				return;
			}
			var prevDestX = 0, prevDestY = 0;
			$("td").click(function(e) {
				if (e.altKey || e.shiftKey || e.ctrlKey || e.target.hasAttribute("background") || e.target.parentNode.hasAttribute("background")) {
					prevDestX = 0;
					prevDestY = 0;
				} else if (e.target.getAttribute("src") == redDot ||
						   e.target.getAttribute("src") == greenDot || e.target.getAttribute("src") == brownDot) {
					var m = e.target.parentNode.childNodes[0].getAttribute("tooltip").match(/(\d+) ..(\d+)/);
					if (prevDestX == parseInt(m[1]) && prevDestY == parseInt(m[2])) {
						move(parseInt(m[1]), parseInt(m[2]));
					} else {
						astar(parseInt(m[1]), parseInt(m[2]));
					}
					prevDestX = parseInt(m[1]);
					prevDestY = parseInt(m[2]);
				} else if (e.target.hasAttribute("tooltip") && !e.target.parentNode.hasAttribute("background")) { // only empty cells
					var m = e.target.getAttribute("tooltip").match(/(\d+) ..(\d+)/);
					prevDestX = parseInt(m[1]);
					prevDestY = parseInt(m[2]);
					astar(parseInt(m[1]), parseInt(m[2]));
				}
			});
			function allowMovement() {
				if (h1win)
					return false;
				if ($("font[color='black']").length != 0) {
					if ($("font[color='black']").html().search(/ставк|ресурсы|предметы/) != -1) {
						return true;
					}
					return false;
				}
				return true;
			}
			function move(x, y) {
				if (prevDestX != 0 && prevDestY != 0 && allowMovement()) {
					var nodeToMove = astar(prevDestX, prevDestY);
					if (nodeToMove && nodeToMove.g <= findMoves()) {
						cmIComm(2,nodeToMove.x, nodeToMove.y,'');
					}
				} else {
					prevDestX = 0;
					prevDestY = 0;
				}
			}
			addEventListener("mousedown", function(e) {
				if (e.button == 2) {
					prevDestX = 0;
					prevDestY = 0;
				}
			}, false);
			(function(f) {
				var wc_ifr = document.getElementById("ifr");
				if (wc_ifr) {
					wc_ifr.addEventListener("load", function() {
						setTimeout(move, 100);
					}, false);
				}
			})(move);
			if (sessionStorage.getItem("cult") == null) {
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
		})(); // astar_module
		
	}
	
	//addEventListener("load", astar_module, false);
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
})();
