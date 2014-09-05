// ==UserScript==
// @name           Warchaos Userjs Manager
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    manager
// @match          http://warchaos.ru/*
// @version        1.00
// ==/UserScript==

function addScript(src) {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].getAttribute("src") == src)
            return;
    }
    var script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
}

function init() {
    if (typeof u === "undefined") {
        u = document.getElementById('cise');
    }
    if (typeof $ === "undefined") {
        addScript("http://code.jquery.com/jquery-1.9.1.js");
    }
    if (typeof $ === "undefined") {
        setTimeout(init, 100);
        return;
    }
    var script = document.createElement('script');
    basepath = 'https://raw.githubusercontent.com/shazgorn/warchaos_userjs/master/warchaos_userjs_manager/';
    scrname = "scripts";
    script.src = basepath + scrname + '.js';
    document.head.appendChild(script);
    for (var i = 0; i < scripts.length; i++) {
        var script = document.createElement('script');
        script.src = basepath + scripts[i].name + '.js';
        var ifr = window.frames['ifr'];
        if (ifr) {
            var name = scripts[i].name;
            for (var j = 0; j < scripts[i].events.length; j++) {
                switch (scripts[i].events[j]) {
                    case "click":
                        window.addEventListener('click', function() {
                            eval(name + "()");
                        }, false);
                        break;
                    case "load":
                        break;
                    case "frame_load":
                        ifr.addEventListener('load', function() {
                            eval(name + "()");
                        }, false);
                        break;
                }
            }
        }
        document.head.appendChild(script);
    }

//    var script = document.createElement('script');
//    script.textContent = '(' + source + ')();';
//    document.body.appendChild(script);
//    document.body.removeChild(script);
}

init();

