// ==UserScript==
// @name           Warchaos Astar
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    You can your fleet like in heroes game
// @include        http://warchaos.ru/f/a
// @match          http://warchaos.ru/f/a
// ==/UserScript==


(function() {
	"use strict";
	function source() {
		(function astar_module() {
			/* GLOBALS */
			var idRg = /(\d+).gif/,
				prevDestX = 0, 
				prevDestY = 0;

			function addScript(src) {
				var scripts = document.getElementsByTagName("script"), i, script;
				for (i = 0; i < scripts.length; i++) {
					if (scripts[i].getAttribute("src") === src) {
						return;
					}
				}
				script = document.createElement("script");
				script.src = src;
				document.head.appendChild(script);
			}
			var arrows = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAiVJREFUeF7t10FypDAUg+GcYo4x978dU168Gpfz49YzBtygxVfVUWiQRTb52bbNDsDQdBiaDsMRf7a/W9HmT4dhRj3aagNe0QfDjPjLq7XX3OWKLhiqaDQPmBAF26KrjLj0gKVcb8Aryn9yRQcMFXU5KrrCiMsO2BbbK+oBQSnlAf/DsIdK9YreOeJyA5ZCIwNecRByxXMxJL0hPhW9Y8Crnokh6RW6Y6BPlhqwlPGADMPWpzIe8CAPeNA3DjirM4ZZdwxYnhna3xW9Tr3vZWGYNavMiNEB22wUhll3DliU57cd9jrRtUdgmDWz0BF1j72hZnfFMGulAesuHnBAb8AzemKYtdqA0ccDDooR617tz7NgmHVGsaNowPg8E4ZZqw9Yf54Nw4wzyx1VDxjZbBhmrDpeES/XAw46e7wCQ9NhaDoMTYeh6TA0HYamw9B0GJoOQ9NhaDoMn2z2v3cYPt3METEcNfvtnim6Hu2LYdasMnc42htD1beORkbPgmFPPOgpw9VGzobhnqcO18qcE0PylvGCel4Ma3GjN40XlHNjGL5tuOg7A90zstqvoFZ/+Wzts1fS6/graK1+uDMpLxfDmnKTJ1LPjWErbvaWITNnxXDPG0bMnhHDnnjAU4fMngtDRT1kq732W4z0x/CtRl4+hqbD0HQYmg5D02FoOgxNh6HpMDQdhqbD0HQYmg5D02FoOgxNh6HpMDQdhqbD0HQYmmr7+QdukQFDT14TywAAAABJRU5ErkJggg==",
				brownDot = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAQdSURBVHja7FdfTFtVGP+d0l4KZYVVVoZTxmTDztIxkAUHAVncnHHDPZi9TF98XuLL4kxMnA/zxSU+aKJziTPGV2P8M1yiM4qMuQ2QDd0Yk7E/ZYUy6ITRQkt7e/zO7dllJANKvSTG3Jt8t98599xzfvf3/S3jnOO/fDEToAnQBGgCNAH+TwC+f+TIQ+f5B2/aYLX5wNjzJF7YFD+crjbm3dIJ75YJWqIutO+BgwcXPNea6ZdpwLKsdbBkHUYi3qA/mIkBkcm3+N2RvzBw6T22aetJlHrG6Ekik3MsGYH7+G03LJZvoCZakVQbHrooFi3Hjb7j/NSXP+Fiex3N5AmLLfUsawbgioixM+C8bNZRLBzrPENwOMOITCi41V9C4LO0Z1NhLz976ltmd7wGT1UrzQiz82UBSGZViLmWOeBqmq6wito+5DlvkbkDxOgkxkNu3ttVj+62nSmzRwv46e+PseK1+5Dv6qCZcLogl8ag1dZM7NXoxL34SgfW+zopOLpp2EcyQn4ZwyNFCmvY9SOcBed563eHUkxOunnXL/vZcy/fodFVAdtQgPzTd3Ohqnoos607L2HDpk5Sfybp0sDNPTSAyvoARodzcLnzDW2m78Iu1Gw7QSyKtaPpsJh+kMSiPvDkE5qemzcNX+1l0jqkBMQKeeB9EeMhVlbxCey5N7X3EnEFVwkksCZdctIHyNh2XS/1DCM75zppvSR3Fsh1SQqeQfLPr3VL3B7YTD8lJA5jAXJepesO5z0KltsSXHyRNxPkGjf1Ufiei+6PyrRjIEAle2w2GUcZmXuStGgafsRp/aw5s3PEB60QmrEAHc7Ts+5/o5gqRq70I7ZIarLS2np9Ys26+8GkGgtwdckZUbo1fSy4Ctd7K0krWHQPm+JFPL5Hd+WNT1+TER82FCCrrBtC4epjkhdGifdVYrKaBvnzsciPvuOiivIZaamqst7nh8st/NFvOEBKvnG2sfojSsSpjacjK3jLFx/i91+b8feo68G9yKwWfvRQORIzPyCZrE6dlKWy+hf+oGwgkvSgTEOGVhKO6sZ+hEYOoLcrxWR0aiVvP/k5rnS3INt+ArHpYcqXOVDsjRQY++dYoOmlHhQUitz5p3CS5Sl15Nxsx96vuGJ3U4dyWJ8NBXfTffe87tG05yIqan8j9RyJ8MHp5epmxFePs2ebj2PthgC/0P46/P2b5139eFmQNTb3oLBYsHZWlsS7y9bNyEvVEnSpp4U9VtaP8bFnMHitjg8OPIWJ0CrqpiOs9MkASsr9yF85RL4nKk6PbBBCS21cM+2oVc2PrLYIseMnaWNVDcU0VySTcESmkiDJsGwMppbC3L9u+eVhUzIig5IhUb4UWf7C0tdmMgFmBMAHgc5ImTD/dpoATYAmQBOgsdc/AgwATNKsLIjTNN8AAAAASUVORK5CYII=",
				greenDot = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAQkSURBVHja7JjLbxtVFIfn4Rk7ftSO68wkcZq0CY3UpoEQgUCpwgrBoq3YIzasK7Gp6KKLbrqiEhskpHZR1H+goigRAoRQVVSgKapIaUhaJyGx42cmiR2/x/Pgd907aYSSxiljVKm2dDTnXt+5882552WzpmkyL/KHY17wTwuwBdgCbAG+7ICORhd+fvnyjvMz4zcFzuCHGZN5j2HYIU53RMWK+3Yg3XevPdWXwxL9WfueO3/eHsCdwFiDH2NN7pLB6ePWvMFrjCZWLlTd+cf5g8nPgskj33rXZQVfaf/bEc+OTUqsyd40Of2WyRrjO63RHbXBfDB1LX70/o9r4YUxTHkhbNOO+CnchGzwxh2GMQesOcCasFJCUNsKNWdZLAQyvSbOnXynidWhTN/sN3xN/DiQOXQLU+TYzaYA4lhFwExuhwvFBmfha3OAW2YNNm5yZl51FaWsvHxS6Zl/nx57IH1k5qp7M/ihWPFMYarQKOS+AGGUM/C3N6xxz9ybU/7V7nuw4X0M5yBpQFadJZ8o/33iB6HqvpsceHDxiSUrknIocrY7MpLB8BFEtRXw0VvfueFvW6EsLR176F8NA475CfI7gfvXQ+PBRH+84s21bcjLn5KJnBQ7FYodnYAVydrVRqzYcJAYjtowXK2//laqs9yeOjwDdYpKHFKlD7SEjBM+pesK/G+pvgenizlp5RTUcKPGaTyKTfZdS/VuyEleExeh/gXJPCPXGb71zpigur62Jop+ZQSXXojHXkDWfN1S8cBNBMsKhavtcaeGiF7aGjjLQVy6adqxDxAVQtnKcbxGMkseaqUBPzKxfus4OU0gL+SDOG0FdKiuny295F/rQupwUz9i90hNDqw9aY09uZAVTLqtgMhhdyxrVTy5DlSJ16AG9tqD0/khAH5gjQPp3nka8QVbAZEyEq7igauWR6b7H34ES45C9+9mRZTEIPzvK6j1qnJA6Y46S17ij1HbAZF8a/5M75doEOoba0LVFz129wulJ3IGjUFw+144Vg5wg6jV38NXR5/EGKfLS8cfQCNJOkbTkK2VxAytvBKpujfPZeVo3ZK6oLajhF3PSrFJXhcmdIeaRL5sQ0C9g2M9u/3mzoXhabHsJbnzT4jSlFJHnDv8ePQGrwkSOpRL1mTVs3kal9O73dS18OofweThX6D+BiE+WG5WN0PeOtu5OHzNm5XiSnj+k2JgdWS3xZ5sR6pz8cS0q+gnVvuVlsT1pnUzVhokCRrt1aQ7G4qobcW3ATkGOY4upkOouIu+DTnu3ZCi0BPwPVJxpmmDsLbfxvV5O2oCqaC7KSKyo5DbB+MDXZiTaRIu0lSSgiRpY1Daj+X+c8tPH1aiEZmiFiLlS6Tlr0B9TX0eMDsAt4OqVHJ2/6pjW/8PtgBbgC3AlxzwHwEGAMnet2y/NB7GAAAAAElFTkSuQmCC",
				redDot = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAQ9SURBVHja7FhdTFNnGO7pzyktLbRMWgopAWRVy9CCbCMoXhlnFOO2ZFtidrNrk92YeLEsuxhXuuzGxERiXHblxZbNLSPLXMhiQCZDxdbNUpCfrl3/oCL0l/b09Oz5uu+YXoAUPV1M7EmenO/7znfOec7787xvywiCIHuRD7nsBT8qBCsEKwQrBF92gspSN355/vyG66eufqrKKVWdMhlzRGCYjpyS9SWrjaPzO/ffBtawhX/ac8+cPSsNwY2I8QplX16uGFTmuH5xXcVlZJp0/JPataVZq999btb25s/BRlsUl3L/m4vf/+Zzk8DIf1DwuRvyPN+/0R4Vt25rDM5c6Z34fmTXzK0+LOkApmwuLiJnVvDcOCMIO8U1kBUCTbZgWlOT0KZirCU01yzP5xTkWtV6omPv/ZEfM2rNR94Wxw0sEbcLZSEIt7IgM1xMzm0/ND3X3uNJaWv+FhhFgBH4uD6+YmpbmDqwZ/rmW9Tthu6pX4aiO5pPJXR1k1hKlEpyWwR5heoErNcjzm8e/GDSb33tNpJjClMPEBEYZWat1sTe6zr6a7La8EfPneHPqCVNdvfo6ck33l7CdAbIShqD71w7p0W8PUll177Df/maOwm53zAdAe4CC0AAWAScs7bey8jkL8R7Wryu47rECvlAQ6nxWDJBNrveyQj5NjJer9Kl59pff4DhJAUhlaFuE0HmQb/Vfimj1noL7spxLCGJYVOp3iuZICx1WBxDNkJZVkOs5QaWnqJ1+WDjLn9ao78mLpgjiw6cmoFqiWVG6BJHeGEMyfIPJcdtcWMOoeEVJ5p0rA6nRio70hFEhYgWiTEDd8eJt0vIRgH7n7iTU1WRD9IDakkJQuPGxHH9steCl2ppHDFbSJMSew+I84i5NUIzmJeUYHSHdRxcCtYyPo7UNwU8+2g2yrewfAeS46Q4X2ztmiM8qRZKRxCSEVw1mIfElIHwfmha8nZjUruZFd/7drAO5fAr7C9UFb+1wxerqSfx6JOcIMSXW2x1XESDUHiwOpPU949dvWB3j52oiS3XFT8LbpWDnA2Wu45Y7S6ks1zBOx1H7kMNiEj7qQxJWkmE6T0HH6JLOYMyNvQfyZTR4bz+dYvXOYzg/4nNpkNoEjScSn0IcXe6+Oa7+4+74vpXiHb+SSKmLKWOBPdE77vfgYAJHcqguGhYjQzgNLDZTXd6BpwQ9t8xnABIDKbL1c2Qr16FNa6ELK8GdnvGP24Izzs22xwxt4Wnuo+5HhsbiNVuEa7AStm6GbFnIAKNajIMyXiojz/qbQgv9Jkj83Z0MfUJnTGJa4GQpZ101kHEHqk4LtogPNpu4/qsHTUhGUV3k1w1NPiAUc/uPgupZFSEk1RKwkAIWAZS27Hcc7f89GUpmpFhaiFSvlha/hI01rLPQkwKgsVEsxRrUv+qYyr/D1YIVghWCL7kBP8VYADwJLhW1KDHiwAAAABJRU5ErkJggg==";
			
			function Unit(img) {
				this.img = img;
				this.id = img.getAttribute("src").match(idRg)[1];
			}
			Unit.prototype.isWaterborne = function() {
				if (this.id == 9252 || this.id == 9032 || this.id == 9262 || this.id == 9042 || this.id == 9242 ||
					this.id == 9232 || this.id == 9052)
					return true;
				return false;
			};
			Unit.prototype.isDropship = function() {
				if (this.id == 9242)
					return true;
				return false;
			};
			Unit.prototype.isAirborne = function() {
				if (this.id == 9122)
					return true;
				return false;
			};
			Unit.prototype.isVehicle = function() {
				if (this.id == 9152 || this.id == 9102 || this.id == 9062 || this.id == 9092 || this.id == 142 || this.id == 9172 || this.id == 9212)
					return true;
				return false;
			};
			Unit.prototype.isHero = function() {
				if (this.id == 9000)
					return true;
				return false;
			};
			Unit.prototype.isInfranty = function() {
				if (parseInt(this.id / 1000, 10) == 9 && this.id % 10 === 0)
					return true;
				return false;
			};
			Unit.prototype.isSurfaceborne = function() {
				if (this.isVehicle() || this.isInfranty())
					return true;
				return false;
			};
			Unit.prototype.isTown = function() {
				if (this.id == 23 || this.id == 13 || this.id == 3)
					return true;
				return false;
			};
			Unit.prototype.isMarker = function() {
				if (this.id == 206 || this.id == 56 || this.id == 76)
					return true;
				return false;
			};
			Unit.prototype.isKraken = function() {
				if (this.id == 9182)
					return true;
				else if (this.isMarker()) {
					var m = this.img.getAttribute("tooltip").match(/<i>(.*)<\/i>/);
					if (m && m[1].search(/кря|крак/) != -1)
						return true;
				}
				return false;
			};
			Unit.prototype.isMine = function() {
				if (this.img.parentNode.childNodes.length == 3 && this.img.parentNode.childNodes[2].hasAttribute("class") &&
					this.img.parentNode.childNodes[2].getAttribute("class") == "ind0")
					return true;
				return false;
			};
			Unit.prototype.isClan = function() {
				if (this.img.parentNode.childNodes.length == 3 && this.img.parentNode.childNodes[2].hasAttribute("class") &&
					this.img.parentNode.childNodes[2].getAttribute("class") == "ind1")
					return true;
				return false;
			};
			Unit.prototype.isAlly = function() {
				if (this.img.parentNode.childNodes.length == 3 && this.img.parentNode.childNodes[2].hasAttribute("class") &&
					this.img.parentNode.childNodes[2].getAttribute("class") == "ind3")
					return true;
				return false;
			};
			Unit.prototype.isHostile = function() {
				if (!this.isHero() && !this.isDropship() && !this.isAirborne() && this.img.parentNode.childNodes.length == 3 && this.img.parentNode.childNodes[2].hasAttribute("class") &&
					this.img.parentNode.childNodes[2].getAttribute("class") == "ind4")
					return true;
				return false;
			};

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
				this.terrainType = 0; // 0 - undefined, 1 - ground, 2 - road, 3 - forest, 4 - mountain, 5 - swamp, 6 - water
				this.obj = null;
				this.bg = null;
				this.cult = sessionStorage.getItem("cult") === null ? "" : sessionStorage.getItem("cult");
				if (this.cell.hasAttribute("background")) {
					this.bg = this.cell.getAttribute("background").match(idRg)[1];
					this.obj = new Unit(this.cell.childNodes[0]);
				} else {
					this.bg = this.cell.childNodes[0].getAttribute("src").match(idRg)[1];
				}
				if (this.bg >= 48 && this.bg <=58)
					this.terrainType = 1;
				else if (this.bg >= 96 && this.bg <= 110)
					this.terrainType = 2;
				else if (this.bg >=64 && this.bg <= 78)
					this.terrainType = 3;
				else if (this.bg >= 80 && this.bg <= 84)
					this.terrainType = 4;
				else if (this.bg >= 112 && this.bg <= 119)
					this.terrainType = 5;
				else if (this.bg >= 32 && this.bg <= 47)
					this.terrainType = 6;
			}
			Node.prototype.activeUnit = null;		// will be calculated in astar function
			Node.prototype.nodes = null;			// all nodes
			Node.prototype.isGround = function() {
				if (this.terrainType ==  1)
					return true;
			};
			Node.prototype.isRoad = function() {
				if (this.terrainType ==  2)
					return true;
			};
			Node.prototype.isForest = function() {
				if (this.terrainType ==  3)
					return true;
			};
			Node.prototype.isMountain = function() {
				if (this.terrainType ==  4)
					return true;
			};
			Node.prototype.isSwamp = function() {
				if (this.terrainType ==  5)
					return true;
			};
			Node.prototype.isWater = function() {
				if (this.terrainType ==  6)
					return true;
			};
			Node.prototype.initCost = function() {
				if (this.activeUnit.isSurfaceborne()) {
					if (this.isGround())
						this.cost = 1;
					else if (this.isMountain())
						this.cost = 3;
					else if (this.isForest())
						this.cost = this.cult == "лесов" &&
						!(this.activeUnit.isVehicle()) ? 1 : 2;
					else if (this.isSwamp())
						this.cost = 2;
					else if (this.isRoad())
						this.cost = this.cult == "лесов" &&
						!(this.activeUnit.isVehicle()) ? 1 : 0.5;
					if (this.obj !== null && this.obj.isTown())
						this.cost = 0.5;
				} else if (this.activeUnit.isWaterborne()) {
					this.cost = 0.25;
				} else if (this.activeUnit.isAirborne()) {
					this.cost = 1;
				}
			};

			Node.prototype.initAccessible = function() {
				if (this.activeUnit.isSurfaceborne()) {
					if (this.isWater()) {
						this.accessible = 0;
					} else if (this.obj !== null) {
						if (this.obj.isTown() && (this.obj.isMine() || this.activeUnit.isHero())) {
							this.accessible = 1;
						} else if (this.obj.isMarker())
							this.accessible = 1;
						else
							this.accessible = 0;
					} else {
						this.accessible = 1;
					}
				} else if (this.activeUnit.isWaterborne()) {
					if (this.isWater()) {
						if (this.obj === null) {
							this.accessible = 1;
						} else {
							if (this.obj.isMarker())
								this.accessible = 1;
							else
								this.accessible = 0;
						}
					} else
						this.accessible = 0;
				} else if (this.activeUnit.isAirborne()) {
					if (this.obj === null || this.obj.isMarker()) {
						this.accessible = 1;
					} else {
						this.accessible = 0;
					}
				}
			};
			Node.prototype.getAdjCell = function(dx, dy) {
				if ((this.i + dy >= 0) && (this.i + dy < this.nodes.length) && 
					(this.j + dx >= 0) && (this.j + dx < this.nodes[0].length)) {
					return this.nodes[this.i+dy][this.j+dx];
				}
				return null;
			};
			Node.prototype.getAdjCells = function() {
				var adjCells = [];
				var adjCell = this.getAdjCell(0, 1);
				if (adjCell !== null) adjCells.push(adjCell);
				adjCell = this.getAdjCell(0, -1);
				if (adjCell !== null) adjCells.push(adjCell);
				adjCell = this.getAdjCell(1, 0);
				if (adjCell !== null) adjCells.push(adjCell);
				adjCell = this.getAdjCell(-1, 0);
				if (adjCell !== null) adjCells.push(adjCell);
				adjCell = this.getAdjCell(-1, -1);
				if (adjCell !== null) adjCells.push(adjCell);
				adjCell = this.getAdjCell(-1, 1);
				if (adjCell !== null) adjCells.push(adjCell);
				adjCell = this.getAdjCell(1, -1);
				if (adjCell !== null) adjCells.push(adjCell);
				adjCell = this.getAdjCell(1, 1);
				if (adjCell !== null) adjCells.push(adjCell);
				return adjCells;
			};
			Node.prototype.checkForEnemyOnAdjCell = function() {
				var adjCells = this.getAdjCells();
				if (this.enemyOnAdjCell === null) {
					for (var i = 0; i < adjCells.length; i++) {
						if (adjCells[i].obj !== null && adjCells[i].obj.isHostile()) {
							this.enemyOnAdjCell = true;
							break;
						}
					}
				}
				return this.enemyOnAdjCell;
			};
			Node.prototype.addAdjCellsToOpenList = function(openList) {
				var adjCells = this.getAdjCells();
				for (var i = 0; i < adjCells.length; i++) {
					var el = adjCells[i];
					if (this.checkForEnemyOnAdjCell() && el.checkForEnemyOnAdjCell())
						return;
					// check in openList for present in there
					if (el !== null && el.accessible) {
						if (el.state == 1) {
							if (el.g > el.parent.g + el.cost) {
								el.parent = this;
							}
						}
						if (el.state === 0 && openList.indexOf(el) == -1) {
							el.state = 1;
							el.parent = this;
							el.cell.setAttribute("class", "open");
							//el.h = Math.max(Math.abs(finish.x - el.x), Math.abs(finish.y - el.y)) - 2;
							el.h = 0;
							if (el.parent !== null) {
								el.g = el.parent.g + el.cost;
							}
							el.f = el.h + el.g;
							openList.push(el);
						}
					}
				}
			};


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
			function astar(destX, destY) {
				if (typeof destX === "undefined" || typeof destY === "undefined") {
					destX = 0;
					destY = 0;
				}
				var map = window.top.document.getElementById("dmap").getElementsByTagName("table")[1];
				$("img[src='" + arrows + "']").remove();
				$("img[src='" + redDot + "']").remove();
				$("img[src='" + greenDot + "']").remove();
				$("img[src='" + brownDot + "']").remove();
				var nodes = [];
				Node.prototype.nodes = nodes;
				var activeUnit = new Unit($("button[class='but40'][onclick='cm6();'] img").get(0));
				Node.prototype.activeUnit = activeUnit;
				var i, j;
				for (i = 0; i < map.rows.length; i++) {
					nodes.push([]);
					for (j = 0; j < map.rows[i].cells.length; j++) {
						var cell = map.rows[i].cells[j];
						var match = cell.childNodes[0].getAttribute("tooltip").match(/(\d+) y:(\d+)/);
						var node = new Node(parseInt(match[1], 10), parseInt(match[2], 10), cell, i, j, map);
						node.initCost();
						node.initAccessible();
						match = parseInt(cell.childNodes[0].getAttribute("src").match(idRg)[1], 10);
						//if (activeUnit == 9000 || activeUnit == 9180 || activeUnit == 9122)
						//	node.enemyOnAjdCell = false;
						nodes[nodes.length-1].push(node);
					} // for cells
				} // for rows
				// search for krakens
				if (activeUnit.isWaterborne()) {
					for (i = 0; i < nodes.length; i++)
						for (j = 0; j < nodes[i].length; j++)
							if (nodes[i][j].obj !== null) {
								if (nodes[i][j].obj.isKraken()) {
									nodes[i][j].accessible = 0;
									var adjCells = nodes[i][j].getAdjCells();
									for (var k = 0; k < adjCells.length; k++) {
										adjCells[k].accessible = 0;
									}
								}
							}
				}
				var curI = parseInt(nodes.length/2, 10), curJ = parseInt(nodes[parseInt(nodes.length/2, 10)].length/2, 10);
				var start = nodes[curI][curJ];
				var finish = null;
				for (i = 0; i < nodes.length; i++) {
					for (j = 0; j < nodes[i].length; j++) {
						if (nodes[i][j] !== null && nodes[i][j].accessible && nodes[i][j].x == destX && nodes[i][j].y == destY) {
							finish = nodes[i][j];
						}
					}
				}
				if (finish === null)
					return;
				finish.accessible = 1;
				var openList = [];
				var closeList = [];
				start.state = 1;
				start.accessible = 1;
				openList.push(start);
				var curNode = null;
				for (var loops = 0; loops < 4000; loops++) {
					curNode = findMinNode(openList);
					if (curNode !== null) {
						openList.splice(openList.indexOf(curNode), 1);
						curNode.state = 2;
						closeList.push(curNode);
						if (curNode === finish)
							break;
						curNode.addAdjCellsToOpenList(openList);
					} else {
						break; // you can`t access that node
					}
				}
				var sum = 0;
				curNode = finish;
				var moves = findMoves();
				while (curNode !== start && curNode !== null && finish.parent !== null) {
					sum += curNode.g;
					var img = document.createElement("img");
					if (curNode.g <= moves) {
						if (curNode.checkForEnemyOnAdjCell() === true) {
							img.setAttribute("src", redDot);
							//img.setAttribute("style", "display:block;position:relative;top:-20px;margin:-20px;");
						} else {
							img.setAttribute("src", greenDot);
							//img.setAttribute("src", arrows);
							//img.setAttribute("width", "80px");
							//img.setAttribute("height", "80px");
							//img.setAttribute("style", "margin:-40px -40px -40px 0px");
						}
					} else {
						img.setAttribute("src", brownDot);
						//img.setAttribute("style", "display:block;position:relative;top:-20px;margin:-20px;");
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
			
			
			$("td").click(function(e) {
				var m;
				if (e.altKey || e.shiftKey || e.ctrlKey || e.target.hasAttribute("background") || e.target.parentNode.hasAttribute("background")) {
					prevDestX = 0;
					prevDestY = 0;
				} else if (e.target.getAttribute("src") == redDot || e.target.getAttribute("src") == greenDot || e.target.getAttribute("src") == brownDot || e.target.getAttribute("src") == arrows) {
					m = e.target.parentNode.childNodes[0].getAttribute("tooltip").match(/(\d+) ..(\d+)/);
					if (prevDestX == parseInt(m[1], 10) && prevDestY == parseInt(m[2], 10)) {
						move();
					} else {
						astar(parseInt(m[1], 10), parseInt(m[2], 10));
					}
					prevDestX = parseInt(m[1], 10);
					prevDestY = parseInt(m[2], 10);
				} else if (e.target.hasAttribute("tooltip") && !e.target.parentNode.hasAttribute("background")) { // only empty cells
					m = e.target.getAttribute("tooltip").match(/(\d+) ..(\d+)/);
					prevDestX = parseInt(m[1], 10);
					prevDestY = parseInt(m[2], 10);
					astar(parseInt(m[1], 10), parseInt(m[2], 10));
				}
			});
			function allowMovement() {
				if (window.h1win)
					return false;
				if ($("font[color='black']").length !== 0) {
					if ($("font[color='black']").html().search(/ставк|ресурсы|предметы|артефакт/) != -1) {
						return true;
					}
					return false;
				}
				return true;
			}
			function move() {
				if (prevDestX !== 0 && prevDestY !== 0 && allowMovement()) {
					var nodeToMove = astar(prevDestX, prevDestY);
					if (nodeToMove && nodeToMove.g <= findMoves()) {
						window.cmIComm(2, nodeToMove.x, nodeToMove.y, '');
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
						setTimeout(f, 100);
					}, false);
				}
			})(move);
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
		})(); // astar_module
		
	}
	
	//addEventListener("load", astar_module, false);
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
})();
