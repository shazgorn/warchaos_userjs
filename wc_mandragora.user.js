// ==UserScript==
// @name           Warchaos Mandragora
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Allow you to collect mandragora just moving to swamp cell
// @include        http://warchaos.ru/f/a
// @match          http://warchaos.ru/f/a
// ==/UserScript==

(function() {
	function source() {
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
		function collectMandragora() {
			if (typeof $ === "undefined") {
				addScript("http://code.jquery.com/jquery-1.9.1.js");
			}
			if (typeof $ === "undefined") {
				setTimeout(collectMandragora, 1000);
				return;
			}
			var center = $("td[background]>img[src^='9']");
			if (center && center.length != 0) {
				//console.log(center);
				var i = window.top.cons.indexOf("Мандрагора");
				if (i != -1 && window.top.cons[i-2] == 52) {
					//console.log(1);
				}
					
			}
		}
		(function(f) {
			var wc_ifr = document.getElementById("ifr");
			if (wc_ifr) {
				wc_ifr.addEventListener("load", function() {
					setTimeout(f, 100);
				}, false);
			}
		})(collectMandragora);

	}
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
})();
