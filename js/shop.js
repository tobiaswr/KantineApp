$(document).ready(() => {

    const $itemList = $("#item-list");

    SDK.Items.getAll((err, items) => {
        if (err) throw err;
        items.forEach((item) => {

            const itemHtml = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${item.itemName}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-8">
                      <dl>
                        <dt>Description</dt>
                        <dd>${item.itemDescription}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4 price-label">
                            <p>Kr. <span class="price-amount">${item.itemPrice}</span></p>
                        </div>
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-success purchase-button" data-item-id="${item.itemId}">Add to basket</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

            $itemList.append(itemHtml);
        });

        $(".purchase-button").click(function() {
            const itemId = $(this).data("item-id");
            const item = items.find((item) => item.itemId === itemId);
            SDK.Items.addToBasket(item);
            $("#purchase-modal").modal("toggle");
        });
    });

    $("#purchase-modal").on("shown.bs.modal", () => {
        const basket = SDK.Storage.load("basket");
        const $modalTbody = $("#modal-tbody");
        $modalTbody.empty();
        basket.forEach((entry) => {
            const total = entry.item.itemPrice * entry.count;
            $modalTbody.append(`
        <tr>
            <td></td>
            <td>${entry.item.itemName}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.item.itemPrice}</td>
            <td>kr. ${total}</td>
            <td>
                <button type="button" class="btn btn-default remove-button" data-item-id="${entry.item.itemId}">Remove</button>
            </td>
        </tr>
      `);
        });

        $(".remove-button").click(function(){
            const itemId = $(this).data("item-id");
            SDK.Items.removeFromBasket(itemId);
        });
    });
});