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
			h = "0"+h;
		var m = Math.floor(timeInMinutes%60);
		if (m < 10)
			m = "0"+m;
		return h+":"+m;
	}
	/**
	 * Description: create table containing AP regeneration time
	 * Return: raw table
	 */
	function createTable(cur, max) {
		var t = "";
		var timeToRegenOnePoint = Math.floor(1440/max);
		t += "Время восст. 1 ед.: " + convertMinutesToHM(timeToRegenOnePoint);
		if (cur == max)
			return t;
		t += "<table><tr><td>Ходы</td><td>Время</td><td>Через</td></tr>";
		var d = new Date();
		var h = d.getHours();
		var minutesSinceMidnight = d.getMinutes();
		minutesSinceMidnight += h * 60;
		var floor = Math.floor(cur);
		var ceil = Math.ceil(cur);
		if (cur == ceil) {
			ceil++; cur++;
		}
		var mileStoneTime = minutesSinceMidnight;
		for (var i = 0; ceil < max + 1; i++) {
			t += "<tr>";
			if (ceil > max) {
				t += "<td>" + max + "</td>";
			} else {
				t += "<td>" + ceil + "</td>";
			}
			t += "<td>";
			if (i==0 && cur < ceil && ceil <= max) {
				//when part of ap will be regenerated
				mileStoneTime += Math.floor((ceil-cur)*timeToRegenOnePoint);
			} else if (ceil > max) {
				mileStoneTime += Math.floor((max - parseInt(max))*timeToRegenOnePoint);
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
