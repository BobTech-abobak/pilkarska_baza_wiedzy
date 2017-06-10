/**
 * Created by adrian on 09.06.17.
 */
var AFDComparison = {

    comparisons: Array(),

    addCompareObject: function(compareObject) {
        var index = this.getComparisonsAction().length;
        var found = false;
        $.each(this.getComparisonsAction(), function (i, item) {
            if (compareObject.name == item.name) {
                found = true;
            }
        });
        if (!found) {
            this.comparisons[index] = compareObject;
            localStorage.setItem("comparisons", JSON.stringify(this.comparisons));
        }
    },

    clearComparisons: function()
    {
        this.comparisons = Array();
        localStorage.setItem("comparisons", JSON.stringify(this.comparisons));
    },

    getComparisonsAction: function() {
        return JSON.parse(localStorage.getItem("comparisons"));
    },

    showComparisons: function() {
        var content = '<div class="container col-md-6 col-md-offset-3 stats_container">';
        if (this.getComparisonsAction().length == 0) {
            content += '<div class="row">';
            content += '<div class="col-xs-12">Brak danych do porównania</div>';
            content += '</div>';
            $("#comparison").empty().append(content).fadeIn();
            return false;
        }

        content += '<div class="row">';
        content += '<div class="col-xs-12">Wybierz statystyki do porównania</div>';
        content += '</div>';

        content += '<div class="row">';
        content += '<div class="col-xs-12 col-sm-6">';
        content += '<select class="form-control" id="compareStat1">';
        $.each(this.getComparisonsAction(), function (i, item) {
            content += '<option data-url="' + item.url + '" data-type="' + item.type + '">' + item.name + '</option>';
        });
        content += '</select>';
        content += '</div>';
        content += '<div class="col-xs-12 col-sm-6">';
        content += '<select class="form-control" id="compareStat2">';
        $.each(this.getComparisonsAction(), function (i, item) {
            content += '<option data-url="' + item.url + '" data-type="' + item.type + '">' + item.name + '</option>';
        });
        content += '</select>';
        content += '</div>';
        content += '</div>';

        content += '<div class="row text-center">';
        content += '<div class="col-xs-4"><button id="compareClear" type="button" class="btn btn-danger btn-sm">WYCZYŚC</button></div>';
        content += '<div class="col-xs-8"><button id="compare" type="button" class="btn btn-warning">PORÓWNAJ</button></div>';
        content += '</div>';

        content += '</div>';

        $("#comparison").empty().append(content).fadeIn();

        $("#compareClear").on("click", function() {
            AFDComparison.clearComparisons();
            var content = '<div class="container col-md-6 col-md-offset-3 stats_container">';
            content += '<div class="row">';
            content += '<div class="col-xs-12">Brak danych do porównania</div>';
            content += '</div>';
            $("#comparison").empty().append(content).fadeIn();
        });

        $("#compare").on("click", function() {
            $("#comparison .alert").remove();
            $("#comparison .stats_container:eq(1)").remove();
            if ($("#compareStat1 option:selected").data("type") != $("#compareStat2 option:selected").data("type")) {
                var content = '<div class="alert alert-warning" role="alert">Nie można porównać statystyk różnych typów</div>';
                $("#comparison .stats_container").append(content);
            } else if ($("#compareStat1 option:selected").text() == $("#compareStat2 option:selected").text()) {
                var content = '<div class="alert alert-warning" role="alert">Nie można porównać tych samych statystyk</div>';
                $("#comparison .stats_container").append(content);
            } else {
                if ($("#compareStat1 option:selected").data("type") == 'competitions') {
                    var content = '<div class="container col-md-6 col-md-offset-3 stats_container" id="compare_div">';
                    content += '<div class="row" id="compareHeader">';
                    content += '<div class="col-xs-4">Parametr</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareMatches">';
                    content += '<div class="col-xs-4">Ilość kolejek</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareChampion">';
                    content += '<div class="col-xs-4">Mistrz</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareWorst">';
                    content += '<div class="col-xs-4">Najgorszy</div>';
                    content += '</div>';
                    content += '<div class="row" id="comparePoints">';
                    content += '<div class="col-xs-4">Najwięcej punktów</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareWins">';
                    content += '<div class="col-xs-4">Najwięcej zwycięstw</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareDraws">';
                    content += '<div class="col-xs-4">Najwięcej remisów</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareLosses">';
                    content += '<div class="col-xs-4">Najwięcej porażek</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareGoals">';
                    content += '<div class="col-xs-4">Najwięcej bramek</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareGoalsLeast">';
                    content += '<div class="col-xs-4">Najmniej bramek</div>';
                    content += '</div>';
                    content += '</div>';
                    $("#compare_div").remove();
                    $("#comparison").append(content);
                    AFDComparison.getComparsionData(
                        $("#compareStat1 option:selected").data("url"),
                        AFDComparison.parseCompetition,
                        $("#compareStat1").val()
                    );
                    AFDComparison.getComparsionData(
                        $("#compareStat2 option:selected").data("url"),
                        AFDComparison.parseCompetition,
                        $("#compareStat2").val()
                    );
                } else if ($("#compareStat1 option:selected").data("type") == 'players') {
                    var content = '<div class="container col-md-6 col-md-offset-3 stats_container" id="compare_div">';
                    content += '<div class="row" id="compareHeader">';
                    content += '<div class="col-xs-4">Parametr</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareCount">';
                    content += '<div class="col-xs-4">Ilość zawodników</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareOldest">';
                    content += '<div class="col-xs-4">Najstarszy zawodnik</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareYoungest">';
                    content += '<div class="col-xs-4">Najmłodszy zawodnik</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareMarketValue">';
                    content += '<div class="col-xs-4">Najdroższy zawodnik</div>';
                    content += '</div>';
                    content += '<div class="row" id="compareNationality">';
                    content += '<div class="col-xs-4">Najliczniejsza narodowość</div>';
                    content += '</div>';
                    content += '</div>';
                    $("#compare_div").remove();
                    $("#comparison").append(content);
                    AFDComparison.getComparsionData(
                        $("#compareStat1 option:selected").data("url"),
                        AFDComparison.parseTeam,
                        $("#compareStat1").val()
                    );
                    AFDComparison.getComparsionData(
                        $("#compareStat2 option:selected").data("url"),
                        AFDComparison.parseTeam,
                        $("#compareStat2").val()
                    );
                }
            }
        });
    },

    getComparsionData: function(url, callback, title) {
        $.ajax({
            url: url,
            type: 'GET',
            headers: {"X-Auth-Token": AFD.accessToken},
            dataType: 'json',
            success: function(data) {
                callback(data, title);
            },
            error: function() {
                console.log('Failed!');
            },
        })
    },

    parseCompetition: function(data, title) {
        var details = Array();
        details.champion = data.standing[0].teamName;
        details.worst = data.standing[data.standing.length-1].teamName;
        details.mostPoints = 0;
        details.mostWins = 0;
        details.mostDraws = 0;
        details.mostLosses = 0;
        details.mostGoals = 0;
        details.leastGoals = 0;
        $.each(data.standing, function (i, item) {
            if (item.points > data.standing[details.mostPoints].points) {
                details.mostPoints = i;
            }
            if (item.wins > data.standing[details.mostWins].wins) {
                details.mostWins = i;
            }
            if (item.draws > data.standing[details.mostDraws].draws) {
                details.mostDraws = i;
            }
            if (item.losses > data.standing[details.mostLosses].losses) {
                details.mostLosses = i;
            }
            if (item.goals > data.standing[details.mostGoals].goals) {
                details.mostGoals = i;
            }
            if (item.goals < data.standing[details.mostGoals].goals) {
                details.leastGoals = i;
            }
        });
        $("#compareHeader").append('<div class="col-xs-4">' + data.leagueCaption + '</div>');
        $("#compareMatches").append('<div class="col-xs-4">' + data.matchday + '</div>');
        $("#compareChampion").append('<div class="col-xs-4">' + details.champion + '</div>');
        $("#compareWorst").append('<div class="col-xs-4">' + details.worst + '</div>');
        $("#comparePoints").append('<div class="col-xs-4">' + data.standing[details.mostPoints].points + ' (' + data.standing[details.mostPoints].teamName + ')</div>');
        $("#compareWins").append('<div class="col-xs-4">' + data.standing[details.mostWins].wins + ' (' + data.standing[details.mostWins].teamName + ')</div>');
        $("#compareDraws").append('<div class="col-xs-4">' + data.standing[details.mostDraws].draws + ' (' + data.standing[details.mostDraws].teamName + ')</div>');
        $("#compareLosses").append('<div class="col-xs-4">' + data.standing[details.mostLosses].losses + ' (' + data.standing[details.mostLosses].teamName + ')</div>');
        $("#compareGoals").append('<div class="col-xs-4">' + data.standing[details.mostGoals].goals + ' (' + data.standing[details.mostGoals].teamName + ')</div>');
        $("#compareGoalsLeast").append('<div class="col-xs-4">' + data.standing[details.leastGoals].goals + ' (' + data.standing[details.leastGoals].teamName + ')</div>');
    },

    parseTeam: function(data, title) {
        var details = Array();
        details.count = 0;
        details.oldest = 0;
        details.youngest = 0;
        details.marketvalue = 0;
        details.nationality = 0;
        details.nationality_land = '';
        if (data.players.length > 0) {
            details.count = data.players.length;
            var narodowosci = Array();
            $.each(data.players, function (i, item) {
                var urodzony = new Date(item.dateOfBirth);
                var najstarszy = new Date(data.players[details.oldest].dateOfBirth);
                if (details.oldest==0 || najstarszy>urodzony) {
                    details.oldest = i;
                }
                var najmlodszy = new Date(data.players[details.youngest].dateOfBirth);
                if (details.youngest==0 || najmlodszy<urodzony) {
                    details.youngest = i;
                }
                if (details.marketvalue==0 || (item.marketvalue!=null && item.marketvalue>data.players[details.marketvalue].marketvalue)) {
                    details.marketvalue = i;
                }
                if( item.nationality in narodowosci ) {
                    narodowosci[item.nationality] += 1;
                } else {
                    narodowosci[item.nationality] = 1;
                }
            });
            for (nation in narodowosci) {
                if (narodowosci[nation]>details.nationality) {
                    details.nationality = narodowosci[nation];
                    details.nationality_land = nation;
                }
            }
        };
        $("#compareHeader").append('<div class="col-xs-4">' + title + '</div>');
        $("#compareCount").append('<div class="col-xs-4">' + details.count + '</div>');
        if (details.oldest == 0) {
            $("#compareOldest").append('<div class="col-xs-4">Brak danych</div>');
        } else {
            var urodzony = new Date(data.players[details.oldest].dateOfBirth);
            var today = new Date();
            var age = today.getFullYear()-urodzony.getFullYear();
            $("#compareOldest").append('<div class="col-xs-4">' + data.players[details.oldest].name + ' (' + age + ')</div>');
        }
        if (details.youngest == 0) {
            $("#compareYoungest").append('<div class="col-xs-4">Brak danych</div>');
        } else {
            var urodzony = new Date(data.players[details.youngest].dateOfBirth);
            var today = new Date();
            var age = today.getFullYear()-urodzony.getFullYear();
            $("#compareYoungest").append('<div class="col-xs-4">' + data.players[details.youngest].name + ' (' + age + ')</div>');
        }
        if (details.marketvalue == 0 || data.players[details.marketvalue].marketvalue == null) {
            $("#compareMarketValue").append('<div class="col-xs-4">Brak danych</div>');
        } else {
            $("#compareMarketValue").append('<div class="col-xs-4">' + data.players[details.marketvalue].name + ' (' + data.players[details.marketvalue].marketvalue + ')</div>');
        }
        $("#compareNationality").append('<div class="col-xs-4">' + details.nationality_land + ' (' + details.nationality + ')</div>');
    }

};