// ==UserScript==
// @name           Alt Click
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Opera fix alt + click works as shift + click
// @include        http://warchaos.ru/f/a
// ==/UserScript==

addEventListener("click", function(e) {
	if (e.altKey && e.target == "[object HTMLImageElement]" && e.target.hasAttribute("sck"))
			eval(e.target.getAttribute("sck"));
}, false);