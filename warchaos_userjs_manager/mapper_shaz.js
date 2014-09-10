parseMapAndDoSomeOtherStaff.WORLD = "Лиаф";

function ajaxRequest(url, method, param, onSuccess, onFailure, args) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(method, url, true);
    xmlHttpRequest.setRequestHeader('Content-Type', 'text/plain');
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
            onSuccess(xmlHttpRequest, args);
        }
        else if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200)
            onFailure(xmlHttpRequest);
    };
    xmlHttpRequest.send(param);
}
/*
 function addOptionsButton() {
 // this button will show map in iframe. uncomment it in parseMapAndDoSomeOtherStaff()
 var cntr = document.getElementById('cntr');
 if (cntr) {
 var tbl = cntr.parentNode.parentNode.parentNode.parentNode;
 var b = document.createElement('button');
 b.setAttribute('class', 'but40');
 var img = document.createElement('img');
 img.setAttribute('src', 'ctrl/map.gif'); //http://warchaos.ru/fp
 b.appendChild(img);
 if (tbl.rows.length == 4) {
 tbl.insertRow(4).insertCell(0).appendChild(b);
 b.addEventListener('click', function() {
 var sd_map_iframe = document.getElementById('sd_map');
 if (sd_map_iframe) {
 if (sd_map_iframe.getAttribute('style').search('display: none') == -1) {
 sd_map_iframe.setAttribute('style', 'width: 1000px; height: 1000px; margin: 30px 50px 30px 50px; display: none;');
 sd_map_iframe.setAttribute('src', 'http://dragonmap.ru/404');
 }
 else {
 sd_map_iframe.setAttribute('style', 'width: 1000px; height: 1000px; margin: 30px 50px 30px 50px; display: inline;');
 sd_map_iframe.setAttribute('src', 'http://dragonmap.ru/akrit/');
 }
 }
 }, false);
 }
 }
 }
 */
/**
 * parse table with map, return string for server
 */
