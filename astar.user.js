// ==UserScript==
// @name           Warchaos Astar
// @include        http://warchaos.ru/f/a
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


			function Node(x, y, cell, i, j) {
				this.x = x;
				this.y = y;
				this.state = 0; // 0 - unexplored, 1 - open, 2 - close
				this.cost = 1; // cost to step into this node
				this.g = 0;
				this.h = 0; // heuristic
				this.f = 1;
				this.parent = null;
				this.cell = cell;
				this.i = i;
				this.j = j;
				this.accessible = 0;
			}

			function addToOpenList(openList, el, parent, finish) {
				// check in openList for present in there
				if (el != null && el.accessible) {
					if ( el.state == 1) {
						if (el.g > el.parent.g + el.cost) {
							el.parent = parent;
						}
					}
					if (el.state == 0 && openList.indexOf(el) == -1) {
						el.state = 1;
						el.parent = parent;
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

			function checkForFinish(openList, finish) {
				for (var i = 0; i < openList.length; i++) {
					if (openList[i] === finish) {
						console.log("finish");
						return true;
					}
				}
			}

			function findMinNode(openList) {
				var min = Number.MAX_VALUE, minNode;
				
				for (var i = 0; i < openList.length; i++) {
					if (openList[i].f < min) {
						min = openList[i].f;
						minNode = openList[i];
					}
				}
				return minNode;
			}
			
			function astar(destX, destY, map) {
				if (typeof destX === "undefined" || typeof destY === "undefined") {
					destX = 362;
					destY = 271;
				}
				var m = new Array();
				var activeUnit = parseInt(map.rows[parseInt(map.rows.length/2)].cells[parseInt(map.rows[parseInt(map.rows.length/2)]
																							   .cells.length/2)].childNodes[0].getAttribute("src").match(/(\d+)\.gif/)[1]);
				for (var i = 0; i < map.rows.length; i++) {
					m.push(new Array());
					for (var j = 0; j < map.rows[i].cells.length; j++) {
						var cell = map.rows[i].cells[j];
						//var node = new Node(map.rows[i].cells[j].getAttribute("x"), map.rows[i].cells[j].getAttribute("y"), map.rows[i].cells[j], i, j);
						//var match = parseInt(map.rows[i].cells[j].getAttribute("style").match(/(\d+)\.gif/)[1]);
						var match = map.rows[i].cells[j].childNodes[0].getAttribute("tooltip").match(/(\d+) y:(\d+)/);
						var node = new Node(parseInt(match[1]), parseInt(match[2]), cell, i, j);
						if (cell.hasAttribute("background")) {
							match = parseInt(cell.getAttribute("background").match(/(\d+)\.gif/)[1]);
						} else {
							match = parseInt(cell.childNodes[0].getAttribute("src").match(/(\d+)\.gif/)[1]);
						}
						
						
						if (ground = 0) {
							if (match >= 80 && match <= 84)
								node.cost = 3;
							else if ((match >=64 && match <= 78) || (match >= 112 && match <= 119))
								node.cost = 2;
							else if (match >= 96 && match <= 110)
								node.cost = 0.5;
						} else if (activeUnit > 9232 && activeUnit < 9282) {  // naval
							if (cell.childNodes.length > 1 && cell.childNodes[1].getAttribute("src") != "216.gif") {
								node.accessible = 0;
							} else if (match >= 32 && match <= 47) {
								node.accessible = 1;
							} 
						}
						m[m.length-1].push(node);
					}
				}
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
					openList.splice(openList.indexOf(curNode), 1);
					curNode.state = 2;
					//curNode.cell.setAttribute("class", "close");
					closeList.push(curNode);
					if (curNode === finish)
						break;
					if (curNode.i > 0) {
						if (curNode.j > 0)
							addToOpenList(openList, m[curNode.i-1][curNode.j-1], curNode, finish);
						addToOpenList(openList, m[curNode.i-1][curNode.j], curNode, finish);
						if (curNode.j < m[curNode.i-1].length-1)
							addToOpenList(openList, m[curNode.i-1][curNode.j+1], curNode, finish);
					}
					if (curNode.j > 0)
						addToOpenList(openList, m[curNode.i][curNode.j-1], curNode, finish);
					if (curNode.j < m[curNode.i].length-1)
						addToOpenList(openList, m[curNode.i][curNode.j+1], curNode, finish);
					if (curNode.i < m.length-1) {
						if (curNode.j > 0)
							addToOpenList(openList, m[curNode.i+1][curNode.j-1], curNode, finish);
						addToOpenList(openList, m[curNode.i+1][curNode.j], curNode, finish);
						if (curNode.j < m[curNode.i+1].length-1)
							addToOpenList(openList, m[curNode.i+1][curNode.j+1], curNode, finish);
					}
				}
				var sum = 0;
				curNode = finish;
				while (curNode !== start) {
					sum += curNode.g;
					var img = document.createElement("img");
					img.setAttribute("src", "216.gif");
					img.setAttribute("style", "display:block;position:relative;top:-20px;margin:-20px;");
					//if (!curNode.cell.hasChildNodes())
					curNode.cell.appendChild(img);
					if (curNode.parent === start) {
						console.log(curNode);
						return curNode;
					} else {
						curNode = curNode.parent;
					}
				}
				//prevDestX = 0;
				//prevDestY = 0;
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
				console.log(e.target);
				var dmap = window.top.document.getElementById("dmap");
				var map = dmap.getElementsByTagName("table")[1];
				//$("td").attr("class", "default");
				//$("img[src$='216.gif']").remove();
				if (e.target.hasAttribute("background") || e.target.parentNode.hasAttribute("background")) {
					prevDestX = 0;
					prevDestY = 0;
				} else
				if (e.target.getAttribute("src") == "216.gif") {
					//console.log(e.target.parentNode.childNodes[0]);
					var m = e.target.parentNode.childNodes[0].getAttribute("tooltip").match(/(\d+) ..(\d+)/);
					if (prevDestX == parseInt(m[1]) && prevDestY == parseInt(m[2])) {
						console.log("move");
						move(parseInt(m[1]), parseInt(m[2]));
					} else {
						$("img[src$='216.gif']").remove();
						astar(parseInt(m[1]), parseInt(m[2]), map);
					}
					prevDestX = parseInt(m[1]);
					prevDestY = parseInt(m[2]);
					return;
				} else if (e.target.hasAttribute("tooltip") && !e.target.parentNode.hasAttribute("background")) { // only empty cells
					$("img[src$='216.gif']").remove();
					var m = e.target.getAttribute("tooltip").match(/(\d+) ..(\d+)/);
					prevDestX = parseInt(m[1]);
					prevDestY = parseInt(m[2]);
					astar(parseInt(m[1]), parseInt(m[2]), map);
				}
				
			});
			//var globalDestX = 0, globalDestY = 0;
			function move(x, y) {
				if (prevDestX != 0 && prevDestY != 0) {
					var dmap = window.top.document.getElementById("dmap");
					var map = dmap.getElementsByTagName("table")[1];
					var nodeToMove = astar(prevDestX, prevDestY, map);
					if (nodeToMove)
						cmIComm(2,nodeToMove.x, nodeToMove.y,'');
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
		})(); // astar_module
		
	}
	
	//addEventListener("load", astar_module, false);
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
})();
