function marker() {
    addEventListener("click", function(e) {
        if (e.altKey && e.target == "[object HTMLImageElement]" && e.target.hasAttribute("sck"))
            eval(e.target.getAttribute("sck"));
        if (e.altKey || e.shiftKey || e.button == 2) {
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
    }, false);
}