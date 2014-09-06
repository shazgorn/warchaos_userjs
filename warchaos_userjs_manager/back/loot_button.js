var pro = localStorage.getItem("wc_loot_button_pro");
if (pro === null) {
    pro = confirm("Вы хотите чтобы кнопки выбора ресурсов сразу передавали/брали ресурс");
    localStorage.setItem("wc_loot_button_pro", pro);
}
pro = pro == "true" ? true : false;

var srcRg = /(\d+).gif/,
        style = "width: 60px; margin: 2px 4px 2px;";

function getActiveUnitType() {
    return parseInt($("button[class='but40'][onclick='cm6();'] img").attr("src").match(srcRg)[1], 10);
}
/**
 * this listener will listen for click on button on the take tab
 * if it`s hero set takeFromHero flag
 */
var takeFromHero = false;
addEventListener('click', function(e) {
    if (e.target.hasAttribute("tooltip") && e.target.getAttribute("tooltip").search("Герой") != -1) {
        takeFromHero = true;
    }
}, false);
/**
 * goods intervals
 */
var artefacts = {name: "Арты", interval: [504, 1764], count: "all"},
all = {name: "Всё", interval: [0, 10000], count: "all"},
force = {name: "Войска", interval: [2254, 2474], count: "all"},
potions = {name: "Зелья", interval: [24, 114], count: "all"},
potions1 = {name: "Зелья +1", interval: [24, 114], count: 1},
resources = {name: "Ресы", interval: [204, 474], count: "all"},
scrolls = {name: "Свитки", interval: [1934, 2134], count: "all"};
var resTypes = {
    "Арты": {interval: [504, 1764], count: "all"},
    "Всё": {interval: [0, 10000], count: "all"},
    "Войска": {interval: [2254, 2474], count: "all"},
    "Зелья": {interval: [24, 114], count: "all"},
    "Зелья +1": {interval: [24, 114], count: 1},
    "Ресы": {interval: [204, 474], count: "all"},
    "Свитки": {interval: [1934, 2134], count: "all"}
};
function selectGood(action, goodName) {
    var lootTable,
            get = action === "Взять" ? true : false;
    var actButton = $("input[type='submit'][value='" + action + "']");
    if (get)
        lootTable = actButton.prev();
    else
        lootTable = actButton.parent().parent().parent().parent().parent().prev();
    lootTable.find("td[background='ctrl/slot1.gif']").each(function(i, el) {
        var res = srcRg.test($(el).find("img").attr("src")) ? $(el).find("img").attr("src").match(srcRg)[1] : 0;
        if (((get && !(i === 0 && takeFromHero && res > resTypes["Войска"].interval[0] &&
                res < resTypes["Войска"].interval[1])) ||
                (!get && !(i === 0 && getActiveUnitType() > 9000 && getActiveUnitType() % 10 === 0))) &&
                res >= resTypes[goodName].interval[0] && res <= resTypes[goodName].interval[1]) {
            if ($(el).find("*").last().attr("type") == "checkbox") {
                $(el).find("*").last().prop("checked", true);
            } else {
                if (resTypes[goodName].count === "all")
                    $(el).find("*").last().click();
                else
                    $(el).find("input[type='text']").val(parseInt($(el).find("input[type='text']").val(), 10) +
                            resTypes[goodName].count);
            }
        }
    });
}
/**
 * createButton
 * this fun will create button with appropriate listener and goods intervals, add it to the place
 */
function createButton(good) {
    //<input type="submit" class="cmb" value="Взять"
    //<input type="submit" class="cmb" value="Ok"
    var actionButtons = $("input[type='submit'][class='cmb'][value='Взять'], input[type='submit'][class='cmb'][value='Ok']");
    actionButtons.each(function(i, actionButton) {
        if ($(actionButton).nextAll("input[value='" + good.name + "']").length === 0) {
            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("class", "cmb");
            button.setAttribute("style", style);
            button.setAttribute("value", good.name);
            $(actionButton).parent().append(button);
            var action = $(actionButton).attr("value");
            var goodName = good.name;
            $(button).click(function() {
                selectGood(action, goodName);
                if (pro) {
                    setTimeout(function() {
                        actionButton.click();
                    }, 100);
                }
            });
        }
    });
}

function addCodeButton() {
    var actionButtons = $("input[type='submit'][class='cmb'][value='Взять'], input[type='submit'][class='cmb'][value='Ok']");
    actionButtons.each(function(i, actionButton) {
        if ($(actionButton).nextAll("input[value='Код']").length === 0) {
            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("class", "cmb");
            button.setAttribute("style", style);
            button.setAttribute("value", "Код");
            $(actionButton).parent().append(button);
            $(button).click(function() {
                if (!$("#codeWindow").dialog("isOpen"))
                    $("#codeWindow").dialog("open");
            });
        }
    });
}
// var running = false;

var expressions = [];

if (localStorage.getItem("wc_loot_button_delay") === null) {
    localStorage.setItem("wc_loot_button_delay", 2000);
}

