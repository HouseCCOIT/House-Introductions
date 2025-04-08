

$(document).ready(function () {

    $.ajax({
        url: "https://www.house.mn.gov/webservices/chambertest/chamber/message",
        type: "GET",
        dataType: "xml",
        //contentType: "text/xml; charset=\"utf-8\"",
        success: function (msg) {
            //alert($(msg).text());
            //console.log($(msg).text());
            $("#ChamberDisplay1").prop('innerHTML', $(msg).text());
            $("#ChamberDisplay2").prop('innerHTML', $(msg).text());
        },
        error: function (xhr, status, error) {
            //alert(JSON.stringify(xhr));
            //var err = eval("(" + xhr.responseText + ")");
            //alert(error.responseText);
            $("#ChamberDisplay1").text("Welcome to the Minnesota House of Representatives");
            $("#ChamberDisplay2").text("Welcome to the Minnesota House of Representatives");
        }
    });

});