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
        function bindEvents(script) {
            var ifr = window.frames['ifr'];
            if (ifr) {
                var name = script.name;
                for (var k = 0; k < script.events.length; k++) {
                    switch (script.events[k]) {
                        case 'click':
                            console.log(name);
                            window.addEventListener('click', function() {
                                evalScript(name);
                            }, false);
                            break;
                        case 'load':
                            break;
                        case 'frame_load':
                            ifr.addEventListener('load', function() {
                                evalScript(name);
                            }, false);
                            break;
                    }
                }
            }
        }
        function evalScript(name) {
            setTimeout(function() {
//                console.log(name);
                eval(name + '()');
            }, 1000);
        }
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
                    if (scripts[i].match) {
                        for (var j = 0; j < scripts[i].match.length; j++) {
                            var lastIndex = scripts[i].match[j].length - 1, matchurl = scripts[i].match[j];
                            if ((matchurl.charAt(lastIndex) === "*"
                                    && location.href.substr(0, lastIndex) === matchurl.substr(0, lastIndex))
                                    || location.href === matchurl) {
                                addScript(basepath + scripts[i].name + '.js');
                                if (scripts[i].events) {
                                    bindEvents(scripts[i]);
                                }
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
