function ajaxRequest(url, method, param, onSuccess, onFailure, args) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(method, url, true);
    xmlHttpRequest.setRequestHeader('Content-Type', 'text/plain');
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
            onSuccess(xmlHttpRequest, args);
        }
        else if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status != 200)
            onFailure(xmlHttpRequest);
    };
    xmlHttpRequest.send(param);
}

addEventListener('message', function (e) {
//    console.log(2);
    if (e.origin === 'http://warchaos.ru') {
        console.log('incoming ' + ' from ' + e.origin + ' ' + e.data);
        var mapperURL = "http://dragonmap.ru/cgi-bin/mapper_mortal";
        ajaxRequest(mapperURL, 'POST', e.data, function () {
        }, function () {
        });
    }
}, false);

//console.log(1);