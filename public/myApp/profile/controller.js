app.controller("saveProfileCtrl", function ($scope, $http, toaster) {

    $scope.formData = {};
    setBirthDateFunc();

    function setBirthDateFunc() {
        $http.get('/api/profile/setBirthDate/')
            .success(function (data) {
                debugger;
                var date = new Date(data.profile.dateOfBirth);
                var month = date.getMonth();
                var year = date.getFullYear();
                var day = date.getDate();

                $scope.day = day;

                $("[name='day']").val(day);
                $("[name='month']").val(month);
                $("[name='year']").val(year);

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }
});