function parseMap(tbl) {
    if (typeof tbl == 'undefined') {
        return;
    }
    var img, res, xy,
            m = '',
            bgReg = /land\d\/(\d+)\.gif/, //landscape
            xyReg = /x\:(\d+) y\:(\d+)/, //cell coords example: x:424 y:270
            delReg = /<(?:\w+|\s|=|\/|#|:|\.)+>/gi, //delete tags
            difY = Math.abs((tbl.rows.length - 1) / 2 - 7),
            difX = Math.abs((tbl.rows[0].cells.length - 1) / 2 - 7);
    for (var i = difY; i < tbl.rows.length - difY; i++) {
        for (var j = difX; j < tbl.rows[i].cells.length - difX; j++) {
            var c = tbl.rows[i].cells[j];
            if (c.hasAttribute('background')) {
                //unit on the ground
                res = bgReg.exec(c.getAttribute('background'));
                if (res !== null) {
                    img = c.getElementsByTagName('img')[0];
                    xy = xyReg.exec(img.getAttribute('tooltip'));
                    if (xy && (img.getAttribute('tooltip').search("Темнота") == -1)) {
                        m += (xy[1] * 1000 + xy[2] * 1) + '$';
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
                img = c.getElementsByTagName('img')[0];
                if (img) {
                    res = bgReg.exec(img.getAttribute('src'));
                    if (res !== null) {
                        xy = xyReg.exec(img.getAttribute('tooltip'));
                        if (xy && (img.getAttribute('tooltip').search("Темнота") == -1)) {  //terra incognita check
                            m += (xy[1] * 1000 + xy[2] * 1) + '$';
                            m += res[1] + '&';
                        }
                    }
                }
            }
        }
    }
    return m;
}

/**
 * Desc: this fun will be called from async XHR. Fun should parse profile page(XHR.responseText), get nickname and world.
 */
function addToAccounts(XHR) {
    // >Мир:</td><td>Лиаф</td>
    var nickname = XHR.responseText.match(/color=#182809>([^<]+)/)[1];
    var world = XHR.responseText.match(/>[^<]+<\/td><td>[^<]+<\/td>/g)[1].match(/>[^<]+<\/td><td>([^<]+)<\/td>/)[1];
    var accounts = localStorage.getItem('accounts');
    if (accounts === null) {
        accounts = [];
    } else {
        accounts = accounts.split(',');
    }
    accounts.push(nickname);
    accounts.push(world);
    localStorage.setItem('accounts', accounts);
    return world;
}

function findWorldByPlayersName(name) {
    var accounts = localStorage.getItem('accounts');
    if (accounts === null) {
        accounts = [];
    } else {
        accounts = accounts.split(',');
        for (var i = 0; i < accounts.length; i += 2) {
            if (accounts[i] == name) {
                return accounts[i + 1];
            }
        }
    }
    return null;
}

function formRequest(tbl) {
    var m = parseMap(tbl);
    if (!(m === null || (m !== null && m.length <= 0))) {
        var nickname = localStorage.getItem('nickname');
        while (nickname === null) {
            nickname = prompt("Введите ваш ник", "nickname");
            if (nickname != 'nickname' && nickname != 'new-dragon' && nickname !== '' && nickname !== null) {
                localStorage.setItem('nickname', nickname);
                break;
            }
        }
        return nickname + '&&' + m;
    }
}

/**
 * Desc: add update map button on page with snapshot
 */
function addUpdateMapButton() {
    var b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("class", "cmb");
    b.setAttribute("style", "margin-left: 5%;");
    b.value = "Обновить карту";
    document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[0]
            .rows[0].cells[1].appendChild(b);
    b.addEventListener("click", function() {
        this.disabled = true;
        var tbl = document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[
                document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table").length - 2];  //snapshot
        var req = formRequest(tbl);
        document.getElementById('sd_map').contentWindow.postMessage(req, "http://dragonmap.ru/thispageshouldneverexist");
    }, false);
}

function addGoToMapLink() {
    var a = document.createElement("a");
    a.innerHTML = "На карту";
    a.target = "_blank";
    var tbl = document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[
            document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table").length - 2];
    var xyReg = /x\:(\d+) y\:(\d+)/; //cell coords example: x:424 y:270
    var xy = tbl.rows[tbl.rows.length / 2 - 0.5].cells[tbl.rows[0].cells.length / 2 - 0.5].getElementsByTagName("img")[0].getAttribute("tooltip").match(xyReg);
    a.href = "http://dragonmap.ru/akrit?x=" + xy[1] + "&y=" + xy[2];
    document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[0]
            .rows[0].cells[1].appendChild(document.createTextNode(" / "));
    document.getElementsByTagName("div")[0].getElementsByTagName("center")[0].getElementsByTagName("table")[0]
            .rows[0].cells[1].appendChild(a);
}
function notOnTournamentArena() {
    if (typeof window.top.sitt != "undefined") {
        for (var i = 0; i < window.top.sitt.length; i++) {
            if (window.top.sitt[i] == parseMapAndDoSomeOtherStaff.WORLD) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Description: find table with map, parse cells coordinates and terrain type, join them into single string, send to server
 * Params:
 * onButtonPress: true - function was called by onclick event handler. Map will be updated with info from snapshot.
 */

function parseMapAndDoSomeOtherStaff() {
    // addOptionsButton();
    var world;
    if (location.href.search('snapshot') != -1) {
        // check if in database
        var nick = document.getElementsByTagName("div")[0].getElementsByTagName("table")[0].rows[0].cells[1]
                .getElementsByTagName('a')[0].innerHTML;
        world = findWorldByPlayersName(nick);
        if (world == parseMapAndDoSomeOtherStaff.WORLD) {
            addGoToMapLink();
            addUpdateMapButton();
        } else if (world === null) {
            ajaxRequest(document.getElementsByTagName("div")[0].getElementsByTagName("table")[0].rows[0].cells[1]
                    .getElementsByTagName('a')[0].href,
                    'POST', '', function(XHR) {
                        var world = addToAccounts(XHR);
                        if (world == parseMapAndDoSomeOtherStaff.WORLD) {
                            addGoToMapLink();
                            addUpdateMapButton();
                        }
                    }, function() {
            }, []);
        }
    } else if (location.href.pathname === "f/a" && notOnTournamentArena() && typeof window.top.players !== "undefined") {
        var tbl;  // table with map
        var dmap = top.document.getElementById('dmap');
        if (dmap) {
            tbl = dmap.firstChild.rows[1].cells[1].firstChild;   // game map
        } else if (document.getElementsByTagName('button')[0] && document.getElementsByTagName('button')[0].innerHTML == "Вернуться") {
            tbl = document.getElementsByTagName('button')[0].nextSibling;  // Observatory -> View
        }
        var req = formRequest(tbl);
        world = findWorldByPlayersName(window.top.players[1]);
        if (world == parseMapAndDoSomeOtherStaff.WORLD) {
            console.log(window);
            document.getElementById('sd_map').contentWindow.postMessage(req, "http://dragonmap.ru/thispageshouldneverexist");
            var fonts = document.getElementsByTagName("font");
            if (fonts) {
                for (var i = 0; i < fonts.length; i++) {
                    if (fonts[i].innerHTML == "Снэпшот успешно сделан.") {
                        ajaxRequest('http://warchaos.ru/snapshots/0', 'POST', '', function(XHR, font) {
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
                                function() {
                                    // l('err')
                                },
                                fonts[i]
                                );
                    }
                }
            }
        } else if (world === null) {
            ajaxRequest('http://warchaos.ru/~uid/', 'POST', '', function(XHR, args) {
                var world = addToAccounts(XHR);
                if (world == parseMapAndDoSomeOtherStaff.WORLD) {
                    document.getElementById('sd_map').contentWindow.postMessage(args, "http://dragonmap.ru/thispageshouldneverexist");
                }
            }, function() {
            }, req);
        }
    }
} // fun

function mapper_shaz_init() {
    if (location.href.search(/snapshot|f\/a/) != -1) {
        var sd_map_iframe = document.createElement('iframe');
        sd_map_iframe.setAttribute('src', 'http://dragonmap.ru/thispageshouldneverexist');
        sd_map_iframe.setAttribute('id', 'sd_map');
        sd_map_iframe.setAttribute('style', 'width: 80%; height: 100%; margin: 30px 50px 30px 50px; display: none;'); //display: none;
        document.body.appendChild(sd_map_iframe);
        (function(f) {
            var wc_ifr = document.getElementById("ifr");
            if (wc_ifr)
                wc_ifr.addEventListener("load", function() {
                    setTimeout(f, 0);
                }, false);
            f();
        })(parseMapAndDoSomeOtherStaff);
    } else if (location.href == "http://dragonmap.ru/thispageshouldneverexist") {
        addEventListener('message', function(e) {
            if (e.origin === 'http://warchaos.ru') {
                    console.log('incoming ' + ' from ' + e.origin + ' ' + e.data );
                var mapperURL = "http://dragonmap.ru/cgi-bin/mapper3";
                ajaxRequest(mapperURL, 'POST', e.data, function() {
                }, function() {
                });
            }
        }, false);
    }
    /*
     else {
     setTimeout(function() {
     var a = document.getElementById("scripts_options_a");
     if (a) {
     a.addEventListener("click", function() {
     setTimeout(function() {
     var div = document.getElementById("scripts_options_div");
     div.innerHTML += "<b>Warchaos Mapper for Liaf</b>";
     }, 0);
     }, false);
     }
     }, 0);
     
     }
     */
}

function mapper_shaz() {
    //stub
}