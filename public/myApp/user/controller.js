app.controller("userCtrl", function ($scope, $http, toaster) {

    $scope.formData = {};
    var userId;
    $scope.DeleteUser = function () {

        $http.delete('/admin/api/user/remove/' + userId)
            .success(function (data) {
                $("#RemoveModal").modal("hide");
                toaster.pop(data.type, "حذف مستخدم", data.message, 2000);
                // Refresh data table
                window.location.reload();
            })
            .error(function (data) {
                toaster.pop(data.type, "حذف منتج", data.message, 2000);
            });
    };

    $scope.showRemoveModal = function (id) {
        userId = id;
        $("#RemoveModal").modal("show");
    };

});