app.controller("ProductCtrl", function ($scope, $http, toaster, $timeout, ProductService) {

    $scope.formData = {};
    var ProductId;
    $scope.DeleteProduct = function () {

        $http.delete('/admin/api/product/remove/' + ProductId)
            .success(function (data) {
                $("#RemoveModal").modal("hide");
                console.log(data);
                toaster.pop(data.type, "حذف منتج", data.message, 2000);
                // Refresh data table 
                window.location.reload();
            })
            .error(function (data) {
                toaster.pop(data.type, "حذف منتج", data.message, 2000);
            });
    };

    $scope.showRemoveModal = function (id) {
        ProductId = id;
        $("#RemoveModal").modal("show");
    };

    function getAllProducts() {
        $http.get('/api/product/getAll/')
            .success(function (data) {
            })
            .error(function (data) {
                alert(data)
            });
    }

});