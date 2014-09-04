// ==UserScript==
// @name           Warchaos Icon Replacer
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Replace default recipe icon(1914.gif). Add art info
// @match          http://warchaos.ru/*
// @version        1.23
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/wc_icon_replacer.user.js
// ==/UserScript==

if (typeof u === "undefined") {
//    u = $('#cise').get(0);
    u = document.getElementById('cise');
}

(function() {
    // return;
    function source() {
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
        function replaceIcons() {
            if (typeof $ === "undefined") {
                addScript("http://code.jquery.com/jquery-1.9.1.js");
            }
            if (typeof $ === "undefined") {
                setTimeout(replaceIcons, 100);
                return;
            }
            if ($('#ss').length === 0) {
                var b = document.createElement('button');
                b.innerHTML = "start";
                b.id = 'ss';
                $(b).click(function() {
                    ss = 0;
                    sessionStorage.setItem('brew', 1);
                    console.log('drop');
                });
                $(b).appendTo('body');
            }
        }
        // semaphore


        (function() {
            var script = document.createElement('script');
            script.src = "1.js";
            return;
            script.textContent = '(' + source + ')();';
            document.body.appendChild(script);
        })();
    }
    var script = document.createElement('script');
    script.textContent = '(' + source + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})();

