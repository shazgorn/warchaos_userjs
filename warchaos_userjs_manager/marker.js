function marker() {
    function patchMarkerWindow() {
        setTimeout(function() {
            var input = document.getElementById("miniinfoy");
            if (input !== null) {
                if (input.childNodes[0].getAttribute("value") === "0") {
                    input.selectedIndex = 6;
                    document.getElementById('sx0').childNodes[0].setAttribute('value', '25');
                }
            }
        }, 1000);
    }
    window.addEventListener("click", function(e) {
        if (e.altKey && e.target == "[object HTMLImageElement]" && e.target.hasAttribute("sck"))
            eval(e.target.getAttribute("sck"));
        if (e.altKey || e.shiftKey || e.button === 2) {
            patchMarkerWindow();
        }
    }, false);
    var oldVersion = onrightclick;
    document.oncontextmenu = onrightclick = function() {
        var result = oldVersion.apply(this, arguments);
        setTimeout(patchMarkerWindow, 1000);
        return result;
    };
}

//document.oncontextmenu=onrightclick;
//function onrightclick(evt)
//{
//evt=evt?evt:(window.event?window.event:null);
//if(evt)
//{
//cob=window.event?window.event.srcElement:evt.target;
//if(cob&&rc){
//if(cob.getAttribute("rc")){evt.cancelBubble=true;eval(u.getAttribute("rc"));return false;}
//else if(cob.getAttribute("sck")){rclk=1;evt.cancelBubble=true;eval(u.getAttribute("sck"));return false;}
//}}
//return true;
//}