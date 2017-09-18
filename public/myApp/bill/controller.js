app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];
        if (angular.isArray(items)) {
            var keys = Object.keys(props);
            items.forEach(function (item) {
                var itemMatches = false;
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }
                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }
        return out;
    };
});

app.controller("billCtrl", function ($scope, $http, $timeout, toaster, lodash) {
    var vm = this;

    vm.disabled = undefined;
    vm.searchEnabled = undefined;

    vm.setInputFocus = function () {
        $scope.$broadcast('UiSelectDemo1');
    };

    vm.enable = function () {
        vm.disabled = false;
    };

    vm.disable = function () {
        vm.disabled = true;
    };

    vm.enableSearch = function () {
        vm.searchEnabled = true;
    };

    vm.disableSearch = function () {
        vm.searchEnabled = false;
    };

    vm.clear = function () {
        vm.ProductList.selected = undefined;
    };

    vm.someGroupFn = function (item) {

        if (item.name[0] >= 'A' && item.name[0] <= 'M')
            return 'From A - M';

        if (item.name[0] >= 'N' && item.name[0] <= 'Z')
            return 'From N - Z';

    };

    vm.firstLetterGroupFn = function (item) {
        return item.name[0];
    };

    vm.reverseOrderFilterFn = function (groups) {
        return groups.reverse();
    };

    vm.counter = 0;
    vm.onSelectCallback = function (item, model) {
        vm.counter++;
        vm.eventResult = {item: item, model: model};
    };

    vm.removed = function (item, model) {
        vm.lastRemoved = {
            item: item,
            model: model
        };
    };

    vm.tagTransform = function (newTag) {
        var item = {
            name: newTag,
            email: newTag.toLowerCase() + '@email.com',
            age: 'unknown',
            ProductList: 'unknown'
        };
        return item;
    };


    vm.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

    vm.singleDemo = {};
    vm.singleDemo.color = '';
    vm.multipleDemo = {};
    vm.multipleDemo.colors = ['Blue', 'Red'];
    vm.multipleDemo.colors2 = ['Blue', 'Red'];

    vm.appendToBodyDemo = {
        remainingToggleTime: 0,
        present: true,
        startToggleTimer: function () {
            var scope = vm.appendToBodyDemo;
            var promise = $interval(function () {
                if (scope.remainingTime < 1000) {
                    $interval.cancel(promise);
                    scope.present = !scope.present;
                    scope.remainingTime = 0;
                } else {
                    scope.remainingTime -= 1000;
                }
            }, 1000);
            scope.remainingTime = 3000;
        }
    };

    vm.ProductList = [];
    $http.get('/admin/api/product/getAll/')
        .success(function (products) {
            vm.ProductList = products;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    var items = [];
    var ItemTotalPrice = [];
    vm.saveStorage = function () {
        items.push(
            {
                "name": $("#productName").val(),
                "item": $("#productId").val(),
                "price": $("[name='price']").val(),
                "quantity": $("[name='quantity']").val(),
                "ItemTotalPrice": parseFloat($("[name='quantity']").val() * $("[name='price']").val())
            }
        );
        ItemTotalPrice.push(parseFloat($("[name='quantity']").val() * $("[name='price']").val()));
        var total = 0;
        $.each(ItemTotalPrice, function () {
            total += this;
        });
        $("[name='total']").val(total);
        vm.items = items;
    };

    vm.saveBill = function () {
        var bill = {
            clientName: $("[name='clientName']").val(),
            items: items,
            total: $("[name='total']").val(),
            orderType: $("[name='orderType']").val(),
            number: $("[name='mobile']").val(),
            address: $("[name='address']").val()
        };
        $http.post('/admin/api/bill/saveBill/', bill)
            .success(function (bill) {
                toaster.pop(bill.type, "اضافة فاتورة", bill.message, 2000);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    vm.removeItem = function (item, price) {
        // remove item from Items Array.
        lodash.remove(items, function (currentObject) {
            return currentObject.item === item;
        });
        /* change ItemTotalPrice */
        var total = $("[name='total']").val();
        $("[name='total']").val(total - parseFloat(price));
        /* change ItemTotalPrice */
    };
});