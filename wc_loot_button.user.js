// ==UserScript==
// @name           Warchaos Loot Button
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Add loot button
// @match          http://warchaos.ru/f/a
// @version        1.1
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_loot_button.user.js
// ==/UserScript==


(function() {
	// return;
	function getActiveUnitType() {
		var unitReg = /(\d+).gif/;   //unit type
		var cntr = document.getElementById("cntr");
		return cntr ? unitReg.exec(cntr.getElementsByTagName("IMG")[0].getAttribute("src"))[1] : 0;
	}
	
	/**
	 * contains file name without extension(number only)
	 * of last pressed button.image.src attribute
	 */
	var lastButtonPressedIcon;
	addEventListener('click', function (e) {
			if (e.target.nodeName == "BUTTON") {
				var img = e.target.getElementsByTagName("IMG");
				img = img.length !== 0 ? img[0] : null;
				if (img !== null && img.hasAttribute('src')) {
					var unitReg = /(\d+).gif/;   //unit type
					if (img !== null) {
						imgsrc = img.getAttribute('src');
						if (imgsrc !== null) {
							var unitType = unitReg.exec(imgsrc) ? unitReg.exec(imgsrc)[1] : 0;
							lastButtonPressedIcon = unitType ? unitType : 0;
						}
					}
				}
			}
		}, false
	);
	
	function addLootButton() {
		var inputs = document.getElementsByTagName("INPUT");
		for (var i=0; i < inputs.length; i++) {
			if (inputs[i].hasAttribute("type") && inputs[i].getAttribute("type") == "submit" && inputs[i].hasAttribute("value") && (inputs[i].getAttribute("value") == "Взять" || inputs[i].getAttribute("value") == "Ok") && inputs[i].nextSibling === null) {
				inputs[i].setAttribute("style", "width: 60px; margin-right: 7px;");
				var button = document.createElement("input");
				button.setAttribute("type", "button");
				button.setAttribute("class", "cmb");
				button.setAttribute("style", "width: 60px; margin-right: 7px;");
				button.setAttribute("value", "Лут");
				inputs[i].parentNode.appendChild(button);
				var take = 0;
				if (inputs[i].getAttribute("value") == "Взять")
					take = 1;
				button.addEventListener("click", function () {
					var unitType = getActiveUnitType();
					var lootTable = {};
					if (take)					//take Взять
						lootTable = this.parentNode.getElementsByTagName("table")[0];
					else						//give Передать
						lootTable = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("table")[0];
					var slots = lootTable.getElementsByTagName("td");
					for (var i = 0; i < slots.length; i++) {
						if (slots[i].hasAttribute("background") && slots[i].getAttribute("background") != "ctrl/slot2.gif" && slots[i].childNodes.length > 1) {
							if (take && !(i === 0 && lastButtonPressedIcon > 0 && lastButtonPressedIcon <= 230 && lastButtonPressedIcon%10 === 0)) {
								if ("checked" in slots[i].childNodes[slots[i].childNodes.length-1])
									slots[i].childNodes[slots[i].childNodes.length-1].checked = true;
								else
									slots[i].childNodes[slots[i].childNodes.length-1].click();
							}
							if (!take && !(i === 0 && unitType > 9000 && unitType % 10 === 0)) {
								if ("checked" in slots[i].childNodes[slots[i].childNodes.length-1])
									slots[i].childNodes[slots[i].childNodes.length-1].checked = true;
								else
									slots[i].childNodes[slots[i].childNodes.length-1].click();
							}
						}
					}
				}, false);
				
				button = document.createElement("input");
				button.setAttribute("type", "button");
				button.setAttribute("class", "cmb");
				button.setAttribute("style", "width: 60px; margin-right: 7px;");
				button.setAttribute("value", "Арты");
				inputs[i].parentNode.appendChild(button);
				button.addEventListener("click", function () {
					var lootTable = {};
					if (take)					//take Взять
						lootTable = this.parentNode.getElementsByTagName("table")[0];
					else						//give Передать
						lootTable = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("table")[0];
					var slots = lootTable.getElementsByTagName("td");
					for (var i = 0; i < slots.length; i++) {
						if (slots[i].hasAttribute("background") && slots[i].getAttribute("background") != "ctrl/slot2.gif" && slots[i].childNodes.length > 1 && slots[i].getElementsByTagName("img")[0] !== null && slots[i].getElementsByTagName("img")[0].hasAttribute("src")) {
							var m = slots[i].getElementsByTagName("img")[0].getAttribute("src").match(/(\d+).gif/);
							if (m && m[1] >= 504 && m[1] <= 1764) {
								if ("checked" in slots[i].childNodes[slots[i].childNodes.length-1])
									slots[i].childNodes[slots[i].childNodes.length-1].checked = true;
								else
									slots[i].childNodes[slots[i].childNodes.length-1].click();
							}
						}
					}
				}, false);

				button = document.createElement("input");
				button.setAttribute("type", "button");
				button.setAttribute("class", "cmb");
				button.setAttribute("style", "width: 60px; margin-right: 7px;");
				button.setAttribute("value", "Войска");
				inputs[i].parentNode.appendChild(button);
				button.addEventListener("click", function () {
					var lootTable = {};
					if (take)					//take Взять
						lootTable = this.parentNode.getElementsByTagName("table")[0];
					else						//give Передать
						lootTable = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("table")[0];
					var slots = lootTable.getElementsByTagName("td");
					for (var i = 0; i < slots.length; i++) {
						if (slots[i].hasAttribute("background") && slots[i].getAttribute("background") != "ctrl/slot2.gif" && slots[i].childNodes.length > 1 && slots[i].getElementsByTagName("img")[0] !== null && slots[i].getElementsByTagName("img")[0].hasAttribute("src")) {
							var m = slots[i].getElementsByTagName("img")[0].getAttribute("src").match(/(\d+).gif/);
							if (m && m[1] >= 2254 && m[1] <= 2434) {
								if ("checked" in slots[i].childNodes[slots[i].childNodes.length-1])
									slots[i].childNodes[slots[i].childNodes.length-1].checked = true;
								else
									slots[i].childNodes[slots[i].childNodes.length-1].click();
							}
						}
					}
				}, false);
				
				break;
			} //if
		} //for
	}//func
	
	(function(f) {
		addEventListener('click', function () {
			setTimeout(f, 0);
		}, false);
		var wc_ifr = document.getElementById("ifr");
		if (wc_ifr)
			wc_ifr.addEventListener("load", function () {
				setTimeout(f, 0);
			}, false);
	})(addLootButton);
})();