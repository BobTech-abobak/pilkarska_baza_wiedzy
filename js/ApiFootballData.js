/**
 * Created by Adrian on 2017-06-02.
 */
var AFD = {

    accessToken: "4de4f63bfd60499bb7e6aa6c98c4e3bb",

    baseStatsUrl: "http://api.football-data.org/v1/competitions",

    getStatistics: function(name) {
        switch (name) {
            case 'stats':
                this.ajaxRequest('competitionsInfo', this.showCompetitionList);
                break;
            case 'competitionsInfo':
                this.ajaxRequest('competitions', this.showCompetitionInfo);
                break;
            case 'competitions':
                this.ajaxRequest('leagueTable', this.showCompetitionStanding);
                break;
            case 'fixtures':
                this.ajaxRequest('matches', this.showCompetitionFixtures);
                break;
            case 'teams':
                this.ajaxRequest('teams', this.showCompetitionTeams);
                break;
            case 'team':
                this.ajaxRequest('team', this.showTeam);
                break;
            case 'players':
                this.ajaxRequest('players', this.showSquad);
                break;
            default:
                $("#main").show();
                $("#loader").hide();
                break;
        }
    },

    ajaxRequest: function(name, callback) {
        $("#loader ~ div").hide();
        $("#loader").show();
        $.ajax({
            url: historyActions.getLastAction().url,
            type: 'GET',
            headers: {"X-Auth-Token": this.accessToken},
            dataType: 'json',
            success: function(data) {
                callback(name, data);
                $("#loader").hide();
            },
            error: function() {
                console.log('Failed!');
            },
        })
    },

    showCompetitionList: function(name, data) {
        var dataColumns = {
            caption: 'Nazwa rozgrywek',
            numberOfTeams: 'Liczba drużyn',
            lastUpdated: 'Ostatnia aktualizacja'
        };
        var content = '<div id="'+name+'" class="container col-md-8 col-md-offset-2 stats_container">';
        content += '<div class="row">';
        content += '<div class="col-sm-6">Nazwa rozgrywek</div>';
        content += '<div class="col-sm-3 hidden-xs">Liczba drużyn</div>';
        content += '<div class="col-sm-3 hidden-xs">Ostatnia aktualizacja</div>';
        content += '</div>';
        $.each(data, function (i, item) {
            content += '<div class="row">';
            content += '<div class="col-sm-6"><span class="glyphicon glyphicon-th-list hidden-xs" aria-hidden="true"></span> '+item.caption+'</div>';
            content += '<div class="col-sm-3 hidden-xs">'+item.numberOfTeams+'</div>';
            content += '<div class="col-sm-3 hidden-xs">'+ item.lastUpdated.substr(0, 10)+'</div>';
            content += '<input type="hidden" value="' + item['_links']['self']['href'] + '" data-name="'+item.caption+'">';
            content += '</div>';
        });
        content += '</div>';

        $("#stats").empty().append(content).show();

        $("#competitionsInfo .row:nth-child(n+2)").on('click', function(){
            historyActions.addHistoryAction(
                new historyObject(
                    $(this).find('input').val(),
                    Date.now(),
                    $(this).find('input').data('name')
                )
            );
            AFD.getStatistics(name);
        });
    },

    showCompetitionInfo: function(name, data) {
        var content = '<div class="container col-md-4 col-md-offset-4 stats_container">';
        content += '<div class="row">';
        content += '<div><h3>' + data.caption + '</h3></div>';
        content += '</div>';

        if (data.currentMatchday == data.numberOfMatchdays) {
            content += '<div class="row"><div id="competitions" data-url="' + data._links.leagueTable.href + '" data-name="'+ data.caption +' - Tabela"><span class="glyphicon glyphicon-list hidden-xs" aria-hidden="true"></span> Tabela</div></div>';
        }
        content += '<div class="row"><div id="fixtures" data-url="' + data._links.fixtures.href + '" data-name="'+ data.caption +' - Mecze"><span class="glyphicon glyphicon-certificate hidden-xs" aria-hidden="true"></span> Mecze</div></div>';
        content += '<div class="row"><div id="teams" data-url="' + data._links.teams.href + '" data-name="'+ data.caption +' - Drużyny"><span class="glyphicon glyphicon-user hidden-xs" aria-hidden="true"></span> Drużyny</div></div>';

        $("#stats").empty().append(content).show();

        $("#competitions, #fixtures, #teams").on("click", function(){
            historyActions.addHistoryAction(
                new historyObject(
                    $(this).data('url'),
                    Date.now(),
                    $(this).data('name')
                )
            );
            AFD.getStatistics($(this).attr('id'));
        });
    },

    showCompetitionStanding: function(name, data) {
        var content = '<h3 class="col-md-8 col-md-offset-2">' + data.leagueCaption + '</h3>';
        content += '<div class="btn-group col-md-8 col-md-offset-2" role="group" aria-label="...">';
        content += '<button id="btnTableFull" type="button" class="btn btn-default active">Pełna tabela</button>';
        content += '<button id="btnTableHome" type="button" class="btn btn-default">Statystyki domowe</button>';
        content += '<button id="btnTableAway" type="button" class="btn btn-default">Statystyki wyjazdowe</button>';
        content += '</div>';
        content += '<div class="container col-md-8 col-md-offset-2 standing stats_container">';
        content += '<div class="row">';
        content += '<div class="col-sm-1 col-xs-2">Poz.</div>';
        content += '<div class="col-sm-4 col-xs-8">Drużyna</div>';
        content += '<div class="col-sm-1 hidden-xs">M.</div>';
        content += '<div class="col-sm-1 hidden-xs">Z.</div>';
        content += '<div class="col-sm-1 hidden-xs">R.</div>';
        content += '<div class="col-sm-1 hidden-xs">P.</div>';
        content += '<div class="col-sm-1 hidden-xs">G+</div>';
        content += '<div class="col-sm-1 hidden-xs">G-</div>';
        content += '<div class="col-sm-1 col-xs-2">Pkt.</div>';
        content += '</div>';
        $.each(data.standing, function (i, item) {
            content += '<div class="row">';
            content += '<div class="col-sm-1 col-xs-2">' + item.position + '</div>';
            content += '<div class="col-sm-4 col-xs-8">' + item.teamName + '</div>';
            content += '<div class="col-sm-1 hidden-xs"><span class="full">' + item.playedGames + '</span><span class="home">' + (item.home.wins+item.home.draws+item.home.losses) + '</span><span class="away">' + (item.away.wins+item.away.draws+item.away.losses) + '</span></div>';
            content += '<div class="col-sm-1 hidden-xs"><span class="full">' + item.wins + '</span><span class="home">' + item.home.wins + '</span><span class="away">' + item.away.wins + '</span></div>';
            content += '<div class="col-sm-1 hidden-xs"><span class="full">' + item.draws + '</span><span class="home">' + item.home.draws + '</span><span class="away">' + item.away.draws + '</span></div>';
            content += '<div class="col-sm-1 hidden-xs"><span class="full">' + item.losses + '</span><span class="home">' + item.home.losses + '</span><span class="away">' + item.away.losses + '</span></div>';
            content += '<div class="col-sm-1 hidden-xs"><span class="full">' + item.goals + '</span><span class="home">' + item.home.goals + '</span><span class="away">' + item.away.goals + '</span></div>';
            content += '<div class="col-sm-1 hidden-xs"><span class="full">' + item.goalsAgainst + '</span><span class="home">' + item.home.goalsAgainst + '</span><span class="away">' + item.away.goalsAgainst + '</span></div>';
            content += '<div class="col-sm-1 col-xs-2"><span class="full">' + item.points + '</span><span class="home">' + (item.home.wins*3+item.home.draws) + '</span><span class="away">' + (item.away.wins*3+item.away.draws) + '</span></div>';
            content += '<input type="hidden" value="'+ item['_links']['team']['href'] +'" data-name="'+item.teamName+'">';
            content += '</div>'
        });
        content += '</div>';

        $("#stats").empty().append(content).show();

        $("#btnTableFull").on("click", function(){
            $(this).removeClass('active');
            $(".home, .away").hide();
            $(".full").show();
        });

        $("#btnTableHome").on("click", function(){
            $(this).removeClass('active');
            $(".full, .away").hide();
            $(".home").show();
        });

        $("#btnTableAway").on("click", function(){
            $(this).removeClass('active');
            $(".full, .home").hide();
            $(".away").show();
        });

        $(".standing .row:nth-of-type(n+2)").on("click", function() {
            historyActions.addHistoryAction(
                new historyObject(
                    $(this).find("input").val(),
                    Date.now(),
                    $(this).find("input").data("")
                )
            );
            AFD.getStatistics('team');
        });
    },

    showCompetitionFixtures: function(name, data) {
        data.fixtures.sort(function(a, b) {
            return (a.matchday - b.matchday);
        });
        var currentMatchday = 0;
        content = '';
        var liveMatches = Array();
        $.each(data.fixtures, function (i, item) {
            if (item.status == 'IN_PLAY') {
                var index = liveMatches.length;
                liveMatches[index] = i;
            }
            if (data['fixtures'][i].matchday != currentMatchday) {
                currentMatchday = data['fixtures'][i].matchday;
                if (currentMatchday > 1) {
                    content += '</div>';
                }
                content += '<div class="container col-md-8 col-md-offset-2 fixtures stats_container">';
                content += '<div class="row">';
                content += '<div class="col-md-1 hidden-sm hidden-xs">' + currentMatchday + '</div>';
                content += '<div class="col-md-3 col-xs-6">Gospodarz</div>';
                content += '<div class="col-md-1 hidden-sm hidden-xs">&nbsp</div>';
                content += '<div class="col-md-3 col-xs-6">Gość</div>';
                content += '<div class="col-md-2 hidden-sm hidden-xs">Wynik</div>';
                content += '<div class="col-md-2 hidden-sm hidden-xs">Data</div>';
                content += '</div>';
            }
            content += '<div class="row">';

            content += '<div class="col-md-1 hidden-sm hidden-xs">&nbsp;</div>';
            content += '<div class="col-md-3 col-xs-6 clubName">' + item.homeTeamName + '</div>';
            content += '<input type="hidden" value="' + item['_links']['homeTeam']['href'] + '" data-name="'+item.homeTeamName+'">';
            content += '<div class="col-md-1 hidden-sm hidden-xs">vs.</div>';
            content += '<div class="col-md-3 col-xs-6 clubName">' + item.awayTeamName + '</div>';
            content += '<input type="hidden" value="' + item['_links']['awayTeam']['href'] + '" data-name="'+item.awayTeamName+'">';

            var extraTime = '';
            if (item.result.extraTime != undefined) {
                extraTime = ' (ex. '+item.result.extraTime.goalsHomeTeam + ':' + item.result.extraTime.goalsAwayTeam + ')';
            };
            if (item.result.penaltyShootout != undefined) {
                extraTime = ' (p. '+item.result.penaltyShootout.goalsHomeTeam + ':' + item.result.penaltyShootout.goalsAwayTeam + ')';
            }
            content += '<div class="col-md-2 hidden-sm hidden-xs">' + item.result.goalsHomeTeam + ':' + item.result.goalsAwayTeam + extraTime +'</div>';
            content += '<div class="hidden-lg hidden-md col-xs-6">Wynik: ' + item.result.goalsHomeTeam + ':' + item.result.goalsAwayTeam + extraTime +'</div>';
            content += '<div class="col-md-2 col-xs-6">' + item.date.substr(0, 10) + '</div>';
            content += '</div>';
        });
        content += '</div>';

        $("#stats").empty().append(content).show();

        content = '<div class="container col-md-8 col-md-offset-2 fixtures">';
        $.each(liveMatches, function (i, item) {
            content += '<div class="row">';
            content += '<div class="col-xs-3 ">! NA ŻYWO !</div>';
            content += '<div class="col-xs-4">'+data.fixtures[item]['homeTeamName']+'</div>';
            content += '<div class="col-xs-1">vs.</div>';
            content += '<div class="col-xs-4">'+data.fixtures[item]['awayTeamName']+'</div>';
            content += '</div>';
            console.log(data.fixtures[item])
        });
        content += '</div>';
        if (liveMatches.length>0) {
            $("#stats").prepend(content);
        }

        $(".clubName").on("click", function(){
            historyActions.addHistoryAction(
                new historyObject(
                    $(this).find("~input").val(),
                    Date.now(),
                    $(this).find("~input").data("name")
                )
            );
            AFD.getStatistics("team");
        });
    },

    showCompetitionTeams: function(name, data) {
        var content = '<h3 class="col-md-8 col-md-offset-2">' + historyActions.getLastAction().name + '</h3>';
        content += '<div class="container col-md-8 col-md-offset-2 ">';
        content += '<div class="row teams">';
        $.each(data.teams, function (i, item) {
            content += '<div class="col-sm-6 col-xs-12 col-md-4">' + item.name + '</div>';
            content += '<input type="hidden" value="' + item['_links']['self']['href'] + '" data-name="'+item.name+'">';
        });
        content += '</div>';

        $("#stats").empty().append(content).show();

        $(".teams div").on("click", function(){
            historyActions.addHistoryAction(
                new historyObject(
                    $(this).find('~ input').val(),
                    Date.now(),
                    $(this).find('~ input').data('name')
                )
            );
            AFD.getStatistics('team');
        });
    },

    showTeam: function(name, data) {
        var content = '<div class="container col-md-4 col-md-offset-4 team stats_container">';

        content += '<div class="row">';
        content += '<div>';
        if (data.crestUrl != null) {
            content += '<img src="' + data.crestUrl +'" />';
        }
        content += '<h3>' + data.name + '</h3></div>';
        content += '</div>';

        content += '<div class="row"><div id="fixtures" data-url="' + data._links.fixtures.href + '" data-name="'+ data.name +' - Mecze"><span class="glyphicon glyphicon-certificate hidden-xs" aria-hidden="true"></span> Mecze</div></div>';
        content += '<div class="row"><div id="players" data-url="' + data._links.players.href + '" data-name="'+ data.name +' - Skład"><span class="glyphicon glyphicon-user hidden-xs" aria-hidden="true"></span> Skład</div></div>';

        $("#stats").empty().append(content).show();

        $("#fixtures, #players").on("click", function(){
            historyActions.addHistoryAction(
                new historyObject(
                    $(this).data('url'),
                    Date.now(),
                    $(this).data('name')
                )
            );
            AFD.getStatistics($(this).attr('id'));
        });
    },

    showSquad: function(name, data) {
        var content = '<div class="container col-md-6 col-md-offset-3 team stats_container">';
        content += '<div class="row">';
        content += '<div><h3>' + historyActions.getLastAction().name + '</h3></div>';
        content += '</div>';
        if (data.players.length == 0) {
            content += '<div class="row"><div class="col-xs-12">Brak informacji na temat piłkarzy</div></div>';
        }
        $.each(data.players, function (i, item) {
            content += '<div class="row">';
            content += '<div class="col-xs-1">' + item.jerseyNumber + '</div>';
            content += '<div class="col-xs-7 col-sm-5">' + item.name + '</div>';
            content += '<div class="col-xs-4 col-sm-3">' + item.nationality + '</div>';
            content += '<div class="hidden-xs col-sm-3">' + item.dateOfBirth + '</div>';
            content += '</div>';
        });
        content += '</div>';

        $("#stats").empty().append(content).show();
    }
};