if (sessionStorage.getItem("wc_loot_button_i") === null) {
    sessionStorage.setItem("wc_loot_button_i", 1);
}

if (sessionStorage.getItem("wc_loot_button_code") === null) {
    sessionStorage.setItem("wc_loot_button_code", "");
}

function pushButton(button) {
    console.log("push", button);
    if (button == "Ok" || button == "Взять")
        $("input[type='submit'][value='" + button + "']").click();
    else
        $("input[value='" + button + "']").click();
}
function give() {
    console.log("give");
    $("#divi3").click();
}
function get() {
    console.log("get");
    $("#divi2").click();
}
function getFrom(unit) {
    $("button[class='but40']").each(function(i, button) {
        if (button.hasAttribute("tooltip") && button.getAttribute("tooltip").search(unit) != -1) {
            button.click();
        }
    });
}
function giveTo(unit) {
    console.log("giveTo", unit);
    $("select[size='1'][class='mtext'][name='z'] option").each(function(i, option) {
        if (option.innerHTML.search(unit) != -1) {
            option.parentNode.selectedIndex = i;
        }
    });
}
function select(unit) {
    console.log("select", unit);
    $("#diva1").click();
    $("#arm button[class='but136']").each(function(i, button) {
        if (button.innerHTML.search(unit) != -1) {
            button.click();
        }
    });
    $("#diva2").click();
    $("#arm button[class='but136']").each(function(i, button) {
        if (button.innerHTML.search(unit) != -1) {
            button.click();
        }
    });
}
function seat() {
    console.log("seat");
    $("button[class='cmb2']").click();
}
function execOper(expression) {
    switch (expression.length) {
        case 1:
            expression[0]();
            break;
        case 2:
            expression[0](expression[1]);
            break;
        case 3:
            expression[0](expression[1], expression[2]);
            break;
        default:
            //error
            break;
    }
}
function parseCode() {
    expressions = [];
    // var code = $("#codearea").val();
    var code = sessionStorage.getItem("wc_loot_button_code");
    var commands = code.split("\n");
    var i, k;
    for (i = 0; i < commands.length; i++) {
        var tokens = commands[i].split(/\s+/);
        if (tokens.length > 0) {
            switch (tokens[0]) {
                case "выбрать":
                    if (tokens.length == 2) {
                        expressions.push([select, tokens[1]]);
                    }
                    break;
                case "взять":
                    if (tokens.length >= 3) {
                        expressions.push([get]);
                        expressions.push([getFrom, tokens[tokens.length - 1]]);
                        for (k = 1; k < tokens.length - 1; k++)
                            expressions.push([selectGood, "Взять", tokens[k]]);
                        expressions.push([pushButton, "Взять"]);
                    }
                    break;
                case "передать":
                    if (tokens.length >= 3) {
                        expressions.push([give]);
                        expressions.push([giveTo, tokens[tokens.length - 1]]);
                        for (k = 1; k < tokens.length - 1; k++)
                            expressions.push([selectGood, "Ok", tokens[k]]);
                        expressions.push([pushButton, "Ok"]);
                    }
                    break;
                case "сит":
                    if (tokens.length == 1) {
                        expressions.push([seat]);
                    }
                    break;
                default:
                    $("#errorArea").val("Неизвестный оператор");
                    break;
            }
        }
    }
    console.log('expressions', expressions);
}
function runCode() {
    parseCode();
    if (true) {
        var i = parseInt(sessionStorage.getItem("wc_loot_button_i"), 10),
                ip = parseInt(sessionStorage.getItem("wc_loot_button_ip"), 10),
                delay = parseInt(localStorage.getItem("wc_loot_button_delay"), 10);
        console.log("runCode");
        console.log('i: ' + i);
        if (i > 0) {
            console.log('ip: ' + ip, 'expr.len: ' + expressions.length);
            if (ip < expressions.length) {
                console.log(i, ip);
                sessionStorage.setItem("wc_loot_button_ip", ip + 1);
                if (expressions[ip][0] === give ||
                        expressions[ip][0] === get ||
                        expressions[ip][0] === pushButton ||
                        expressions[ip][0] === selectGood ||
                        expressions[ip][0] === giveTo) {
                    execOper(expressions[ip]);
                    setTimeout(runCode, delay);
                    return;
                } else if (expressions[ip][0] === select ||
                        expressions[ip][0] === getFrom ||
                        expressions[ip][0] === seat) {
                    // those actions will cause rerendering of the page and data loading through "ifr"
                    execOper(expressions[ip]);
                    return;
                }
            }
            ip = 0;
            sessionStorage.setItem("wc_loot_button_ip", ip);
            i--;
            sessionStorage.setItem("wc_loot_button_i", i);
            $("#iterations").val(i);
        }
    }
    if (i === 0 && ip === 0) {
        running = false;
    }
    if (running) {
        runCode();
    }
}

