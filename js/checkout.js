$(document).ready(() => {


    const $modalTbody = $("#basket-tbody");
    const $checkoutActions = $("#checkout-actions");
    const $nothingInBasketContainer = $("#nothing-in-basket-container");

    function loadBasket() {
        const currentUser = SDK.Storage.load("currentUser");
        const basket = SDK.Storage.load("basket") || [];
        let total = 0;

        $nothingInBasketContainer.show();

        if (!basket.length) {
            $("#checkout-table-container").hide();
        } else {
            $nothingInBasketContainer.hide();
        }

        basket.forEach(entry => {
            let subtotal = entry.item.itemPrice * entry.count;
            total += subtotal;
            $modalTbody.append(`
        <tr>
            <td>
            </td>
            <td>${entry.item.itemName}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.item.itemPrice}</td>
            <td>kr. ${subtotal}</td>
        </tr>
      `);
        });

        $modalTbody.append(`
      <tr>
        <td colspan="3"></td>
        <td><b>Total</b></td>
        <td>kr. ${total}</td>
      </tr>
    `);

        if (currentUser) {
            $checkoutActions.append(`
      <button class="btn btn-success btn-lg" id="checkout-button">Checkout</button>
    `);
        }
        else {
            $checkoutActions.append(`
      <a href="login.html">
        <button class="btn btn-primary btn-lg">Log in to checkout</button>
      </a>
    `);
        }
    }

    loadBasket();

    $("#clear-basket-button").click(() => {
        SDK.Storage.remove("basket");
        loadBasket();
    });

    $("#checkout-button").click(() => {
        const basket = SDK.Storage.load("basket");
        const items = [];
        for(let i = 0; i<basket.length; i++){
            for(let j = 0; j<basket[i].count; j++){
                items.push(basket[i].item);
            }
        }
        SDK.Orders.create(items)
        },
        (err, order) => {
            if (err) throw err;
            $("#order-alert-container").find(".alert-success").show();
            SDK.Storage.remove("basket");
            loadBasket();
            $nothingInBasketContainer.hide();
        });
});
