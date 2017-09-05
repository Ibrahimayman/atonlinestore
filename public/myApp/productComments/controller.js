app.controller("commentsCtrl", function ($scope, $http, $timeout, toaster) {


    getComments();

    $scope.saveComment = function () {
        var ProductComment = {
            comment: $("[name='userComment']").val(),
            Email: $("[name='visitorEmail']").val(),
            visitorName: $("[name='visitorName']").val(),
            user: $("[name='userId']").val(),
            product: $("[name='productId']").val()
        };
        $http.post('/api/product/saveComment/', ProductComment)
            .success(function (data) {
                $("[name='userComment']").val('');
                $("[name='visitorEmail']").val('');
                $("[name='visitorName']").val('');
                toaster.pop(data.type, "تقييم المنتج", data.message, 2000);
                getComments();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    function getComments() {
        var url = window.location.pathname;
        var id = url.substring(url.lastIndexOf('/') + 1);
        $http.get('/api/product/comments/' + id)
            .success(function (data) {
                $scope.comments = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }

});



