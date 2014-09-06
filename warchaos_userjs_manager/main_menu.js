var navLinks = [
    ["Боевые", "http://warchaos.ru/log/1/0/"],
    ["Архив", "http://warchaos.ru/archive/0/1/"],
    ["Обзор аккаунта", "http://warchaos.ru/report/0/65535"],
    ["Управление", "http://warchaos.ru/user/game/"],
    ["Настройки", "http://warchaos.ru/user/preferences/"],
//            ["Ситы", ""]
];

function getWindowObject() {
    return window;
}

function highlightLink(pagename, linkname) {
    if (document.URL.search(pagename) != -1) {
        var lis = document.getElementsByTagName('li');
        for (var i = 0; i < lis.length; i++)
            if (lis[i].getAttribute('class') != "lis" && lis[i].childNodes[0].innerHTML == linkname) {
                lis[i].setAttribute('class', "lis");
                lis[i].childNodes[0].setAttribute('style', "font-style:italic");
                break;
            }
    }
}

function unhighlightLink(pagename, linkname) {
    if (document.URL.search(pagename) != -1) {
        var lis = document.getElementsByTagName('li');
        for (var i = 0; i < lis.length; i++)
            if (lis[i].getAttribute('class') == "lis" && lis[i].childNodes[0].innerHTML == linkname) {
                lis[i].removeAttribute('class');
                lis[i].childNodes[0].setAttribute('style', "font-style:normal");
                break;
            }
    }
}

