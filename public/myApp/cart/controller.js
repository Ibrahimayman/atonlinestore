app.controller("CartCtrl", function ($scope, $http, toaster) {

    $scope.formData = {};
    var item, price;
    $scope.DeleteFromCart = function () {
        debugger;
        $http.delete('/api/cart/remove/' + item + '/' + price)
            .success(function (data) {
                $("#RemoveModal").modal("hide");
                toaster.pop(data.type, "حذف منتج", data.message, 2000);
                // Refresh data table
                window.location.reload();
            })
            .error(function (data) {
                toaster.pop(data.type, "حذف منتج", data.message, 2000);
            });
    };

    $scope.showRemoveModal = function (paramItem, paramPrice) {
        item = paramItem;
        price = paramPrice;
        $("#RemoveModal").modal("show");
    };

});