$(document).ready(() => {

    const $orderList = $("#order-list");

    SDK.Orders.getAll((err, orders) => {
        if(err) throw err;

        orders.forEach((order) =>{
            let $items = "";
            for (let i = 0; i < order.items.length; i++){
                $items += order.items[i].itemName + " " + order.items[i].itemPrice + " kr" + "<br>";
            }
            const orderHtml = `
            <div class="col-lg-4 book-container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">${order.orderId} ${order.orderTime}</h3>
                    </div>
                    <div class="panel-body">
                        <div class="col-lg-8">
                            <dl>
                                <dt>Order time</dt>
                                <dd>${order.orderTime}</dd>
                                <dt>Is order ready</dt>
                                <dd>${order.isReady}</dd>
                                <dt>Items</dt>
                                <dd>${$items}</dd>
                            </dl>
                            <input type="button" value="Order done" class="btn btn-success approve-button" data-order-id="${order.orderId}">
                        </div>
                    </div>
                </div>
            </div>`;

            $orderList.append(orderHtml);

        });

        $(".approve-button").click(function () {
            const orderId = $(this).data("order-id");
            const order = orders.find((order) => order.orderId === orderId);
            SDK.Orders.makeReady(order.orderId, (err) => {
                if (err) throw err;
                window.location.href="staff.html";
            });
        });
    })

    $("#logoutBtn").click(function() {
        SDK.logOut();
        window.location.href = "index.html";
    });
});
