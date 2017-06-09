/**
 * Created by Adrian on 2017-06-02.
 */
var historyActions = historyActions;
$(document).ready(function () {
    $("a[href=\"#statystyki\"]").on("click", function () {
        $("#clearHistory").hide();
        $("#actions").show();
        $("#addFavourites").show();
        historyActions.addHistoryAction(
            new historyObject(
                AFD.baseStatsUrl, Date.now(), 'Lista rozgrywek', 'stats'
            )
        );
        AFD.getStatistics('stats');
    });

    $(".navbar-brand").on("click", function () {
        $("#stats, #actions, #history").hide();
        $("#main").show();
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
        $("#stats, #actions, #main").hide();
        historyActions.showHistory();
    });

    $("a[href=\"#ulubione\"]").on("click", function () {
        alert("Tutaj jest akcja wyświetlająca ulubione")
    });
});