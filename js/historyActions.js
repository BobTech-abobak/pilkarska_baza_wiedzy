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
        for (var i=0 ; i>index ; i++) {
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
    }
};
