app.controller("saveProfileCtrl", function ($scope, $http, toaster) {

    var userDays = [];
    for (var i = 1; i < 32; i++) {
        userDays.push(i);
    }
    $scope.days = userDays;

    var userMonths = [];
    for (var i = 1; i < 13; i++) {
        userMonths.push(i);
    }
    $scope.Months = userMonths;

    var userYears = [];
    for (var i = 1975; i <2010 ; i++) {
        userYears.push(i);
    }
    $scope.years = userYears;

    setBirthDateFunc();
    function setBirthDateFunc() {
        $http.get('/api/profile/setBirthDate/')
            .success(function (data) {
                debugger;
                var date = new Date(data.profile.dateOfBirth);
                var month = date.getMonth();
                var year = date.getFullYear();
                var day = date.getDate();
                // set values for birth date.
                $("[name='day']").val(day);
                $("[name='month']").val(month);
                $("[name='year']").val(year);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }
});