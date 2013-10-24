// ==UserScript==
// @name           Warchaos Loot Button
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Add loot button
// @match          http://warchaos.ru/f/a
// @version        1.22
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_loot_button.user.js
// ==/UserScript==


(function() {
	// return;
	var pro = false;
	
	var srcRg = /(\d+).gif/,
		style = "width: 60px; margin: 2px 4px 2px;";
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
			
	function getActiveUnitType() {
		return parseInt($("button[class='but40'][onclick='cm6();'] img").attr("src").match(srcRg)[1]);
	}
	
	/**
	 * this listener will listen for click on button on the take tab
	 * if it`s hero set takeFromHero flag
	 */
	var takeFromHero = false;
	addEventListener('click', function(e) {
		if (e.target.hasAttribute("tooltip") && e.target.getAttribute("tooltip").search("Герой") != -1) {
			takeFromHero = true;
		}
	}, false);
	/**
	 * goods intervals
	*/
	var artefacts = {name: "Арты", interval: [504, 1764], count: "all"},
		all = {name: "Всё", interval: [0, 10000], count: "all"},
		force = {name: "Войска", interval: [2254, 2474], count: "all"},
		potions = {name: "Зелья", interval: [24, 114], count: "all"},
		potions1 = {name: "Зелья +1", interval: [24, 114], count: 1},
		resources = {name: "Ресы", interval: [204, 474], count: "all"},
		scrolls = {name: "Свитки", interval: [1934, 2134], count: "all"};
	/**
	 * createButton
	 * this fun will create button with appropriate listener and goods intervals, add it to the place
	 */
	function createButton(good) {
		//<input type="submit" class="cmb" value="Взять"
		//<input type="submit" class="cmb" value="Ok"
		var actionButtons = $("input[type='submit'][class='cmb'][value='Взять'], input[type='submit'][class='cmb'][value='Ok']");
		actionButtons.each(function(i, actionButton) {
			if ($(actionButton).nextAll("input[value='" + good.name + "']").length == 0) {
				var button = document.createElement("input");
				button.setAttribute("type", "button");
				button.setAttribute("class", "cmb");
				button.setAttribute("style", style);
				button.setAttribute("value", good.name);
				$(actionButton).parent().append(button);
				$(button).click(function(e) {
					var lootTable,
						get = $(e.target).prevAll("input[value='Взять']").length !== 0 ? true : false;
					if (get)
						lootTable = $(e.target).prevAll("table").get(0);
					else
						lootTable = $(e.target).parent().parent().parent().parent().parent().prev().get(0);
					$(lootTable).find("td[background='ctrl/slot1.gif']").each(function(i, el){
						var res = srcRg.test($(el).find("img").attr("src")) ? $(el).find("img").attr("src").match(srcRg)[1] : 0;
						if (((get && !(i === 0 && takeFromHero && res > force.interval[0] && res < force.interval[1])) || 
								(!get && !(i === 0 && getActiveUnitType() > 9000 && getActiveUnitType() % 10 === 0))) && 
								res >= good.interval[0] && res <= good.interval[1]) {
							if ($(el).find("*").last().attr("type") == "checkbox") {
								$(el).find("*").last().prop("checked", true);
							} else {
								if (good.count === "all")
									$(el).find("*").last().click();
								else
									$(el).find("input[type='text']").val(parseInt($(el).find("input[type='text']").val()) + 
										good.count);
							}
						}
					});
					if (pro) {
						setTimeout(function() {actionButton.click();}, 100);
					}
				});
			}
		});

	}
	function addLootButtons() {
		if (typeof $ === "undefined") {
			addScript("http://code.jquery.com/jquery-1.9.1.js");
		}
		if (typeof $ === "undefined") {
			setTimeout(addLootButtons, 1000);
			return;
		}
		$("input[type='submit'][class='cmb'][value='Взять'], input[type='submit'][class='cmb'][value='Ok']").attr("style", style);
		createButton(all);
		createButton(artefacts);
		createButton(force);
		createButton(potions);
		createButton(potions1);
		createButton(resources);
		createButton(scrolls);
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
	})(addLootButtons);
})();