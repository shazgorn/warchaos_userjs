// ==UserScript==
// @name           Warchaos AP Calc
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Calculates action point regeneration rate
// @match          http://warchaos.ru/f/a
// @version        1.0
// @downloadURL    https://raw.githubusercontent.com/shazgorn/warchaos_userjs/master/standalone_scripts/wc_ap_calc.user.js
// ==/UserScript==


/**
 * Script adds table showing time of AP regeneration,
 * time when each AP will be restored
 */

(function() {
	/**
	 * Description: convert minutes to hh:mm format
	 * Return: string representing time in "hh:mm" format
	 */
	function convertMinutesToHM(timeInMinutes) {
		if (timeInMinutes == 1440)
			return "24:00";
		else
			timeInMinutes %= 1440;
		var h = Math.floor(timeInMinutes/60);
		if (h < 10)
			h = "0" + h;
		var m = Math.floor(timeInMinutes%60);
		if (m < 10)
			m = "0" + m;
		return h + ":" + m;
	}
	function htmlTd(html) {
		return '<td>' + html + '</td>';
	}
	function incrMilestone(i, cur, ceil, max, mileStoneTime, timeToRegenOnePoint) {
		if (i === 0 && cur < ceil && ceil <= max) {
			//when part of ap will be regenerated
			mileStoneTime += Math.floor((ceil-cur) * timeToRegenOnePoint);
		} else if (ceil > max) {
			mileStoneTime += Math.floor((max - parseInt(max, 10)) * timeToRegenOnePoint);
		} else {
			mileStoneTime += timeToRegenOnePoint;
		}
		return mileStoneTime;
	}
	/**
	 * Description: create table containing AP regeneration time
	 * Return: raw table
	 */
	function createTable(cur, max) {
		var t = "";
		var timeToRegenOnePoint = Math.floor(1440 / max);
		t += "Время восст. 1 ед.: " + convertMinutesToHM(timeToRegenOnePoint) + ' (' + parseInt(cur / max * 100) + '%)';
		if (cur == max)
			return t;
		t += "<table><tr><td>Ходы</td><td>Время</td><td>Через</td><td>%</td></tr>";
		var d = new Date(),
			minutesSinceMidnight = d.getMinutes() + d.getHours() * 60,
			ceil = Math.ceil(cur);
		if (cur == ceil) {
			ceil++; cur++;
		}
		var mileStoneTime = minutesSinceMidnight;
		for (var i = 0; ceil < max + 1; i++) {
			t += "<tr>";
			if (ceil > max) {
				t += htmlTd(max);
			} else {
				t += htmlTd(ceil);
			}
			mileStoneTime = incrMilestone(i, cur, ceil, max, mileStoneTime, timeToRegenOnePoint);
			t += htmlTd(convertMinutesToHM(mileStoneTime));
			t += htmlTd(convertMinutesToHM(mileStoneTime - minutesSinceMidnight));
			t += htmlTd(parseInt(((ceil > max ? max : ceil) / max) * 100));
			t += "</tr>";
			ceil++;
		}
		t += "</table>";
		return t;
	}
	function calculateAP() {
		var fonts = document.getElementsByTagName("font");
		if (fonts) {
			for (var i = 0; i < fonts.length; i++) {
				if (fonts[i].innerHTML.search("Ходы") != -1) {
					if (!fonts[i].parentNode.nextSibling.hasAttribute("tooltip")) {
						var m = fonts[i].parentNode.nextSibling.innerHTML.match(/(.+) \/ (.+)/);
						if (m) {
							var t = createTable(parseFloat(m[1]), parseFloat(m[2]));
							fonts[i].parentNode.nextSibling.setAttribute("tooltip", t);
						}
					}
				} //if
			} //for
		} //if
	}
	(function(f) {
		var wc_ifr = document.getElementById("ifr");
		if (wc_ifr) 
			wc_ifr.addEventListener("load", function() {
				setTimeout(f, 0);
			}, false);
		f();
	})(calculateAP);	
})();