/**
 * Created by Adrian on 2017-06-02.
 */
$(document).ready(function () {
    $("a[href=\"#stats\"]").on("click", function () {
        AFD.getStatistics('stats', '');
    });
    $("#stats table").on('click', function(){
        var type = $(this).find('table').attr('id');
        AFD.getStatistics(type);
    });
});