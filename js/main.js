/**
 * Created by Adrian on 2017-06-02.
 */
var historyActions = historyActions;
$(document).ready(function () {
    $("a[href=\"#stats\"]").on("click", function () {
        historyActions.addHistoryAction(
            new historyObject(
                AFD.baseStatsUrl, Date.now()
            )
        );
        AFD.getStatistics('stats', AFD.baseStatsUrl);
    });
});