// ==UserScript==
// @name           Warchaos Marker
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    alt + click works as shift + click
// @include        http://warchaos.ru/f/a
// @match          http://warchaos.ru/f/a
// ==/UserScript==


addEventListener("click", function(e) {
	if (e.altKey && e.target == "[object HTMLImageElement]" && e.target.hasAttribute("sck"))
		eval(e.target.getAttribute("sck"));
	if (e.altKey || e.shiftKey) {
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
