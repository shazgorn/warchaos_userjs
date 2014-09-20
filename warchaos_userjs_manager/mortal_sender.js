function ajaxRequest(url, method, param) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(method, url, true);
    xmlHttpRequest.setRequestHeader('Content-Type', 'text/plain');
    xmlHttpRequest.send(param);
}
addEventListener('message', function (e) {
    if (e.origin === 'http://warchaos.ru') {
//        console.log('incoming ' + ' from ' + e.origin + ' ' + e.data);
        ajaxRequest("http://dragonmap.ru/cgi-bin/mapper_mortal", 'POST', e.data);
    }
}, false);
