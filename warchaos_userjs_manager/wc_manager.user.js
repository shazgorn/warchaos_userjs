// ==UserScript==
// @name           Warchaos Userjs Manager
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    manager
// @match          http://warchaos.ru/*
// @version        1.00
// ==/UserScript==
function f() {
    function addScript(src) {
        var docscripts = document.getElementsByTagName('script');
        for (var i = 0; i < docscripts.length; i++) {
            if (docscripts[i].getAttribute('src') == src)
                return;
        }
        var script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }
    function init() {
        console.log(0);
        if (typeof u === 'undefined') {
            u = document.getElementById('cise');
        }
        if (typeof $ === 'undefined') {
            addScript('http://code.jquery.com/jquery-1.9.1.js');
        }
        if (typeof $ === 'undefined') {
            console.log('a');
            setTimeout(init, 100);
            return;
        }
        console.log(1);
        if (typeof scripts === 'undefined') {
            console.log(2)
            var script = document.createElement('script');
            var basepath = 'https://raw.githubusercontent.com/shazgorn/warchaos_userjs/master/warchaos_userjs_manager/';
            var scrname = 'scripts';
            console.log(3)
            script.src = basepath + scrname + '.js';
            console.log(4)
            document.body.appendChild(script);
            script.addEventListener('load', function() {
                console.log('script load');
                console.log(scripts);
                init2();
            }, false)
            console.log(5)
            console.log(window.scripts);
            console.log(6);
            setTimeout(init, 100);
            return;
        }
        console.log(7);
        function init2() {
            for (var i = 0; i < scripts.length; i++) {
                var script = document.createElement('script');
                script.src = basepath + scripts[i].name + '.js';
                console.log(1);
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
                                    //eval(name + '()');
                                }, false);
                                break;
                        }
                    }
                }
                document.body.appendChild(script);
            }
        }
    }

    init();
}
var script = document.createElement('script');
script.textContent = '(' + f + ')();';
document.body.appendChild(script);
//document.body.removeChild(script);
