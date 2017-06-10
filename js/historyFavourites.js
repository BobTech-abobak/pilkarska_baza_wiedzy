var historyFavourites = {

    favourites: Array(),

    addFavouritesObject: function(compareObject) {
        var index = 0;
        this.favourites = Array();
        $.each(this.getFavouritesAction(), function (i, item) {
            if (item == null) {
                historyFavourites.clearFavourites();
                return false;
            }
            if (compareObject.name != item.name) {
                historyFavourites.favourites[index] = item;
                index++;
            }
        });
        this.favourites[index] = compareObject;
        localStorage.setItem("favourites", JSON.stringify(this.favourites));
    },

    clearFavourites: function()
    {
        this.favourites = Array();
        localStorage.setItem("favourites", JSON.stringify(this.favourites));
    },

    getFavouritesAction: function() {
        if (localStorage.getItem("favourites") == null) {
            this.clearFavourites();
        }
        return JSON.parse(localStorage.getItem("favourites"));
    },

    removeFavourites: function(name) {
        historyFavourites.favourites = Array();
        var index = 0;
        $.each(this.getFavouritesAction(), function (i, item) {
            if (name != item.name) {
                historyFavourites.favourites[index] = item;
                index++;
            }
        });
        localStorage.setItem("favourites", JSON.stringify(historyFavourites.favourites));
    },


    showHistory: function() {
        var content = '<div class="container col-md-6 col-md-offset-3 stats_container">';
        if (this.getFavouritesAction().length == 0) {
            content += '<div class="row">';
            content += '<div class="col-xs-12">Brak ulubionych statystyk</div>';
            content += '</div>';
            content += '</div>';
            $("#favourites").empty().append(content).fadeIn();
            return false;
        }

        content += '<div class="row">';
        content += '<div class="col-xs-8">Ulubione statystyki</div>';
        content += '<div class="col-xs-4"></div>';
        content += '</div>'


        $.each(this.getFavouritesAction(), function (i, item) {
            if (item == null) {
                historyFavourites.clearFavourites();
                return false;
            }
            content += '<div class="row">';
            content += '<div class="col-xs-8">' + item.name + '</div>';
            content += '<div class="col-xs-4"><button type="button" data-name="' + item.name + '" class="removeFavourites btn btn-danger col-xs-10 col-xs-offset-1"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span>&nbsp;Usuń z ulubionych</button></div>';
            content += '<input type="hidden" value="' + item.url + '" data-type="'+item.type+'">';
            content += '</div>'
        });
        content += '</div>';
        $("#favourites").empty().append(content).fadeIn();

        $("#favourites .row:nth-child(n+2)").on("click", function() {
            $("#clearHistory").hide();
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

        $(".removeFavourites").on("click", function(){
            historyFavourites.removeFavourites($(this).data("name"));
            $(this).parent('div').parent('div').find('div').hide();
        })
    }
};
