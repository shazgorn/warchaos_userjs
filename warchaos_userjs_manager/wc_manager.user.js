// ==UserScript==
// @name           Warchaos Userjs Manager
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    manager
// @match          http://warchaos.ru/*
// @version        1.00
// ==/UserScript==
function f() {
    /*
     * scr - script source url
     * onload - handler to fire on load event
     */
    function addScript(src, onload) {
        var docscripts = document.getElementsByTagName('script');
        for (var i = 0; i < docscripts.length; i++) {
            if (docscripts[i].getAttribute('src') === src)
                return;
        }
        var script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
        if (onload) {
            script.addEventListener('load', onload, false);
        }
        return script;
    }
    (function() {
        var basepath;
        if (navigator.appVersion.search('Chrome') === -1) {
            basepath = "https://raw.githubusercontent.com/shazgorn/warchaos_userjs/master/warchaos_userjs_manager/";
        } else {
            basepath = "https://rawgit.com/shazgorn/warchaos_userjs/master/warchaos_userjs_manager/";
        }
        // жабаскрипт головного мозга
        addScript("http://code.jquery.com/jquery-1.9.1.js", function() {
            addScript(basepath + 'scripts.js', function() {
                for (var i = 0; i < scripts.length; i++) {
                    addScript(basepath + scripts[i].name + '.js');
                    var ifr = window.frames['ifr'];
                    if (ifr) {
                        var name = scripts[i].name;
                        for (var j = 0; j < scripts[i].events.length; j++) {
                            switch (scripts[i].events[j]) {
                                case 'click':
                                    window.addEventListener('click', function() {
                                        eval(name + '()');
                                    }, false);
                                    break;
                                case 'load':
                                    break;
                                case 'frame_load':
                                    ifr.addEventListener('load', function() {
                                        eval(name + '()');
                                    }, false);
                                    break;
                            }
                        }
                    }
                }
            });
        });
    })();
}
if (typeof u === 'undefined') {
    u = document.getElementById('cise');
}
var script = document.createElement('script');
script.textContent = '(' + f + ')();';
document.body.appendChild(script);
//document.body.removeChild(script);
