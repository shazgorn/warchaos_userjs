// ==UserScript==
// @name           Dragonmap town settler
// @namespace      https://github.com/shazgorn/warchaos_userjs
// @description    Set towns on dragonmap
// @match          http://dragonmap.ru/mortal/*
// @version        1.0
// @downloadURL    https://raw.github.com/shazgorn/warchaos_userjs/master/dragonmap/towns.user.js
// ==/UserScript==


$(document).ready(function () {
    var style = document.createElement("style");
    style.innerHTML = ".ind-phantom {\n\
background-color: #00D1FF;\n\
border-bottom: 1px solid #00D1FF;\n\
border-left: 2px solid #00D1FF;\n\
border-right: 2px solid #00D1FF;\n\
height: 1px;\n\
width: 30px;\n\
}"
    document.head.appendChild(style);
    addEventListener("click", function (e) {
        var tar = $(e.target);
        if (tar.attr("class") && tar.attr("class").search("bg") !== -1) {
            var phantomTown = document.createElement("img");
            phantomTown.src = "img/un/13.gif";
            tar.append(phantomTown);
            var indPhantom = $(document.createElement("img"));
            indPhantom.addClass("ind-phantom");
            indPhantom.attr("src", "img/ind.gif");
            tar.append(indPhantom);
            var m = tar.attr("tt").match(/x:(\d+) y:(\d+)/);
            if (m) {
                for (var i = -5; i < 5; i++) {
                    for (var j = -5; j < 5; j++) {
                        var cell = $("td[tt*='x:" + (parseInt(m[1]) + i) + " y:" + (parseInt(m[2]) + j) + "']");
                        if (i === 0 && j === 0) {
                            cell.attr("fl", "10");
                        } else {
                            cell.attr("fl", "8");
                        }
                        if (cell.children("img[src='img/ovr_1/red.gif']").length === 0) {
                            var redHover = $(document.createElement("img"));
                            redHover.attr("src", "img/ovr_1/red.gif");
                            redHover.addClass("op");
                            if (cell.children("*").length > 0) {
                                redHover.addClass("shift");
                            }
                            cell.append(redHover);
                        }
                    }
                }
            }
        }
    });
});