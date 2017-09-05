app.controller("ExpensesCtrl", function ($scope, $http, toaster) {

    $scope.formData = {};
    getTotalCost();
    $scope.showAddModal = function (id) {
        $("#AddModal").modal("show");
    };

    function getTotalCost() {
        $http.get('/admin/api/Expenses/getTotalCost/')
            .success(function (data) {
                debugger;
                $("#totalCost").text(" اجمالي المصروفات حتي تاريخة :  " + data[0].totalCost);
            })
            .error(function (data) {
                alert(data)
            });
    }

});