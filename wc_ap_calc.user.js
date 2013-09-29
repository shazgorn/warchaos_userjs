// ==UserScript==
// @name           Warchaos AP Calc
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Calculates action point regeneration rate
// @include        http://warchaos.ru/f/a
// @match          http://warchaos.ru/f/a
// ==/UserScript==


/**
 * Script adds table showing time of AP regeneration,
 * time when each AP will be restored
 */

(function () {
	/**
	 * Description: convert minutes to hh:mm format
	 * Return: string representing time in "hh:mm" format
	 */
	'use strict';
	function convertMinutesToHM(timeInMinutes) {
		var res, h = Math.floor(timeInMinutes / 60), m = Math.floor(timeInMinutes % 60);
		if (timeInMinutes === 1440) {
			res = "24:00";
		} else {
			timeInMinutes %= 1440;
			if (h < 10) {
				h = "0" + h;
			}
			if (m < 10) {
				m = "0" + m;
			}
			res = h + ":" + m;
		}
		return res;
	}
	/**
	 * Description: create table containing AP regeneration time
	 * Return: raw table
	 */
	function createTable(cur, max) {
		var t = "", timeToRegenOnePoint = Math.floor(1440 / max),
			d = new Date(), minutesSinceMidnight = d.getMinutes() + d.getHours() * 60,
			ceil = Math.ceil(cur),
			mileStoneTime = minutesSinceMidnight,
			i;
		t += "Время восст. 1 ед.: " + convertMinutesToHM(timeToRegenOnePoint);
		if (cur === max) {
			return t;
		}
		t += "<table><tr><td>Ходы</td><td>Время</td><td>Через</td></tr>";
		if (cur === ceil) {
			ceil++;
			cur++;
		}
		for (i = 0; ceil < max + 1; i++) {
			t += "<tr>";
			if (ceil > max) {
				t += "<td>" + max + "</td>";
			} else {
				t += "<td>" + ceil + "</td>";
			}
			t += "<td>";
			if (i === 0 && cur < ceil && ceil <= max) {
				//when part of ap will be regenerated
				mileStoneTime += Math.floor((ceil - cur) * timeToRegenOnePoint);
			} else if (ceil > max) {
				mileStoneTime += Math.floor((max - parseInt(max, 10)) * timeToRegenOnePoint);
			} else {
				mileStoneTime += timeToRegenOnePoint;
			}
			t += convertMinutesToHM(mileStoneTime);
			t += "</td>";
			t += "<td>" + convertMinutesToHM(mileStoneTime - minutesSinceMidnight) + "</td>";
			t += "</tr>";
			ceil++;
		}
		t += "</table>";
		return t;
	}
	function calculateAP() {
		var fonts = document.getElementsByTagName("font"), i, m, t;
		if (fonts) {
			for (i = 0; i < fonts.length; i++) {
				if (fonts[i].innerHTML.search("Ходы") !== -1) {
					if (!fonts[i].parentNode.nextSibling.hasAttribute("tooltip")) {
						m = fonts[i].parentNode.nextSibling.innerHTML.match(/([\d+\.]+) \/ ([\d+\.]+)/);
						if (m) {
							t = createTable(parseFloat(m[1]), parseFloat(m[2]));
							fonts[i].parentNode.nextSibling.setAttribute("tooltip", t);
						}
					}
				} //if
			} //for
		} //if
	}
	(function (f) {
		var wc_ifr = document.getElementById("ifr");
		if (wc_ifr) {
			wc_ifr.addEventListener("load", function () {
				setTimeout(f, 0);
			}, false);
		}
		f();
	}(calculateAP));
}());
