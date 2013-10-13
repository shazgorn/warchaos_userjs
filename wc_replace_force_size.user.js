// ==UserScript==
// @name           Warchaos Replace Army Size
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Replace symbolic represenation with numeric
// @match          http://warchaos.ru/f/a
// @match          http://warchaos.ru/snapshot/*
// @match          http://warchaos.ru/~snapshot/*
// @version        1.0
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_replace_force_size.user.js
// ==/UserScript==

(function() {
	// return;
	function replace() {
		var tbl = [
			"Несколько", "1-4",
			"Немного", "5-8",
			"Группа","9-14",
			"Отряд", "15-25",
			"Легион", "26-45",
			"Рать", ">45"
		];
		var imgs = document.getElementsByTagName("IMG");
		var reg = /\(([А-Яа-я]+)\)/;	//extracts
		for (var i = 0; i < imgs.length; i++) {
			if (imgs[i].hasAttribute("tooltip")) {
				var t = imgs[i].getAttribute("tooltip");
				var m = t.match(reg);
				if (m) {
					for (var j = 0; j < tbl.length; j += 2) {
						if (m[1] == tbl[j]) {
							t = t.replace(m[1], tbl[j+1]);
							imgs[i].setAttribute("tooltip",t);
						}
					}
				}
			}
		}
	}
	(function(f) {
		addEventListener('click', function () {
			setTimeout(f, 0);
		}, false);
		var wc_ifr = document.getElementById("ifr");
		if (wc_ifr)
			wc_ifr.addEventListener("load", function () {
				setTimeout(f, 0);
			}, false);
		f();
	})(replace);
})();