function addCheckAllButton() {
    var b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("class", "xcmb");
    b.setAttribute("value", "Выделить все");
    b.setAttribute("style", "margin-left: 4px;");
    //document.body.appendChild(b);
    b.addEventListener("click", function() {
        var cb = document.getElementsByTagName("input");
        for (var i = 0; i < cb.length; i++) {
            if (cb[i].getAttribute("type") == "checkbox") {
                cb[i].checked = true;
            }
        }
    }, false);
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].hasAttribute("value") && inputs[i].getAttribute("value") == "Удалить") {
            $(b).appendTo(inputs[i].parentNode);
        }
    }
}
function addMenuItem(ul, text, link) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", link);
    a.innerHTML = text;
    li.appendChild(a);
    ul.appendChild(li);
}
function getTownLinks() {
    var bs = $("#cise > table > tbody > tr > td button[rc]");
    var buttons = [];
    // var div = document.createElement("div");
    var button;
    for (var i = 0; i < bs.length; i++) {
        // console.log(bs[i].getAttribute("rc"), bs[i].nextSibling.nextSibling.data);
        button = document.createElement("button");
        button.setAttribute("rc", bs[i].getAttribute("rc"));
        button.setAttribute("onclick", bs[i].getAttribute("onclick"));
        $(button).button({label: bs[i].childNodes[0].childNodes[0]
                    .nextSibling.nextSibling.data}).click(function() {

        });
        buttons.push(button);
    }
    return buttons;
}
// potions control
function potionControl() {
    return;
    $('img[src="395.gif"], img[src="345.gif"], img[src="435.gif"], img[src="385.gif"]').each(function(i, potionIco) {
        function blink(potionIco, interval) {
            setInterval(function(interval) {
                $(potionIco).fadeOut(interval).fadeIn(interval);
            }, interval * 2);
        }
        var times = $(potionIco).attr('tooltip').match(/(\d+):(\d+):(\d+)/);
        var h = times[1];
        if (h < 3) {
            blink(potionIco, 400);
            $(potionIco).css('border', '2px dashed red');
        } else if (h < 6) {
            $(potionIco).css('border', '2px dashed red');
        } else if (h < 12) {
            $(potionIco).css('border', '1px dotted yellow');
        }
    });
}
var seats = [];
function getSeats(page) {
    $.ajax({
        url: "http://warchaos.ru/archive/0/" + page,
        type: "GET",
        // async: true,
        success: function(data) {
            var m = data.split('<table class="xrw xmsg" cellspacing=0 cellpadding=0>');
            for (var i = 0; i < m.length; i++) {
                if (m[i].search("Вы можете принять управление данным аккаунтом на") != -1) {
                    var name = m[i].match(/<td class=rwleft valign=top><b>([^<]+)</)[1];
                    console.log(name);
                    seats.push(m[i]);
                    console.log(m[i]);
                }
            }
            console.log(seats.length);
            m = data.match(/href=http:\/\/warchaos.ru\/archive\/0\/(\d+)\/\d+>Следующая/);
            console.log(m);
            if (m !== null && m.length == 2) {
                getSeats(m[1]);
            }
        }
    });
}
function createTopNavBar() {
    var i;
    // getSeats(1);
    if ($("#nav-bar-2").length === 0 && $("#mnd").length === 1) {
//                var div = document.createElement("div");
//                div.setAttribute("id", "navBar");
//                div.setAttribute("style", "position: fixed; top:0");
        var ulMenu = document.createElement("ul");
        var liMenu;
        var buttons = getTownLinks();
        for (i = 0; i < buttons.length; i++) {
//                    div.appendChild(buttons[i]);
        }
        for (i = 0; i < navLinks.length; i++) {
            var dropdownMenu;
            var a = document.createElement("a");
            a.innerHTML = navLinks[i][0];
            if (a.innerHTML === "Ситы") {
                var seats = sessionStorage.getItem("seats");
//                        seats = null;
                if (seats === null) {
                    $.get("http://warchaos.ru/archive/0/1").done(function(data) {
                        var d = $.parseHTML(data);
                        if (d) {
                            var tables = $(d[4]).find('table[class="xrw xmsg"]');
                            var seatsStr = "";
                            $(tables).each(function(i, table) {
                                var nickname = $(table).find("td.rwleft b").get(0).innerHTML;
                                var button = $(table).find("img[src='ctrl/x1but10.gif'][class='xbut']");
                                if (button.length) {
                                    var clickCode = $(button).attr("onclick");
                                    seatsStr += nickname + "," + clickCode + "|";
                                }
                            });
                            sessionStorage.setItem("seats", seatsStr);
                        }
                    });
                } else {
                    dropdownMenu = document.createElement("ul");
                    $(dropdownMenu).addClass("dropdown-menu");
                    $(seats.split('|')).each(function(i, el) {
                        var seatNick = el.split(",")[0];
                        var seatAction = el.split(",")[1];
                        var seatAnchor = document.createElement('a');
                        $(seatAnchor).html(seatNick);
                        $(seatAnchor).attr('href', '');
                        $(seatAnchor).click(function(e) {
                            e.preventDefault();
                            eval(seatAction);
                        });
                        var seat = document.createElement('li');
                        $(seat).append(seatAnchor);
                        $(dropdownMenu).append(seat);
                    });
                    var cancel = $(document.createElement('a'));
                    cancel.html('Отмена');
                    cancel.attr('href', '');
                    cancel.css('color', 'red');
                    cancel.click(function(e) {
                        e.preventDefault();
                        var iframe = $(document.createElement('iframe'));
                        iframe.attr('src', 'http://warchaos.ru/user/game/');
                        iframe.attr('name', 'control');
                        iframe.attr('id', 'control');
                        iframe.css('display', 'none');
                        $('body').append(iframe);
                        var iframeDoc = iframe.get(0).contentDocument;
                        $(iframe).load(function() {
                            $(iframeDoc.body).find('button.xcmb2').click();
                        })
                    });
                    liMenu = document.createElement('li');
                    $(liMenu).append(cancel);
                    $(dropdownMenu).append(liMenu);
                    $(a).after(dropdownMenu);
                }
                var form = document.createElement('form');
                form.id = "cmdform";
                form.name = "cmdform";
                form.action = "http://warchaos.ru/archive/0/1";
                form.method = "post";
                function ci(name) {
                    var input = document.createElement("input");
                    input.name = name;
                    input.type = "hidden";
                    return input;
                }
                var arr = ["d", "x", "y", "z"];
                $(arr).each(function(i) {
                    $(form).append(ci(arr[i]));
                });
                $('body').append(form);
//                        $(a).click(function() {
//                            form.d.value = 10;
//                            form.x.value = 221;
//                            console.log(form);
//                            form.submit();
//                        });

            } else {
                a.setAttribute("href", navLinks[i][1]);
            }
//                    div.appendChild(a);
            aClone = a.cloneNode(true);
            $(a).button();
            liMenu = document.createElement('li');
            $(liMenu).append(aClone);
            if (dropdownMenu) {
                $(liMenu).addClass('dropdown');
                $(liMenu).append(dropdownMenu);
            }
            $(ulMenu).append(liMenu);
        }
        $(ulMenu).attr('id', 'nav-bar-2');
        $("<style>.dropdown-menu {display: none;} .dropdown:hover .dropdown-menu {display:block;}</style>").appendTo("head");
        $("<style>#nav-bar-2 {position:fixed; top:0px;}\n\
#nav-bar-2, #nav-bar-2 ul {list-style-type: none;padding-left: 0px;}\n\
#nav-bar-2 > li {float:left;background: #94613D url('http://warchaos.ru/fp/ctrl/bg_4.gif') repeat;\n\
border: 1px solid #593008;color: #4C3000;font-weight: 700;font-size: 12px;padding: 4px 12px;}\n\
#nav-bar-2 a {color: #281604; text-decoration:none;font-family: Arial;}\n\
#nav-bar-2 a:hover {color:#FF912E;}\n\
#nav-bar-2 > li:hover {border: 1px solid #CC7A00;}\n\
#nav-bar-2 li {}</style>").appendTo("head");
        $('body').prepend(ulMenu);
//                $('body').prepend(div);
    }
}
function clickFunctions() {
    addAdditionalNav();
    potionControl();
}
function addAdditionalNav() {
    // return;
    createTopNavBar();
    return;
    // getTownLinks();
    if ($("#addmenu").length === 0 && $("#drig").length == 1) {
        // var table = $("#drig > table").get(0);
        // var row = table.insertRow(table.rows.length - 2);
        // var row = table.rows[1];
        // var cell = row.insertCell(1);
        var cell = $("#drig > table > tbody > tr").get(1).cells[1];

        // cell = row.insertCell(1);
        // row.insertCell(2);
        // cell.setAttribute("colspan", "2");
        // if ($("#addmenu").length === 0 && $("#cise table").length == 1) {
        /*
         var table = $("#cise table").get(0);
         var row = table.insertRow(table.rows.length);
         var cell;
         for (var i = 0; i < table.rows[0].cells.length; i++) {
         cell = row.insertCell(row.cells.length)
         if (table.rows[0].cells[i].getElementsByTagName("img")[0].getAttribute("src") == "ctrl/54.gif")
         break;
         }
         */
        var ul = document.createElement("ul");
        ul.setAttribute("id", "addmenu");
        cell.appendChild(ul);
        $(ul).prependTo(cell);
        // $(ul).prependTo($("#mnd"));
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "/f/a";
        a.innerHTML = "Перейти";
        li.appendChild(a);
        ul.appendChild(li);
        var inUl = document.createElement("ul");
        li.appendChild(inUl);

        for (var i = 0; i < navLinks.length; i++) {
            addMenuItem(inUl, navLinks[i][0], navLinks[i][1]);
        }
        $("#addmenu").menu({position: {my: "left top", at: "left+0 top-90"}});
    }
}