// addEventListener("click", function(e) {
// if (e.target.parentNode.hasAttribute("name") && e.target.parentNode.getAttribute("name") === "z") {
// console.log(e.target);
// var map = $("#dmap > table").get(0).rows[1].cells[1].getElementsByTagName("table")[0];
// var rowInd = parseInt(map.rows.length/2);
// var row = map.rows[rowInd];
// var cellInd = parseInt(row.cells.length/2);
// var cell = row.cells[cellInd];
// for (var i = -1; i <= 1; i++)
// for (var j = -1; j <= 1; j++) {
// if (!(i === 0 && j === 0)) {
// var cell = map.rows[rowInd + i].cells[cellInd + j];
// console.log(cell);
// var img = cell.getElementsByTagName("img")[0];
// console.log(img.getAttribute("tooltip"));
// var heroName = e.target.innerHTML.match(/(Герой )?(.+)(\()?/);
// console.log(heroName);
// if (img.hasAttribute("tooltip") && img.getAttribute("tooltip").search() != -1) {
// console.log(3);
// $(map.rows[rowInd + i].cells[cellInd + j]).css("border", "solid blue");
// $(map.rows[rowInd + i].cells[cellInd + j]).css("border-width", "1px 1px");
// $(map.rows[rowInd + i].cells[cellInd + j]).css("height", "40");
// $(map.rows[rowInd + i].cells[cellInd + j]).css("width", "40");
// }
// }
// }
// }
// }, false);

function heroInventory() {
    return;
    var activeUnitName = $('#drig span:first-child').contents().get(0).data;
    var unitInv = $('#inv').html();
    sessionStorage.setItem('inv_' + $.trim(activeUnitName), unitInv);

    var heroButtons = $('button.but136');
    heroButtons.each(function(i, button) {
        var unitName = $(button).find('td[width=86]').contents().get(2).data;
        $(button).attr('tooltip', sessionStorage.getItem('inv_' + $.trim(unitName)));
    });
//        var t = $('#dmap table table').get(0);
//        var img = $(t.rows[parseInt(t.rows.length/2)].cells[parseInt(t.rows[0].cells.length/2)]).children('img').get(0);
//        $(img).attr('tooltip', $(img).attr('tooltip') + unitInv);
//        console.log(img);
}

function loot_button() {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "http://warchaosujs.gixx.ru/jquery-ui/css/sunny/jquery-ui-1.10.3.custom.css");
    document.head.appendChild(link);
    $("input[type='submit'][class='cmb'][value='Взять'], input[type='submit'][class='cmb'][value='Ok']").attr("style", style);
    createButton(all);
    createButton(artefacts);
    createButton(force);
    createButton(potions);
    createButton(potions1);
    createButton(resources);
    createButton(scrolls);

    var codeWindow = document.createElement("table");
    codeWindow.setAttribute("id", "codeWindow");

    codeWindow.innerHTML += "Итерации:";
    var input = document.createElement("input");
    input.setAttribute("id", "iterations");
    input.setAttribute("type", "text");
    input.setAttribute("style", "width: 30px;");
    codeWindow.appendChild(input);
    $("#iterations").keyup(function(e) {
        sessionStorage.setItem("wc_loot_button_i", e.target.value);
    });
    input.value = sessionStorage.getItem("wc_loot_button_i");

    codeWindow.innerHTML += " Задержка:";
    input = document.createElement("input");
    input.setAttribute("id", "delay");
    input.setAttribute("type", "text");
    input.setAttribute("style", "width: 40px;");
    codeWindow.appendChild(input);
    $("#delay").keyup(function(e) {
        localStorage.setItem("wc_loot_button_delay", e.target.value);
    });
    input.setAttribute('value', localStorage.getItem("wc_loot_button_delay"));

    codeWindow.appendChild(document.createElement("br"));
    var codeArea = document.createElement("textarea");
    codeArea.setAttribute("id", "codearea");
    codeArea.setAttribute("rows", "5");
    codeArea.setAttribute("cols", "40");
    // codeArea.value = "выбрать Альфа2\n" +
    // "передать Ресы Альфа10\n" +
    // "";
    codeArea.value = sessionStorage.getItem("wc_loot_button_code");
    $("#codearea").keyup(function(e) {
        sessionStorage.setItem("wc_loot_button_code", e.target.value);
    });
    codeWindow.appendChild(codeArea);
    codeWindow.appendChild(document.createElement("br"));

    var errorArea = document.createElement("textarea");
    codeWindow.appendChild(errorArea);
    codeWindow.appendChild(document.createElement("br"));

    var run = document.createElement("button");
    run.setAttribute("id", "run");
    run.innerHTML = "Запуск";
    codeWindow.appendChild(run);
    $(run).click(function() {
        parseCode();
        sessionStorage.setItem("wc_loot_button_ip", 0);
        running = true;
        runCode();
    });
    $(codeWindow).dialog({autoOpen: false, width: 300, title: "Код"});
    addCodeButton();
    heroInventory();
}