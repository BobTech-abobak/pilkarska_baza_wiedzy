/**
 * Created by Adrian on 2017-06-02.
 */
var AFD = {

    accessToken: "4de4f63bfd60499bb7e6aa6c98c4e3bb",

    currentRequestUrl: "http://api.football-data.org/v1/competitions",

    getStatistics: function(name, url) {
        switch (name) {
            case 'stats':
                var dataColumns = {
                    caption: 'Nazwa rozgrywek',
                    numberOfTeams: 'Liczba drużyn',
                    lastUpdated: 'Ostatnia aktualizacja'
                };
                var dataKeys = {
                    link: "leagueTable",
                    key: ''
                };
                this.ajaxRequest('competitions', this.showStatsList, dataColumns, dataKeys);
                break;
            case 'competitions':
                var dataColumns = {
                    // caption: 'Nazwa rozgrywek',
                    // numberOfTeams: 'Liczba drużyn',
                    // lastUpdated: 'Ostatnia aktualizacja'
                };
                var dataKeys = {
                    link: "team",
                    key: 'standing'
                };
                this.ajaxRequest('leagueTable', this.showStatsList, dataColumns, dataKeys);
                break;
            default:
                console.log('Failed action: ' + name);
                break;
        }
    },

    ajaxRequest: function(name, callback, dataColumns, dataKeys) {
        $("#loader").show();
        var afd = this;
        $.ajax({
            url: this.currentRequestUrl,
            type: 'GET',
            headers: {"X-Auth-Token": this.accessToken},
            dataType: 'json',
            success: function(data) {
                callback(name, data, dataColumns, dataKeys);
                $("#loader").hide();
                $("table#"+name+" td").on('click', function(){
                    afd.currentRequestUrl = $(this).find('~ input').val();
                    afd.getStatistics(name);
                });
            },
            error: function() {
                console.log('Failed!');
            },
        })
    },

    showStatsList: function(name, data, dataColumns, dataKeys) {
        var content = '<table id="'+ name +'">';
        content += '<tr>';
        content += '<th></th>';
        $.each(dataColumns, function (j, label) {
            content += '<th>' + label + '</th>';
        });
        content += '</tr>';
        if (dataKeys['key'] != '') {
            data = data[dataKeys['key']];
        }
        $.each(data, function (i, item) {
            content += '<tr>';
            content += '<td><i class="fa fa-tasks" aria-hidden="true"></i></td>';
            $.each(dataColumns, function (j, label) {
                content += '<td>' + item[j] + '</td>';
            });
            content += '<input type="hidden" value="'+ item['_links'][dataKeys['link']]['href'] +'">';
            content += '</tr>';
        });
        content += '</table>';
        $("#stats div:eq(0)").empty().append(content);


    }
};