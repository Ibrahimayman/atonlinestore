/**
 * Created by Ibrahim Ayman on 03/07/2017.
 */

$(function () {

    var ProductStatus = [];
    var homePageStatus;

    $("html").niceScroll();

    $('.datepicker').datepicker({
        autoclose: true,
        startDate: new Date()
    });

    $(".datatable").dataTable({
        // ajax : "/api/product/getAll/"
    });

    $('input:checkbox').change(function () {
        if ($(this).prop('checked') === true) {
            ProductStatus.push($(this).val());
        }
        else {
            _.pull(ProductStatus, $(this).val());
        }
        if ($(this).prop('checked') === true && $(this).val() === "sale") {
            // alert("Change event: " + this.value);
            $("#priceAfterOffer").show();
        }
        else {
            $("#priceAfterOffer").val('');
            $("#priceAfterOffer").hide();
        }
        $("#StatusValues").val(ProductStatus);
    });

    // $('input:checkbox').change(function () {
    //     if ($(this).prop('checked') === true) {
    //         homePageStatus = ($(this).val());
    //     }
    //     else {
    //         homePageStatus = "";
    //     }
    //     $("#homePage").val(ProductStatus);
    //     console.log($("#homePage").val());
    // });

});





