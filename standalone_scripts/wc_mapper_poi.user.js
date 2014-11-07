// ==UserScript==
// @name           Warchaos Mapper POI
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    POI
// @include        http://dragonmap.ru/akrit*
// ==/UserScript==

// el, label, coords
// 1 хранить в отпарсеном виде (проще начальная загрузка), в диалоге они всё равно отпарсены, почти
// 2 хранить в неотпарсеном виде, проще запись, 
(function() {
	function source() {
		function savePOI(label, x, y, classAttr, src) {
			var poiStorage = sessionStorage.getItem("poi");
			if (poiStorage == null || poiStorage == "")
				poiStorage = new Array();
			else
				poiStorage = poiStorage.split(",");
			poiStorage.push(label);
			poiStorage.push(x);
			poiStorage.push(y);
			poiStorage.push(classAttr);
			poiStorage.push(src);
			sessionStorage.setItem("poi", poiStorage.toString());
		}
		function savePOITable() {
			//var poiStorage = new Array();
			sessionStorage.setItem("poi", "");
			var poitable = $("#poitable").get(0);
			for (var i = 0; i < poitable.rows.length - 1; i++) {
				var row = poitable.rows[i];
				var x, y, m = row.cells[1].getElementsByTagName("a")[0].innerHTML.match(/(\d+) (\d+)/);
				x = m[1];
				y = m[2];
				var img = row.cells[0].getElementsByTagName("img")[0];
				savePOI(row.cells[1].childNodes[0].data, x, y,
						img.hasAttribute("class") ? img.getAttribute("class") : "",
						img.hasAttribute("src") ? img.getAttribute("src") : "" );
			}
			
		}
		function addPOIToTable(label, x, y, classAttr, src) {
			var el = document.createElement("img");
			if (classAttr == "") {
				el.setAttribute("src", src);
			} else {
				el.setAttribute("class", classAttr);
			}
			var row = ($("#poitable").get(0)).insertRow(0);
			$(row).dblclick(function(e) {
				$(this).remove();
				savePOITable();
			});
			var cell = row.insertCell(0);
			cell.appendChild(el);
			cell = row.insertCell(1);
			
			cell.appendChild(document.createTextNode(label));
			cell.appendChild(document.createElement("br"));
			var a = document.createElement("a");
			a.href = "http://dragonmap.ru/akrit?x=" + x + "&y=" + y;
			a.innerHTML = x + ' ' + y;
			cell.appendChild(a);
		}
		function loadPOITable() {
			var poiLength = 5;
			var poiStorage = sessionStorage.getItem("poi");
			if (poiStorage == null)
				poiStorage = new Array();
			else
				poiStorage = poiStorage.split(",");
			for (var i = 0; i < poiStorage.length; i += poiLength) {
				addPOIToTable(poiStorage[i], poiStorage[i+1], poiStorage[i+2], poiStorage[i+3], poiStorage[i+4]) 
			}
		}
		// dialog
		var div = document.createElement("div");
		div.setAttribute("id", "addpoi");
		var poiimage = document.createElement("div");
		poiimage.setAttribute("id", "poiimage");
		div.appendChild(poiimage);
		div.appendChild(document.createTextNode("label"));
		var input = document.createElement("input");
		input.setAttribute("id", "poilabel");
		div.appendChild(input);
		div.appendChild(document.createElement("br"));
		div.appendChild(document.createTextNode("coords"));
		input = document.createElement("input");
		input.setAttribute("id", "poicoords");
		div.appendChild(input);
		div.appendChild(document.createElement("br"));
		// add button
		var button = document.createElement("button");
		button.innerHTML = "Add";
		button.addEventListener("click", function(e) {
			var el = $("#poiimage").get(0).childNodes[0];
			var label = $("#poilabel").val(); // will return "" if empty... i think
			var m = $("#poicoords").val().match(/(\d+) (\d+)/);
			var x,y;
			if (m) {
				x = m[1];
				y = m[2];
			} else
				return;
			var src = el.hasAttribute("src") ? el.getAttribute("src") : "";
			var classAttr = el.hasAttribute("class") ? el.getAttribute("class") : "";
			addPOIToTable(label, x, y, classAttr, src);
			savePOI(label, x, y, classAttr, src);
		}, false);
		div.appendChild(button);
		//document.appendChild(div);
		$(div).dialog({autoOpen: false, width: 300, title: "add poi"});
		
		var table = $("a[href='wc_mapper_shaz.user.js']").parent().parent().parent().parent().get(0);
		var row = table.insertRow(table.rows.length);
		var cell = row.insertCell(0);
		table = document.createElement("table");
		cell.appendChild(table);
		table.setAttribute("id", "poitable");
		row = table.insertRow(0);
		cell = row.insertCell(0);
		var button = document.createElement("button");
		button.setAttribute("id", "openAddPOIDialog");
		cell.appendChild(button);
		button.innerHTML = '+';
		button.addEventListener("click", function(e) {
			$(addpoi).dialog("open");
		}, false);
		
		// fill dialog with data from click target
		addEventListener("click", function(e) {
			if ($("#addpoi").dialog("isOpen")) {
				if (e.target.hasAttribute("tt")) {
					var tt = e.target.getAttribute("tt");
					var m = tt.match(/x\:(\d+) y\:(\d+)/);
					$("#poicoords").val(m[1] + ' ' + m[2]);
					m = tt.match(/\$\$\$\$([\wА-Яа-я \.]+)/);
					if (m) {
						$("#poilabel").val(m[1]);
					}
					$("#poiimage").html("");
					$("#poiimage").get(0).appendChild(e.target.cloneNode(true));
				} else if (e.target.parentNode.hasAttribute("tt")) {
					var tt = e.target.parentNode.getAttribute("tt");
					var m = tt.match(/x\:(\d+) y\:(\d+)/);
					$("#poicoords").val(m[1] + ' ' + m[2]);
					m = tt.match(/^([\wА-Яа-я \.\(\)]+)/);
					if (m) {
						$("#poilabel").val(m[1]);
					}
					$("#poiimage").html("");
					$("#poiimage").get(0).appendChild(e.target.cloneNode(true));
				} else {
					return;
				}
			}
		}, false);
		loadPOITable();
	}
	var script = document.createElement('script');
	script.textContent = '('+ source +')();';
	document.body.appendChild(script);
	//document.body.removeChild(script);
})();
