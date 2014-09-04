function replace_force_size() {
    var tbl = [
        "Несколько", "1-4",
        "Немного", "5-8",
        "Группа", "9-14",
        "Отряд", "15-25",
        "Легион", "26-45",
        "Рать", ">45"
    ];
    var imgs = document.getElementsByTagName("IMG");
    var reg = /\(([А-Яа-я]+)\)/;	//extracts
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].hasAttribute("tooltip")) {
            var t = imgs[i].getAttribute("tooltip");
            var m = t.match(reg);
            if (m) {
                for (var j = 0; j < tbl.length; j += 2) {
                    if (m[1] == tbl[j]) {
                        t = t.replace(m[1], tbl[j + 1]);
                        imgs[i].setAttribute("tooltip", t);
                    }
                }
            }
        }
    }
}
