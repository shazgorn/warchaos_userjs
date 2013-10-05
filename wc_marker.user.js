// ==UserScript==
// @name           Warchaos Marker
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    alt + click works as shift + click
// @match          http://warchaos.ru/f/a
// @version        1.0
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_marker.user.js
// ==/UserScript==


addEventListener("click", function(e) {
	if (e.altKey && e.target == "[object HTMLImageElement]" && e.target.hasAttribute("sck"))
		eval(e.target.getAttribute("sck"));
	if (e.altKey || e.shiftKey || e.button == 2) {
		setTimeout(function() {
			var input = document.getElementById("miniinfoy");
			if (input != null) {
				if (input.childNodes[0].getAttribute("value") == 0) {
					input.selectedIndex = 6;
				}
			}
		}, 1000);
	}
}, false);
