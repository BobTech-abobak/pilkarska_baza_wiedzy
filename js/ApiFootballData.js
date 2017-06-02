/**
 * Created by Adrian on 2017-06-02.
 */
var AFD = {

    accessToken: "4de4f63bfd60499bb7e6aa6c98c4e3bb",
    baseUrl: "http://football-data.org/v1/",
    competisionUrl: "competitions",

    getCompetitions: function() {
        var competisions = this.ajaxRequest(this.competisionUrl, this.testowo);
    },

    ajaxRequest: function(url, callback) {
        $.ajax({
            url: this.baseUrl+url,
            data: '',
            type: 'GET',
            headers: {"X-Auth-Token": this.accessToken},
            dataType: 'json',
            success: function(data) {
                callback(data);
                return data;
            },
            error: function() {
                console.log('Failed!');
            },
        })
    },

    testowo: function(data) {
        console.log(data);
    }
};