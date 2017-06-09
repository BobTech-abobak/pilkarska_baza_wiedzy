/**
 * Created by adrian on 09.06.17.
 */
var AFDComparsion = {

    comparsions: Array(),

    addCompareObject: function(compareObject) {
        var index = this.comparsions.length;
        this.comparsions[index] = compareObject;
    },

    getComparsions: function() {
        return this.comparsions;
    }

};