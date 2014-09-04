// ==UserScript==
// @name           Warchaos Icon Replacer
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Replace default recipe icon(1914.gif). Add art info
// @match          http://warchaos.ru/*
// @version        1.23
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_icon_replacer.user.js
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
    document.body.appendChild(script);
    console.log(scripts);
    for (var i = 0; i < scripts.length; i++) {
        var script = document.createElement('script');
        script.src = basepath + scripts[i].name + '.js';
        console.log(1);
        if (window.frames['ifr']) {
            console.log(2);
            window.addEventListener('click', function() {
                console.log(3);
                icon_replacer();
            }, false);
        }
    }

//    var script = document.createElement('script');
//    script.textContent = '(' + source + ')();';
//    document.body.appendChild(script);
//    document.body.removeChild(script);
}

init();

