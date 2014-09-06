function mandragora2() {
    var center = $("td[background]>img[src^='9']");
    if (center && center.length != 0) {
        //console.log(center);
        var i = window.top.cons.indexOf("Мандрагора");
        if (i != -1 && window.top.cons[i - 2] == 52) {
            //console.log(1);
        }
    }
}
function takeMandra() {
    mandra_taking = true;
    $('.but40[tooltip="Мандрагора"]').click();
    $('input[name="i1"]').val(13);
    setTimeout(function() {
        if ($('img[tooltip="Мандрагора"]').length) {
            $('img[tooltip="Мандрагора"]').nextAll('input[name="i1"]').val(13);
        }
        $('input[value="Взять"]').click();
    }, 1000);
}
var mandra_taking = false;
function mandragora() {
    if ($("#divi2").length && $('img[src^="90"][tooltip*="Болото"]').length === 1 && !h1win && !mandra_taking) {
        ShowCon();
        if ($('.but40[tooltip="Мандрагора"]').text() === "52") {
            help1 = "<b>Мандрагора</b>";
            help2 = "<img src='it/284.gif' width='40' height='30' align='left'>\n\
Вы зашли в болото с созревшей мандрагорой.\
<center>Хотите собрать её?<br>\
<button onclick='takeMandra();' class='cmb'>Собрать</button>\n\
</center>";
            ShowWin();
        } else {
            ShowInv();
        }

    }

}

//<div id="tipwin" style="border-bottom-color: rgb(0, 0, 0); border-bottom-width: 2px; border-bottom-style: solid; border-right-color: rgb(0, 0, 0); border-right-width: 2px; border-right-style: solid; position: absolute; left: 331.5px; top: 140px; width: 310px; visibility: visible;">
//  <table background="ctrl/bg_1.gif" style="width:100%;border:1px dashed #FAC802">
//    <tbody>
//      <tr>
//        <td style="border:7px solid #653809">
//          <table class="rw3" style="background:url('ctrl/bg_5.gif');width:290;">
//            <tbody>
//              <tr>
//                <td width="90%" style="color:#FFF200; 9D080D; letter-spacing: 2px; 8B3409">
//                  <b>Папоротник</b>
//                </td>
//                <td width="10%">
//                  [
//                  <span onclick="HideWin()" style="color:#FF912E; cursor:hand;cursor:pointer;">закрыть</span>
//                  ]
//                </td>
//              </tr>
//            </tbody>
//          </table>
//          <table class="rw3" style="width:290">
//            <tbody>
//              <tr>
//                <td>
//                  <img src="it/244.gif" width="40" height="30" align="left">
//                  Вы нашли папоротник.
//                  <br>
//                  <br>
//                  <center>
//                    Хотите сорвать?
//                    <br>
//                    (Требуется 1 ход)
//                    <br>
//                    <button onclick="cmComm(170,0,0,0)" class="cmb">Сорвать</button>
//                  </center>
//                </td>
//              </tr>
//            </tbody>
//          </table>
//        </td>
//      </tr>
//    </tbody>
//  </table>
//</div>