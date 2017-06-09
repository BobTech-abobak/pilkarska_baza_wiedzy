/**
 * Created by Adrian on 2017-06-05.
 */
var historyActions = {

    history: Array(),
    historyLimit: 20,
    backStep: 1,

    addHistoryAction: function(historyObject) {
        var index = this.history.length;
        this.history[index] = historyObject;
        if (index == this.historyLimit) {
            this.removeLastHistoryAction();
        }
        this.backStep = index;
    },

    removeLastHistoryAction: function(){
        var index = this.history.length-1;
        for (var i=0 ; i<index ; i++) {
            this.history[i] = this.history[i+1];
        }
        this.history.shift();
    },

    getLastAction: function() {
        var index = this.history.length;
        return this.history[index-1];
    },

    getPreLastAction: function() {
        return this.history[this.backStep-1];
    },

    getBackAction: function() {
        var backStep = this.backStep;
        this.addHistoryAction(
            this.getPreLastAction()
        );
        this.backStep = backStep-1;
        return this.history[this.backStep];
    },

    showHistory: function() {
        $("#actions button").hide();
        $("#actions").show();

        var content = '<div class="container col-md-6 col-md-offset-3 stats_container">';
        if (this.history.length == 0) {
            content += '<div class="row">';
            content += '<div class="col-xs-12">Brak danych w historii</div>';
            content += '</div>'
            $("#history").empty().append(content).fadeIn();
            return false;
        }

        $("#clearHistory").show();

        content += '<div class="row">';
        content += '<div class="col-xs-8">Przeglądana statystyka</div>';
        content += '<div class="col-xs-4">Data</div>';
        content += '</div>'


        $.each(this.history, function (i, item) {
            var accessDate = new Date(item.accessDate);
            content += '<div class="row">';
            content += '<div class="col-xs-7">' + item.name + '</div>';
            content += '<div class="col-xs-5">' + accessDate.toUTCString() + '</div>';
            content += '<input type="hidden" value="' + item.url + '" data-type="'+item.type+'">';
            content += '</div>'
        });

        $("#history").empty().append(content).fadeIn();

        $("#history .row:nth-child(n+2)").on("click", function() {
            historyActions.addHistoryAction(
                new historyObject(
                    $(this).find("input").val(),
                    Date.now(),
                    $(this).find("div:eq(0)").html(),
                    $(this).find("input").data("type")
                )
            );
            AFD.getStatistics($(this).find("input").data("type"));
        });

        $("#clearHistory").on("click", function(){
            historyActions.history = Array();
            var content = '<div class="container col-md-6 col-md-offset-3 stats_container">';
            content += '<div class="row">';
            content += '<div class="col-xs-12">Brak danych w historii</div>';
            content += '</div>'
            $("#history").empty().append(content).fadeIn();
            $(this).hide()
        })
    }
};