function main_menu() {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "http://warchaosujs.gixx.ru/jquery-ui/css/sunny/jquery-ui-1.10.3.custom.css");
    document.head.appendChild(link);
    var li, a, i, j;
    if (document.URL != "http://warchaos.ru/f/a") {
        var bookBlockId = "me500i";
        var clanBlockId = "me200i";
        var as = document.getElementsByTagName('a');
        for (i = 0; i < as.length; i++) {
            if (as[i].parentNode.tagName == "LI" && as[i].href.search("http://warchaos.ru/clan/manager/") != -1) {
                //Clan Profile
                var clan_uid = sessionStorage.getItem("clan");
                if (clan_uid === null)
                    $.ajax({
                        url: "http://warchaos.ru/uid/",
                        type: "GET",
                        async: false,
                        success: function(data) {
                            var m;
                            m = data.match(
                                    /<b>Клан\:<\/b><\/td><td height=21 width=50%>&nbsp;<a href=http:\/\/warchaos\.ru\/uid\/(\d+)>(.+)<\/a>/);
                            if (m !== null) {
                                clan_uid = m[1];
                            } else {
                                clan_uid = "";
                            }
                        }
                    });
                if (clan_uid !== "") {
                    li = document.createElement('li');
                    document.getElementById(clanBlockId).appendChild(li);
                    a = document.createElement('a');
                    a.href = "http://warchaos.ru/uid/" + clan_uid;
                    li.appendChild(a);
                    document.links[++i].innerHTML = "Профиль клана";
                    if (document.URL == "http://warchaos.ru/uid/" + clan_uid) {
                        li.setAttribute('class', "lis");
                        a.setAttribute('style', "font-style:italic");
                    }
                }
            }
            if (as[i].parentNode.tagName == "LI" && as[i].href == "http://warchaos.3dn.ru/forum/") {
                //Profile
                li = document.createElement('li');
                document.getElementById(bookBlockId).appendChild(li);
                a = document.createElement('a');
                a.href = "http://warchaos.ru/uid/";
                li.appendChild(a);
                document.links[++i].innerHTML = "Мой профиль";
                if (document.URL == "http://warchaos.ru/uid/") {
                    li.setAttribute('class', "lis");
                    a.setAttribute('style', "font-style:italic");
                }
                // Sripts
                li = document.createElement('li');
                document.getElementById(bookBlockId).appendChild(li);
                a = document.createElement('a');
                a.href = "https://github.com/shazgorn/warchaos_userjs/wiki/Описания-скриптов";
                a.target = "_blank";
                li.appendChild(a);
                document.links[++i].innerHTML = "Скрипты";
                //Scripts options
                /*
                 li = document.createElement('li');
                 document.getElementById(bookBlockId).appendChild(li);
                 a = document.createElement('a');
                 a.href = "javascript://";
                 a.setAttribute("id", "scripts_options_a");
                 li.appendChild(a);
                 document.links[++i].innerHTML =  "Настройки скриптов";
                 a.addEventListener('click', function (e) {
                 var w = window;
                 w.help1 = "Настройки скриптов";
                 w.help2 = "<div id='scripts_options_div'></div>";
                 w.ShowWin();
                 },false);
                 */
                //Map
                li = document.createElement('li');
                document.getElementById(bookBlockId).appendChild(li);
                a = document.createElement('a');
                a.href = "http://dragonmap.ru/akrit/";
                a.target = "_blank";
                li.appendChild(a);
                document.links[++i].innerHTML = "Карта";
                break;
            }
        }//for

        //Add next/prev links at top of pages. Use with caution
        if (document.URL.search(/msg|log|archive|clan\/\d|lenta|snapshots|top/) != -1) {
            var mtext = $(".mtext").get(0);
            if (mtext !== null && mtext.innerHTML.search("Следующая") != -1) {
                var nextPrevBar = mtext.cloneNode(true);
                var firstMsg = $(".xrw xmsg").get(0);
                if (!firstMsg)
                    firstMsg = $(".xrw").get(0);
                if (firstMsg)
                    firstMsg.parentNode.insertBefore(nextPrevBar, firstMsg);
                var td = $(nextPrevBar).find("td:nth-child(3)");
                var nextLink = $(nextPrevBar).find("td:nth-child(3) a");
                var m = window.location.href.match(/([^\d]+\d+\/)(\d+)/);
                for (var i = 2; i < 7; i++) {
                    var ai = document.createElement('a');
                    ai.href = m[1] + (parseInt(m[2]) + i);
                    ai.innerHTML = (parseInt(m[2]) + i);
                    var text = document.createTextNode(' ');
                    td.append(text);
                    td.append(ai);
                }
                var input = document.createElement("input");
                input.type = "text";
                input.size = 3;
                input.setAttribute('maxlength', 3);
                input.setAttribute("class", "ybox");
                input.setAttribute("id", "goto-page");
                input.setAttribute("pattern", "[0-9]+");
                go = document.createElement('input');
                go.setAttribute('type', 'submit');
                go.setAttribute('value', 'Go');
                go.setAttribute('class', 'cmb');
                go.setAttribute('style', 'width: 30px');
                var form = $(document.createElement('form'));
                form.attr('style', 'display: inline;');
                text = document.createTextNode(' ');
                form.append(text);
                form.append(input);
                text = document.createTextNode(' ');
                form.append(text);
                form.append(go);
                form.submit(function(e) {
                    event.preventDefault();
                    var m = window.location.href.match(/([^\d]+\d+\/)(\d+)/);
                    window.location.href = m[1] + $("#goto-page").val();
                });
                td.append(form);
            } else if (document.URL.search("msg/1") == -1) {
                //change font color to black in messages everywhere except trade messages
                var tds = document.getElementsByTagName("TD");
                if (tds) {
                    for (i = 0; i < tds.length; i++) {
                        if (tds[i].hasAttribute("class") && tds[i].getAttribute("class") == "rwRight") {
                            var fonts = tds[i].getElementsByTagName("FONT");
                            if (fonts) {
                                for (j = 0; j < fonts.length; j++) {
                                    if (fonts[j].hasAttribute("color"))
                                        fonts[j].setAttribute("color", "black");
                                }
                            }
                        }
                    }
                }
            }
        }
        // add check all button to snapshots, msg, archive pages
        if (document.URL.search("snapshots") != -1) {
            addCheckAllButton();
        } else if (document.URL.search(/msg|archive/) != -1) {
            if (document.getElementById("delbut") !== null) {  //if on redirect page
                document.getElementById("delbut").getElementsByTagName("a")[0].addEventListener("click", function() {
                    addCheckAllButton();
                }, false);
            }
        }
        // pro seat
        if (document.URL.search("user/game") != -1) {
            var cb = $("input[type='checkbox']");
            for (i = 0; i < cb.length; i++) {
                if (i != 1 && i != 2) {
                    cb[i].checked = true;
                }
            }
            if (document.getElementsByName('y') !== null && document.getElementsByName('y')[0] !== null) {
                document.getElementsByName('y')[0].value = 1;
                if (document.getElementsByName('i11')[0] !== null)
                    document.getElementsByName('i11')[0].value = 21;
            }
        }
        highlightLink("lenta/7/", "Лиаф");
        highlightLink("group", "Группа");
        //unhighlightLink("lenta/2/", "Лиаф");
        unhighlightLink("/uid", "Энциклопедия");

        if (document.URL.search("worlds") != -1) {
            var b = document.getElementsByTagName('b');
            var tables;
            for (i = 0; i < b.length; i++) {
                if (b[i].innerHTML == "Материк") {
                    tables = b[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('table');
                    break;
                }
            }
            var onclickReg = /(\d+)/g;  //get coords of continent rectangle
            for (i = 1; i < tables.length; i++) {
                var contName = tables[i].getElementsByTagName('span')[0].innerHTML;
                var coords = tables[i].getElementsByTagName('span')[0].getAttribute('onclick').match(onclickReg);
                var w = getWindowObject();
                var o = document.getElementById('worldmap');
                var span = document.createElement('span');
                var top = w.GetTop(o) + (Number(coords[2]) + Number(coords[3])) / 2;
                var left = w.GetLeft(o) + (Number(coords[0]) + Number(coords[1])) / 2;

                if (i == 32 && document.getElementsByTagName('font')[0].innerHTML == "Акрит") {
                    top += 32;
                    left += 32;
                }

                span.setAttribute('class', 'slnk');
                span.setAttribute('style', "position:absolute; top:" + top + "px; left:" + left + "px; color:orange; font-size:12pt;");
                span.setAttribute('onclick', tables[i].getElementsByTagName('span')[0].getAttribute('onclick'));
                span.setAttribute("tooltip", tables[i].rows[0].cells[4].innerHTML);
                var s = contName.split(" ");
                if (s != contName) {
                    for (j = 0; j < s.length; j++) {
                        span.appendChild(document.createTextNode(s[j]));
                        span.appendChild(document.createElement("br"));
                    }
                } else {
                    span.appendChild(document.createTextNode(contName));
                }
                document.getElementById('worldmap').parentNode.appendChild(span);
            }
        }
    } else if (document.URL === "http://warchaos.ru/f/a") {
        setTimeout(clickFunctions, 100);
        var wc_ifr = document.getElementById("ifr");
        if (wc_ifr) {
            wc_ifr.addEventListener("load", function() {
                setTimeout(clickFunctions, 100);
            }, false);
        }
    }
    potionControl();
}