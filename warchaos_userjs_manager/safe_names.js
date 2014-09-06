function safe_names() {
    if ($('.safe-name').length === 0 && window.g) {
        $("<style>.safe-name {position: relative; bottom: 5px; font-size: 10px; color: yellow; font-family: Arial;} </style>").appendTo("head");
        townId = "safe_" + window.g.mobjects[window.g.objcity + 5];
        safes = localStorage.getItem(townId);
        if (safes === null || safes === "") {
            safes = "";
            $("img[src='2618.gif']").each(function(i, safe) {
                safes += "Сейф" + i + ",";
            });
            localStorage.setItem(townId, safes);
        }
        var safesArray = safes.split(",");
        localStorage.setItem("safes", "");
        // dropdown menu give to
        var j = 0;
        $("select.mtext option").each(function(i, safe) {
            if ($(safe).html() === "Сейф") {
                $(safe).html(safesArray[j++]);
            }
        });
        // take from
        $("img[src='2618.gif']").each(function(i, safe) {
            var span = document.createElement('span');
            $(span).html(safesArray[i]);
            $(span).addClass('safe-name');
            $(safe).parent().parent().append(span);
            $(span).click(function() {
                var name = prompt("Введите название сейфа", $(this).html());
                if (name) {
                    $(this).html(name.substr(0, 8));
                    safesArray[i] = $(this).html();
                    localStorage.setItem(townId, safesArray.join());
                }
            });
        });
    }
}