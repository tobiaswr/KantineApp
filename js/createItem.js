$(document).ready(() => {
    $("#createItemBtn").click(() => {
        const $itemName = $("#itemNameInput").val();
        const $itemDesc = $("#itemDescInput").val();
        const $itemPrice = $("#itemPriceInput").val();

        SDK.Items.create($itemName, $itemDesc, $itemPrice, (err, data) =>{
            if (err && err.xhr.status !== 200){
                console.log("Could not create item")
            }
            else{
                console.log("Item created")
                window.alert("Item created.");
                window.location.reload();
            }
        });
    });
});