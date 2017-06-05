/**
 * Created by Adrian on 2017-06-05.
 */
var historyActions = {

    history: Array(),
    historyLimit: 10,

    addHistoryAction: function(historyObject) {
        var index = this.history.length;
        this.history[index] = historyObject;
        if (index == this.historyLimit) {
            this.removeLastHistoryAction();
        }
    },

    removeLastHistoryAction: function(){
        var index = this.history.length-1;
        for (var i=0 ; i>index ; i++) {
            this.history[i] = this.history[i+1];
        }
        this.history.shift();
    },

    getLastAction: function() {
        var index = this.history.length;
        return this.history[index-1];
    }
};
