function boiler_init() {
    boiler_running = false;
    if ($('#brew-button').length === 0) {
        var select = document.createElement("select");
        var types = ["Альфа", "Бета", "Альфа с жемом", "Бета с жемом"];
        for (var i = 0; i < types.length; i++) {
            option = document.createElement("option");
            option.innerHTML = types[i];
            option.value = i;
            var type = localStorage.getItem("boiler_type");
            if (type === null) {
                localStorage.setItem("boiler_type", type = 0);
            }
            $(select).append(option);
            select.selectedIndex = type;
        }
        $(select).attr("id", "brew-select-type");
        $(select).insertAfter('#dmap');
        $(select).change(function(e) {
            localStorage.setItem("boiler_type", e.target.selectedIndex);
        });
        $(select).css("display", "none");

        var b = document.createElement('button');
        b.innerHTML = "start";
        b.id = 'brew-button';
        $(b).css("display", "none");
        $(b).click(function() {
            boiler_running = false;
            sessionStorage.setItem('brew', 1);
        });
        $(b).insertAfter('#dmap');
    }
}
// 0 - alpha, 1 - beta, 2 - alpha with pearl, 3 - beta with pearl
function getIngredients(type) {
    if (type === null) {
        type = 0;
    }
    var num;
    switch (type) {
        case 0:
        case 3:
            num = 4;
            break;
        case 1:
            num = 5;
            break;
        case 2:
            num = 3;
            break;
    }
    // альфа золото ме кам пап мандра кровь
    var alpha_ingr = [204, 224, 234, 244, 284, 254];
    // бета 2 пап, 2 кровь, 1щуп, 1кож, 2манд, 1пыль, 1 дом
    var beta_ingr = [224, 254, 264, 274, 284, 404, 474];
    var ingrs;
    if (type % 2 === 0) {
        ingrs = alpha_ingr;
    } else {
        ingrs = beta_ingr;
    }

    var i = 0, res = [];
    while (i < num) {
        while ($.inArray(id = ingrs[Math.floor(Math.random() * 1000) % ingrs.length], $.map(res, function(el) {
            return el.id;
        })) >= 0) {

        }
        var count;
        if ((type % 2 === 1) && $.inArray(id, [224, 254, 284])) {
            count = 2;
        } else {
            count = 1;
        }
        res.push({id: id, count: count});
        i++;
    }
    if (type >= 2) {
        res.push({id: 304, count: 1});
    }
    return res;
}

function boiler() {
    if ($('img[src="9162.gif"]').length > 0) {
        $('#brew-button, #brew-select-type').show();
    } else {
        return;
    }
    if (boiler_running) {
        return;
    } else {
        boiler_running = true;
    }
    var brew = parseInt(sessionStorage.getItem('brew'));
    if (brew === null) {
        brew = 1;
    }
    if (brew === 4 && $("#inv td[valign='middle']").length === 1) {
        sessionStorage.setItem('brew', brew = 5);
        ShowInv2();
        $('.cmb2').click();
        $('input[name="i1"]').click();
        $('select[name="z"] option').each(function(i, el) {
            if (el.innerHTML.substr(0, 2) === "г.") {
                el.parentNode.selectedIndex = i;
            }
        });
        boiler_running = false;
        try {
            $("input[value='Ok']").click();
        } catch (e) {
            console.log(e);
        } finally {
            console.log('fin4');
        }
    }
    if (brew === 5 && $("#inv td[valign='middle']").length === 0 && parseInt($("font[color='#800000']").html()) > 0) {
        console.log(5);
        boiler_running = false;
        sessionStorage.setItem('brew', brew = 1);
        boiler('recursive');
        return;
    }

//    console.log(brew, $("#inv td[valign='middle']").length, parseInt($("font[color='#800000']").html()));
    if (brew === 5 && $("#inv td[valign='middle']").length === 0 && parseInt($("font[color='#800000']").html()) === 0) {
//        console.log('brew5', brew);
        // find next boiler
        $('img[src="9162.gif"]').parent().parent().parent().nextAll('td').find('img[src="162.gif"]').parent().parent().first().click();
        boiler_running = false;
        return;
    }
    if (brew === 1 && $("#inv td[valign='middle']").length < 4 && parseInt($("font[color='#800000']").html()) > 0) {
        console.log('brew1', brew);
        $('button').each(function(i, el) {
            if (el.innerHTML === "Варить") {
                if (brew === 1) {
                    ShowCon();
                    sessionStorage.setItem('brew', brew = 2);
                    boiler_running = false;
                    try {
                        $("#inv .but40").each(function(i, el) {
                            if ($(el).attr('tooltip').substr(0, 2) === "г.") {
                                $(el).click();
                            }
                        });
                    } catch (e) {
                        console.log(e)
                    } finally {
                        console.log('fin1');
                    }
                    setTimeout(boiler, 1000);
                }
            }
        });
    } else if (brew === 2) {
        console.log('brew2', brew);
        setTimeout(function() {
            var res = getIngredients(parseInt(localStorage.getItem("boiler_type")));
            console.log(res);
            $(res).each(function(i, el) {
                var img = $("img[src='it/" + el.id + ".gif']");
                console.log(img);
                if (img.length) {
                    img.nextAll("input").val(el.count);
                }
            });
            boiler_running = false;
            sessionStorage.setItem('brew', brew = 3);
            setTimeout(function() {
                boiler('run');
            }, 2000);
            $("input[value='Взять']").click();
        }, 2000);
    } else if (brew === 3) {
        console.log('brew3', brew);
        $('button').each(function(i, el) {
            if (el.innerHTML === "Варить") {
                sessionStorage.setItem('brew', brew = 4);
                boiler_running = false;
                console.log('before click3');
                $(el).click();
                console.log('after click3');
            }
        });
    }
}