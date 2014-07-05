// ==UserScript==
// @name           Warchaos Icon Replacer Lite
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Replace default recipe icon(1914.gif). Add art info. lite version
// @match          http://warchaos.ru/*
// @downloadURL    https://raw.githubusercontent.com/shazgorn/warchaos_userjs/lite/wc_icon_replacer.user.js
// @version        1.00
// ==/UserScript==


(function() {
    // return;
    function source() {
        function insertAfter(el1, el2) {
            if (!el2.parentNode)
                return;
            if (el2.nextSibling)
                el2.parentNode.insertBefore(el1, el2.nextSibling);
            else
                el2.parentNode.appendChild(el1);
        }
        function addScript(src) {
            var scripts = document.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].getAttribute("src") === src)
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
            var re = /it\/(\d+)\.gif/i, //pic
                    art = /(I*V*)\** *((?:SL|FC|R|r\d+| )*)* *(?:\$Осталось: )*(\d+)/, //art info
                    re3 = /x\d+/, //crafts
                    parent, el,
                    imgs = document.images;
            var romeToArab = {
                I: 1,
                II: 2,
                III: 3,
                IV: 4,
                V: 5
            };

            for (var i = 0; i < imgs.length; i++) {
                if (!imgs[i].hasAttribute('sck') && imgs[i].hasAttribute("src")) {
                    var m = imgs[i].getAttribute('src').match(re);
                    var item = m ? parseInt(m[1], 10) : 0;
                    if (item >= 604 && item <= 1764) {
                        parent = imgs[i].parentNode;
                        if (parent.nodeName === "BUTTON") {
                            parent.setAttribute('style', "max-height:40px;");
                        }
                        if (imgs[i].hasAttribute("tooltip") && parent.childNodes.length === 1
                                || (parent.childNodes.length === 3 && parent.childNodes[2].nodeName === 'INPUT')
                                || (imgs[i].parentNode.hasAttribute("class")
                                        && imgs[i].parentNode.getAttribute("class") === "tlnx"
                                        && imgs[i].parentNode.childNodes.length === 1)
                                || (imgs[i].parentNode.hasAttribute("class")
                                        && imgs[i].parentNode.getAttribute("class") === "tlnx"
                                        && imgs[i].parentNode.childNodes.length === 2 &&
                                        imgs[i].nextSibling.getAttribute("src") === "q.gif")
                                ) {
                            m = art.exec(imgs[i].getAttribute('tooltip'));
                            var lvl = document.createElement('span');
                            var style = 'color:yellow; position:relative; width:45px; white-space:nowrap;';
                            lvl.setAttribute('style', style + 'top:-40px; left:-15px; font-size: 12px; font-weight: bold;');
                            lvl.innerHTML = "<br>" + (m[1] === "" ? "" : romeToArab[m[1]]) + "<br>";
                            insertAfter(lvl, imgs[i]);
                            el = document.createElement('span');
                            if (typeof m[2] === "undefined") {
                                el.innerHTML = m[3];
                                el.setAttribute('style', style + 'top:-27px;left:12; font-size: 10px;');
                            } else {
                                el.innerHTML = m[2] + (m[2].length === 2 ? "&nbsp;&nbsp;" : "") + m[3];
                                el.setAttribute('style', style + 'top:-27px;left:0; font-size: 10px;');
                            }
                            insertAfter(el, lvl);
                        }
                    }
                }
            }//for
        }
        (function(f) {
            addEventListener('click', function() {
                setTimeout(f, 0);
            }, false);
            var wc_ifr = document.getElementById("ifr");
            if (wc_ifr)
                wc_ifr.addEventListener("load", function() {
                    setTimeout(f, 0);
                }, false);
            f();
        })(replaceIcons);
    }
    var script = document.createElement('script');
    script.textContent = '(' + source + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})();

