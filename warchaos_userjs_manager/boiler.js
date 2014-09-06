function boiler() {
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
    var ss = 0;
    function s(e) {
        var brew = parseInt(sessionStorage.getItem('brew'));
        console.log(e);
        if (window.frames["ifr"]) {
            console.log('fun start, ss', ss, 'brew', brew);
            if (!ss) {
                ss++;
            } else {
//                    return;
            }
            if (brew === null) {
                brew = 1;
            }
            if (brew === 4 && $("#inv td[valign='middle']").length === 1) {
                brew = 5;
                sessionStorage.setItem('brew', 5);
                ShowInv2();
                $('.cmb2').click();
                $('input[name="i1"]').click();
                ss = 0;
                try {
                    $("input[value='Ok']").click();
                } catch (e) {
                    console.log(e)
                } finally {
                    console.log('fin4');
                }
            }
            if (brew === 5 && $("#inv td[valign='middle']").length === 0 && parseInt($("font[color='#800000']").html()) > 0) {
                console.log(5);
                ss = 0;
                brew = 1;
                sessionStorage.setItem('brew', 1);
                s('recursive');
                return;
            }
            console.log(brew, $("#inv td[valign='middle']").length, parseInt($("font[color='#800000']").html()));
            if (brew === 5 && $("#inv td[valign='middle']").length === 0 && parseInt($("font[color='#800000']").html()) === 0) {
                console.log('brew5', brew);
                $('img[src="9162.gif"]').parent().parent().parent().nextAll('td').find('img[src="162.gif"]').parent().parent().first().click();
                ss = 0;
                return;
            }
            if (brew === 1 && $("#inv td[valign='middle']").length < 4 && parseInt($("font[color='#800000']").html()) > 0) {
                console.log('brew1', brew);
                $('button').each(function(i, el) {
                    if (el.innerHTML === "Варить") {
                        if (brew === 1) {
                            ShowCon();
                            var b = $("#inv .but40").get(0);
                            sessionStorage.setItem('brew', 2);
                            brew = 2;
                            ss = 0;
                            try {
                                $(b).click();
                            } catch (e) {
                                console.log(e)
                            } finally {
                                console.log('fin1');
                            }
                        }
                    }
                });
            } else if (brew === 2) {
                console.log('brew2', brew);
                setTimeout(function() {
                    var res = [204, 224, 234, 304];
                    for (var i = 0; i < res.length; i++) {
                        var img = $("img[src='it/" + res[i] + ".gif']");
                        if (img.length) {
                            img.nextAll("input").val(1);
                        }
                    }
                    ss = 0;
                    sessionStorage.setItem('brew', 3);
                    brew = 3;
                    setTimeout(function() {
                        s('run');
                    }, 2000);
                    $("input[value='Взять']").click();
                }, 2000);
            } else if (brew === 3) {
                console.log('brew3', brew);
                $('button').each(function(i, el) {
                    if (el.innerHTML === "Варить") {
                        brew = 4;
                        sessionStorage.setItem('brew', 4);
                        ss = 0;
                        console.log('before click3');
                        $(el).click();
                        console.log('after click3');
                    }
                });
            }
        }
    }
    if (window.frames['ifr']) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                s('win load');
            }, 1000);
        }, false);
        addEventListener('click', function() {
            setTimeout(function() {
                s('click');
            }, 1000);
        }, false);
        var wc_ifr = document.getElementById("ifr");
        if (wc_ifr)
            wc_ifr.addEventListener("load", function() {
                setTimeout(function() {
                    s('load');
                }, 1000);
            }, false);
    }
}