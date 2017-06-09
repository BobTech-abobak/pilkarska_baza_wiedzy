/**
 * Created by Adrian on 2017-06-02.
 */
var historyActions = historyActions;
$(document).ready(function () {
    $("a[href=\"#statystyki\"]").on("click", function () {
        historyActions.addHistoryAction(
            new historyObject(
                AFD.baseStatsUrl, Date.now(), 'Lista rozgrywek', 'stats'
            )
        );
        AFD.getStatistics('stats', AFD.baseStatsUrl);
    });

    $(".navbar-brand").on("click", function () {
        $("#stats, #actions").fadeOut(function(){
            $("#main").fadeIn();
        });
    });

    $("#back").on("click", function () {
        if (historyActions.backStep > 0) {
            AFD.getStatistics(
                historyActions.getBackAction().type
            );
        }
    });

    $("#addCompare").on("click", function(){
        AFDComparsion.addCompareObject(
            new compareObject(
                historyActions.getLastAction().url,
                historyActions.getLastAction().type,
                historyActions.getLastAction().name
            )
        );
    });

    $("a[href=\"#porownywarka\"]").on("click", function () {
        console.log(AFDComparsion.getComparsions());
        //AFDComparsion.getComparsion;
    });

    $("a[href=\"#historia\"]").on("click", function () {
        alert("Tutaj jest akcja wyświetlająca historię")
    });

    $("a[href=\"#ulubione\"]").on("click", function () {
        alert("Tutaj jest akcja wyświetlająca ulubione")
    });
});