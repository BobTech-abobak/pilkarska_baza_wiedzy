/**
 * Created by Adrian on 2017-06-03.
 */
var Loader = {

    objectSelector: "#loader",

    show: function() {
        var loader = $(this.objectSelector);
        loader.css('top', $(window).scrollTop()).show();
        $(window).disablescroll();
    },

    hide: function() {
        var loader = $(this.objectSelector);
        loader.fadeOut('fast');
        $(window).disablescroll("undo");
    }
};