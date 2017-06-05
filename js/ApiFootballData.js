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
            default:
                console.log('Failed action: ' + name);
                break;
        }
    },

    ajaxRequest: function(name, callback) {
        $("#loader").show();
        var afd = this;
        $.ajax({
            url: historyActions.getLastAction().url,
            type: 'GET',
            headers: {"X-Auth-Token": this.accessToken},
            dataType: 'json',
            success: function(data) {
                callback(name, data);
                $("#loader").hide();
                $("table#"+name+" td").on('click', function(){
                    historyActions.addHistoryAction(
                        new historyObject(
                            $(this).find('~ input').val(), Date.now()
                        )
                    );
                    afd.getStatistics(name);
                });
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
        var content = '<table id="'+name+'">';
        content += '<tr>';
        content += '<th></th>';
        content += '<th>Nazwa rozgrywek</th>';
        content += '<th>Liczba drużyn</th>';
        content += '<th>Ostatnia aktualizacja</th>';
        content += '</tr>';
        $.each(data, function (i, item) {
            content += '<tr>';
            content += '<td><i class="fa fa-tasks" aria-hidden="true"></i></td>';
            content += '<td>'+item.caption+'</td>';
            content += '<td>'+item.numberOfTeams+'</td>';
            content += '<td>'+ item.lastUpdated.substr(0, 10)+'</td>';
            content += '<input type="hidden" value="' + item['_links']['self']['href'] + '">';
            content += '</tr>';
        });
        content += '</table>';
        $("#stats div:eq(0)").empty().append(content);
    },

    showCompetitionInfo: function(name, data) {
        var content = '<h3>' + data.caption + '</h3>';
        if (data.currentMatchday == data.numberOfMatchdays) {
            content += '<button class="tableType" id="table" data-url="' + data._links.leagueTable.href + '">Tabela</button>';
        }
        content += '<button class="tableType" id="fixtures" data-url="' + data._links.fixtures.href + '">Mecze</button>';
        content += '<button class="tableType" id="teams" data-url="' + data._links.teams.href + '">Drużyny</button>';
        $("#stats div:eq(0)").empty().append(content);

        $("#table").on("click", function(){
            historyActions.addHistoryAction(
                new historyObject(
                    $(this).data('url'), Date.now()
                )
            );
            AFD.getStatistics('competitions');
        });

        $("#fixtures").on("click", function(){
            historyActions.addHistoryAction(
                new historyObject(
                    $(this).data('url'), Date.now()
                )
            );
            AFD.getStatistics('fixtures');
        });
    },

    showCompetitionStanding: function(name, data) {
        var dataColumns = {
            position: 'Poz.',
            teamName: 'Drużyna',
            playedGames: 'M.',
            wins: 'Z.',
            draws: 'R.',
            losses: 'P.',
            goals: 'G+',
            goalsAgainst: 'G-',
            points: 'Pkt.'
        };
        var content = '<h3>' + data.leagueCaption + '</h3>';
        content += '<button class="tableType tableActive" id="table">Pełna tabela</button>';
        content += '<button class="tableType" id="tableHome">Statystyki domowe</button>';
        content += '<button class="tableType" id="tableAway">Statystyki wyjazdowe</button>';
        content += '<table id="'+name+'">';
        content += '<tr>';
        $.each(dataColumns, function (j, label) {
            content += '<th>' + label + '</th>';
        });
        content += '</tr>';
        $.each(data.standing, function (i, item) {
            content += '<tr>';
            content += '<td>' + item.position + '</td>';
            content += '<td>' + item.teamName + '</td>';
            content += '<td><span class="full">' + item.playedGames + '</span><span class="home">' + (item.home.wins+item.home.draws+item.home.losses) + '</span><span class="away">' + (item.away.wins+item.away.draws+item.away.losses) + '</span></td>';
            content += '<td><span class="full">' + item.wins + '</span><span class="home">' + item.home.wins + '</span><span class="away">' + item.away.wins + '</span></td>';
            content += '<td><span class="full">' + item.draws + '</span><span class="home">' + item.home.draws + '</span><span class="away">' + item.away.draws + '</span></td>';
            content += '<td><span class="full">' + item.losses + '</span><span class="home">' + item.home.losses + '</span><span class="away">' + item.away.losses + '</span></td>';
            content += '<td><span class="full">' + item.goals + '</span><span class="home">' + item.home.goals + '</span><span class="away">' + item.away.goals + '</span></td>';
            content += '<td><span class="full">' + item.goalsAgainst + '</span><span class="home">' + item.home.goalsAgainst + '</span><span class="away">' + item.away.goalsAgainst + '</span></td>';
            content += '<td><span class="full">' + item.points + '</span><span class="home">' + (item.home.wins*3+item.home.draws) + '</span><span class="away">' + (item.away.wins*3+item.away.draws) + '</span></td>';
            content += '<input type="hidden" value="'+ item['_links']['team']['href'] +'">';
            content += '</tr>';
        });
        content += '</table>';
        $("#stats div:eq(0)").empty().append(content);

        $(".tableType").on('click', function() {
            $(".tableType").removeClass('tableActive')
            $(this).addClass('tableActive');
        });

        $("#table").on("click", function(){
            $("#leagueTable .home, #leagueTable .away").hide();
            $("#leagueTable .full").show();
        });

        $("#tableHome").on("click", function(){
            $("#leagueTable .full, #leagueTable .away").hide();
            $("#leagueTable .home").show();
        });

        $("#tableAway").on("click", function(){
            $("#leagueTable .full, #leagueTable .home").hide();
            $("#leagueTable .away").show();
        });
    },

    showCompetitionFixtures: function(name, data) {
        data.fixtures.sort(function(a, b) {
            return (a.matchday - b.matchday);
        });
        var currentMatchday = 0;
        content = '';
        $.each(data.fixtures, function (i, item) {;
            if (data['fixtures'][i].matchday != currentMatchday) {
                currentMatchday = data['fixtures'][i].matchday;
                if (currentMatchday > 1) {
                    content += '</table>';
                }
                content += '<h3>RUNDA ' + currentMatchday + '</h3>'
                content += '<table class="fixtures">';
                content += '<tr>';
                content += '<th>Gospodarze</th>';
                content += '<th></th>';
                content += '<th>Gość</th>';
                content += '<th>Wynik</th>';
                content += '<th>Data</th>';
                content += '</tr>';
            }
            content += '<td>' + item.homeTeamName + '</td>';
            content += '<td>vs.</td>';
            content += '<td>' + item.awayTeamName + '</td>';
            var extraTime = '';
            if (item.result.extraTime != undefined) {
                extraTime = ' (ex. '+item.result.extraTime.goalsHomeTeam + ':' + item.result.extraTime.goalsAwayTeam + ')';
            };
            if (item.result.penaltyShootout != undefined) {
                extraTime = ' (p. '+item.result.penaltyShootout.goalsHomeTeam + ':' + item.result.penaltyShootout.goalsAwayTeam + ')';
            }
            content += '<td>' + item.result.goalsHomeTeam + ':' + item.result.goalsAwayTeam + extraTime +'</td>';
            content += '<td>' + item.date.substr(0, 10) + '</td>';
            content += '</tr>';
        });
        content += '</table>';
        $("#stats div:eq(0)").empty().append(content);

        $(".tableType").on('click', function() {
            $(".tableType").removeClass('tableActive')
            $(this).addClass('tableActive');
        });

        $("#table").on("click", function(){
            $("#leagueTable .home, #leagueTable .away").hide();
            $("#leagueTable .full").show();
        });

        $("#tableHome").on("click", function(){
            $("#leagueTable .full, #leagueTable .away").hide();
            $("#leagueTable .home").show();
        });

        $("#tableAway").on("click", function(){
            $("#leagueTable .full, #leagueTable .home").hide();
            $("#leagueTable .away").show();
        });
    }
};