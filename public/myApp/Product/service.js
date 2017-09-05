app.service("ProductService", function ($http) {

    this.removeProduct = function (id) {
        debugger;
        var response = $http({
            method: "Delete",
            url: "/api/product/remove/" + id
        });
        return response;
    };

});