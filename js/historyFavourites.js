var historyActions = {

    favourites: Array(),

    addFavouritesAction: function(historyObject) {
        var index = this.history.length;
    },

    removeFavouritesAction: function(index){
        var index = this.history.length-1;
        for (var i=0 ; i>index ; i++) {
            if (i == index)
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
