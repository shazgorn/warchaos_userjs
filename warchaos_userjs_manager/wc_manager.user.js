// ==UserScript==
// @name           Warchaos Userjs Manager
// @namespace      https://github.com/shazgorn/warchaos_userjs/warchaos_userjs_manager
// @author         shazgorn@ya.ru
// @description    Control script loading
// @match          http://warchaos.ru/*
// @version        1.00
// @downloadURL    https://raw.githubusercontent.com/shazgorn/warchaos_userjs/master/warchaos_userjs_manager/wc_manager.user.js
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

    function bindEvents(script) {
        var name = script.name;
        if (window[name + '_init']) {
            window[name + '_init']();
        }
        var ifr = window.frames['ifr'];
        if (ifr) {
            for (var k = 0; k < script.events.length; k++) {
                switch (script.events[k]) {
                    case 'click':
                        window.addEventListener('click', function() {
                            evalScript(name, 1000);
                        }, false);
                        break;
                    case 'load':
                        evalScript(name);
                        break;
                    case 'frame_load':
                        ifr.addEventListener('load', function() {
                            evalScript(name, 1000);
                        }, false);
                        break;
                }
            }
        }
    }
    function evalScript(name, delay) {
        if (typeof delay === "undefined") {
            delay = 0;
        }
        setTimeout(function() {
            if (window[name]) {
                window[name]();
            }
        }, delay);
    }
    function loadScript(script) {
        if (typeof window[script.name] === "undefined") {
            addScript(basepath + script.name + '.js', function() {
                if (script.events) {
                    bindEvents(script);
                }
            });
        } else {
            if (script.events) {
                bindEvents(script);
            }
        }
    }
    function loadScripts() {
        var prefs = loadPrefs();
        for (var i = 0; i < scripts.length; i++) {
            if (prefs[scripts[i].name] === "true" && scripts[i].match) {
                for (var j = 0; j < scripts[i].match.length; j++) {
                    var lastIndex = scripts[i].match[j].length - 1, matchurl = scripts[i].match[j];
                    if ((matchurl.charAt(lastIndex) === "*"
                            && location.href.substr(0, lastIndex) === matchurl.substr(0, lastIndex))
                            || location.href === matchurl) {
                        loadScript(scripts[i]);
                        break;
                    }
                }
            }
        }
    }
    function loadPrefs() {
        var prefs = localStorage.getItem("wc_manager_prefs");
        if (prefs !== null) {
            prefs = prefs.split(",");
            $(prefs).each(function(i, pref) {
                var split = pref.split(":");
                prefs[split[0]] = split[1];
            });
        } else {
            prefs = [];
        }
        // if we are in main menu
        if ($("#me600i").length) {
            var li = $(document.createElement("li"));
            li.prependTo("#me600i");
            var a = $(document.createElement("a"));
            a.html("Настройки скриптов");
//            a.attr("href", "#manager-prefs");
            a.click(function() {
                $("#manager-prefs").dialog("open");
            });
            a.css("border-bottom", "thin dashed #003000");
            a.css("cursor", "pointer")
            a.prependTo(li);
            var div = $(document.createElement("div"));
            div.attr("id", "manager-prefs")
            var t = document.createElement("table");
            t.setAttribute("id", "manager-prefs-table");
            $(t).css("color", "black");
            var row = t.insertRow(0);
            var th = $(document.createElement("th"));
            var label = $(document.createElement("label"));
            var input = $(document.createElement("input"));
            input.attr("type", "checkbox");
            input.attr("name", "all");
            input.click(function() {
                var checkboxes = $("#manager-prefs-table td:first-child input[type='checkbox']");
                if ($(this).prop("checked")) {
                    checkboxes.prop("checked", "checked");
                } else {
                    checkboxes.prop("checked", "");
                }
            });
            var text = document.createTextNode("Название");
            label.append(input);
            label.append(text);
            th.append(label);
            $(row).append(th);
            th = document.createElement("th");
            th.innerHTML = "Описание";
            $(row).append(th);
            $(scripts).each(function(i, script) {
                row = t.insertRow(-1);
                var cell = row.insertCell(0);
                label = $(document.createElement("label"));
                input = $(document.createElement("input"));
                input.attr("type", "checkbox");
                input.attr("name", script.name);
                if (prefs[script.name] === "true") {
                    input.prop("checked", true);
                }
                input.appendTo(label);
                label.appendTo(cell);
                var text = document.createTextNode(script.name);
                label.append(text);
                cell = row.insertCell(1);
                if (script.desc) {
                    cell.innerHTML = script.desc;
                }
            });
            var save_button = document.createElement("button");
            $(save_button).button({label: "Сохранить"}).click(function() {
                var prefs = "";
                $("#manager-prefs-table td:first-child input[type='checkbox']").each(function(i, checkbox) {
                    var checkbox = $(checkbox);
                    if (checkbox.prop("checked")) {
                        prefs += checkbox.attr("name") + ":true,";
                    } else {
                        prefs += checkbox.attr("name") + ":,";
                    }
                });
                localStorage.setItem("wc_manager_prefs", prefs);
            });
            div.append(t);
            $(save_button).appendTo(div);
            div.prependTo('body');
            div.dialog({autoOpen: false, width: 600, title: "Настройки скриптов", position: {my: "bottom", at: "top", of: window}});
        }
        return prefs;
    }
    function loadReqLibraries() {
        var librariesToLoad = [];
        $(scripts).each(function(i, script) {
            if (script.libraries) {
                $(script.libraries).each(function(j, lib) {
                    if ($.inArray(lib, librariesToLoad) === -1) {
                        librariesToLoad.push(lib);
                    }
                });
            }
        });
        function loadLibs(librariesToLoad) {
            if (librariesToLoad.length) {
                var lib = librariesToLoad.pop(), src;
                if (lib === "jquery-ui") {
                    src = "http://yastatic.net/jquery-ui/1.11.1/jquery-ui.min.js";
                } else if (lib === "underscore") {
                    src = "http://yastatic.net/underscore/1.6.0/underscore-min.js";
                }
                addScript(src, function() {
                    loadLibs(librariesToLoad);
                });
            } else {
                loadScripts();
            }
        }
        loadLibs(librariesToLoad);
    }
    var basepath;
    if (navigator.appVersion.search('Chrome') === -1) {
        basepath = "https://raw.githubusercontent.com/shazgorn/warchaos_userjs/master/warchaos_userjs_manager/";
    } else {
        basepath = "https://rawgit.com/shazgorn/warchaos_userjs/master/warchaos_userjs_manager/";
    }
    addScript("http://yastatic.net/jquery/2.1.1/jquery.min.js", function() {
        if (typeof scripts === "undefined") {
            addScript(basepath + 'scripts.js', loadReqLibraries);
        } else {
            loadReqLibraries();
        }

    });
}
if (typeof u === 'undefined') {
    u = document.getElementById('cise');
}
var script = document.createElement('script');
script.textContent = '(' + f + ')();';
document.body.appendChild(script);
//document.body.removeChild(script);
