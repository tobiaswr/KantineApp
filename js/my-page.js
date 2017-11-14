$(document).ready(() => {

  const currentUser = SDK.Storage.load("currentUser");
  const userId = SDK.Storage.load("user_id");
  const $basketTbody = $("#basket-tbody");

  $(".page-header").html(`
    <h1>Hi, ${currentUser.username}</h1>
  `);

  $(".profile-info").html(`
    <dl>
        <dt>Name</dt>
        <dd>${currentUser.username}</dd>
        <dt>ID</dt>
        <dd>${userId}</dd>
     </dl>
  `);

  SDK.Orders.getByUserId((err, orders) => {
    if(err) throw err;
    orders.forEach((order) => {

        let $items = "";
        let $total = 0;
        for (let i = 0; i < order.items.length; i++){
            $items += order.items[i].itemName + ", " + order.items[i].itemPrice + " kr." + "<br>";
            $total += order.items[i].itemPrice;
        }
        let $status = "";
        if (order.isReady === true){
            $status = "Ready";
        }
        else{
            $status = "Not ready";
        }

      $basketTbody.append(`
        <tr>
            <td>${order.orderId}</td>
            <td>${$items}</td>
            <td>${$status}</td>
            <td>kr. ${$total}</td>
        </tr>
      `);
    });
  });


  $("#logoutBtn").click(function() {
    SDK.logOut();
    window.location.href = "index.html";
  });


});