/* not used */

app.service("subscribeService", function ($http) {

    this.subscribe = function (Subscribers) {
        const response = $http({
            method: "post",
            url: "/api/subscribers/subscribe/",
            data: JSON.stringify(Subscribers),
            dataType: "json"
        });
        return response;
    };

});