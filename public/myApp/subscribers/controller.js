app.controller("subscribeCtrl", function ($scope, $http, toaster, $timeout, subscribeService) {

    $scope.formData = {};

    $scope.subscribeAccount = function () {
        debugger;
        var Subscribers = {
            email: $("#emailSubscribe").val()
        };

        $http.post('/api/subscribers/subscribe/', Subscribers)
            .success(function (data) {
                $("#emailSubscribe").val('');// clear the form so our user is ready to enter another
                console.log(data);
                toaster.pop(data.type, "النشرة البريدية", data.message, 2000);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

});