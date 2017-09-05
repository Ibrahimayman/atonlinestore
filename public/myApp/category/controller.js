app.controller("categoryCtrl", function ($scope, $http, toaster) {
    // GetAllCategories();
    $scope.formData = {};
    var CatId;
    $scope.DeleteCategory = function () {

        $http.delete('/admin/api/category/remove/' + CatId)
            .success(function (data) {
                $("#RemoveModal").modal("hide");
                toaster.pop(data.type, "حذف قسم", data.message, 2000);
                window.location.reload();// Refresh data table
            })
            .error(function (data) {
                toaster.pop(data.type, "حذف قسم", data.message, 2000);
            });
    };

    $scope.showRemoveModal = function (id) {
        CatId = id;
        $("#RemoveModal").modal("show");
    };

    $scope.showEditModal = function (id) {
        CatId = id;
        $http.get('/admin/api/category/' + CatId)
            .success(function (data) {
                $("#EditModal").modal("show");
                $("#txtCatName").val(data.name);
            })
            .error(function (data) {
            });
    };

    $scope.EditCategory = function () {
        var category = {
            name: $("#txtCatName").val()
        };
        $http.put('/admin/api/category/' + CatId, category)
            .success(function (data) {
                $("#EditModal").modal("hide");
                $("#txtCatName").val('');
                toaster.pop(data.type, "تعديل قسم", data.message, 2000);
                window.location.reload();
            })
            .error(function (data) {
                toaster.pop(data.type, "تعديل قسم", data.message, 2000);
            });
    };

    function GetAllCategories() {
        $http.get('/admin/api/category/add-category')
            .success(function (data) {
                $scope.CategoriesList = data;
            })
            .error(function (data) {
                alert(data)
            });
    }

});