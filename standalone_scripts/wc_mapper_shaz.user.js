// ==UserScript==
// @name           Warchaos Mapper for Mortal
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Mapper use iframe and window.postMessage
// @include        http://dragonmap.ru/thispageshouldneverexist
// @include        http://warchaos.ru/*
// @include        http://warchaos.ru/f/a
// @include        http://warchaos.ru/snapshot/*
// @include        http://warchaos.ru/~snapshot/*
// @match          http://dragonmap.ru/thispageshouldneverexist
// @match          http://warchaos.ru/*
// @match          http://warchaos.ru/f/a
// @match          http://warchaos.ru/snapshot/*
// @match          http://warchaos.ru/~snapshot/*
// @version        1.1
// @downloadURL    https://raw.githubusercontent.com/shazgorn/warchaos_userjs/master/separate_scripts/wc_mapper_shaz.user.js
// ==/UserScript==


(function () {
    // return;

    function source() {
        function insertAfter(el1, el2) {
            if (!el2.parentNode) return;
            if (el2.nextSibling)
                el2.parentNode.insertBefore(el1, el2.nextSibling);
            else
                el2.parentNode.appendChild(el1);
        }

        function ajaxRequest(url, method, param, onSuccess, onFailure, args) {
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open(method, url, true);
            xmlHttpRequest.setRequestHeader('Content-Type', 'text/plain');
            xmlHttpRequest.onreadystatechange = function (e) {
                if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                    onSuccess(xmlHttpRequest, args);
                }
                else if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200)
                    onFailure(xmlHttpRequest);
            };
            xmlHttpRequest.send(param);
        }

        /**
         * parse table with map, return string for server
         */
        function parseMap(tbl) {
            if (typeof tbl == 'undefined') {
                return;
            }
            var m = '';
            var bgReg = /land\d\/(\d+)\.gif/; //landscape
            var xyReg = /x:(\d+) y:(\d+)/; //cell coords example: x:424 y:270
            var delReg = /<(?:\w+|\s|=|\/|#|:|\.)+>/gi; //delete tags
            for (var i = 0; i < tbl.rows.length; i++) {
                for (var j = 0; j < tbl.rows[i].cells.length; j++) {
                    var c = tbl.rows[i].cells[j];
                    if (c.hasAttribute('background')) {
                        //unit on the ground
                        var res = bgReg.exec(c.getAttribute('background'));
                        if (res != null) {
                            var img = c.getElementsByTagName('img')[0];
                            var xy = xyReg.exec(img.getAttribute('tooltip'));
                            if (xy && (img.getAttribute('tooltip').search("Темнота") == -1)) {
                                m += (xy[1] * 10000 + xy[2] * 1) + '$';
                                m += res[1];
                                res = img.getAttribute('src').replace('.gif', '');
                                if (res != 19 && res != 29 && res != 39 && res != 49 && res != 59 && res != 69) {  //peon
                                    m += '$' + res;
                                    var d = img.getAttribute('tooltip');
                                    d = d.replace(delReg, '');
                                    d = d.split('$');
                                    for (var n = 0; n < d.length - 1; n++) {
                                        m += '$' + d[n];
                                    }
                                }
                                m += '&';
                            }
                        }
                    } else {
                        //ground
                        var img = c.getElementsByTagName('img')[0];
                        if (img) {
                            var res = bgReg.exec(img.getAttribute('src'));
                            if (res != null) {
                                var xy = xyReg.exec(img.getAttribute('tooltip'));
                                if (xy && (img.getAttribute('tooltip').search("Темнота") == -1)) {  //terra incognita check
                                    m += (xy[1] * 10000 + xy[2] * 1) + '$';
                                    m += res[1] + '&';
                                }
                            }
                        }
                    }
                }
            }
            return m;
        }

        function formRequest(tbl, tblStat) {
            var m = parseMap(tbl);
            if (!(m == null || (m != null && m.length <= 0))) {
                var nickname = localStorage.getItem('nickname');
                while (nickname == null) {
                    nickname = prompt("Введите ваш ник", "nickname");
                    if (nickname != 'nickname' && nickname != 'new-dragon' && nickname != '' && nickname != null) {
                        localStorage.setItem('nickname', nickname);
                        break;
                    }
                }
                // Проверяем силу зрения юнита
                var sight = 0;
                if (tblStat) {
                    for (var i = 0, l = tblStat.rows.length; i < l; i++) {
                        if (tblStat.rows[i].cells[0].textContent == "Видимость:") {
                            var sightRow = tblStat.rows[i];
                            break;
                        }
                    }
                }
                if (sightRow) {
                    var res = /\[([-+]*\d+)]/.exec(sightRow.cells[1].textContent);
                    if (res) {
                        sight = parseInt(res[1]);
                    }
                }
                return nickname + '&&' + m + "&" + sight;
            }
        }

        /**
         * Add update map button on page with snapshot
         */
        function addUpdateMapButton() {
            var b = document.createElement("input");
            b.setAttribute("type", "button");
            b.setAttribute("class", "cmb");
            b.setAttribute("style", "margin-left: 5%;");
            b.value = "Обновить карту";
            document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[0]
                .rows[0].cells[1].appendChild(b);
            b.addEventListener("click", function () {
                this.disabled = true;
                var tbl = document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[
                document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table").length - 2];  //snapshot
                var req = formRequest(tbl);
                document.getElementById('sd_map').contentWindow.postMessage(req, "http://dragonmap.ru/thispageshouldneverexist");
            }, false);
        }

        /**
         * Add link to map on the snapshot page
         */
        function addGoToMapLink() {
            var a = document.createElement("a");
            a.innerHTML = "На карту";
            a.target = "_blank";
            var tbl = document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[
            document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table").length - 2];
            var xyReg = /x:(\d+) y:(\d+)/; //cell coords example: x:424 y:270
            var xy = tbl.rows[tbl.rows.length / 2 - 0.5].cells[tbl.rows[0].cells.length / 2 - 0.5].getElementsByTagName("img")[0].getAttribute("tooltip").match(xyReg);
            a.href = "http://dragonmap.ru/mortal?x=" + xy[1] + "&y=" + xy[2];
            document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[0]
                .rows[0].cells[1].appendChild(document.createTextNode(" / "));
            document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[0]
                .rows[0].cells[1].appendChild(a);
        }

        function addGoToSnapshotLink() {
            var fonts = document.getElementsByTagName("font");
            if (fonts) {
                for (var i = 0; i < fonts.length; i++) {
                    if (fonts[i].innerHTML == "Снэпшот успешно сделан.") {
                        ajaxRequest('http://warchaos.ru/snapshots/0', 'POST', '', function (XHR, font) {
                                font.innerHTML = "";
                                // <a href=http://warchaos.ru/snapshot/2492/166&342096535/33929>Смотреть</a>
                                var link = XHR.responseText.match(/a href\=(http\:\/\/[^>]+)>Смотреть/)[1];
                                var a = document.createElement("a");
                                if (link) {
                                    a.href = link;
                                    a.innerHTML = "Снэпшот успешно сделан.";
                                    font.appendChild(a);
                                }
                            },
                            function () {
                            },
                            fonts[i]
                        );
                    }
                }
            }
        }
        /**
         * Description: find table with map, parse cells coordinates and terrain type, join them into single string, send to server
         * Params:
         *    onButtonPress: true - function was called by onclick event handler. Map will be updated with info from snapshot.
         */
        function parseMapAndDoSomeOtherStaff() {
            if (location.href.search('snapshot') != -1) {
                addGoToMapLink();
                addUpdateMapButton();
            } else if (location.href.search("f/a") != -1 && typeof window.top.players !== "undefined") {
                var tbl;  // table with map
                var dmap = top.document.getElementById('dmap');
                if (dmap) {
                    tbl = dmap.firstChild.rows[1].cells[1].firstChild;   // game map
                } else if (document.getElementsByTagName('button')[0] && document.getElementsByTagName('button')[0].innerHTML == "Вернуться") {
                    tbl = document.getElementsByTagName('button')[0].nextSibling;  // Observatory -> View
                }
                var tblStat = document.querySelector("#drig > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1)")
                var req = formRequest(tbl, tblStat);
                document.getElementById('sd_map').contentWindow.postMessage(req, "http://dragonmap.ru/thispageshouldneverexist");
                addGoToSnapshotLink();
            }
        } // fun

        if (location.href.search(/snapshot|f\/a/) != -1) {
            var sd_map_iframe = document.createElement('iframe');
            sd_map_iframe.setAttribute('src', 'http://dragonmap.ru/thispageshouldneverexist');
            sd_map_iframe.setAttribute('id', 'sd_map');
            sd_map_iframe.setAttribute('style', 'display: none;'); //display: none;
            document.body.appendChild(sd_map_iframe);
            (function (f) {
                var wc_ifr = document.getElementById("ifr");
                if (wc_ifr)
                    wc_ifr.addEventListener("load", function () {
                        setTimeout(f, 0);
                    }, false);
                f();
            })(parseMapAndDoSomeOtherStaff);
        } else if (location.href == "http://dragonmap.ru/thispageshouldneverexist") {
            addEventListener('message', function (e) {
                if (e.origin = 'http://warchaos.ru') {
                    // l('incoming ' + ' from ' + e.origin + ' ' + e.data );
                    var mapperURL = "http://dragonmap.ru/cgi-bin/mapper_mortal";
                    ajaxRequest(mapperURL, 'POST', e.data, function (XHR) { /* l(XHR.responseText); */
                    }, function () {
                    });
                }
            }, false);
        }
    }

    var script = document.createElement('script');
    script.textContent = '(' + source + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})();
