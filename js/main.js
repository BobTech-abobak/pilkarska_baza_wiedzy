/**
 * Created by Adrian on 2017-06-02.
 */
var historyActions = historyActions;
$(document).ready(function () {
    $("a[href=\"#statystyki\"]").on("click", function () {
        historyActions.addHistoryAction(
            new historyObject(
                AFD.baseStatsUrl, Date.now(), 'Lista rozgrywek'
            )
        );
        AFD.getStatistics('stats', AFD.baseStatsUrl);
    });

    $(".navbar-brand").on("click", function () {
        $("#stats").fadeOut(function(){
            $("#main").fadeIn();
        });
    });


    $("a[href=\"#history\"]").on("click", function () {
        console.log('Akcja po wejściu w HISTORIĘ');
    });

    $("a[href=\"#favourites\"]").on("click", function () {
        console.log('Akcja po wejściu w ULUBIONE');
    });
});