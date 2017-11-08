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
    orders.forEach(order => {
      $basketTbody.append(`
        <tr>
            <td>${order.id}</td>
            <td>${parseOrderItems(order.orderItems)}</td>
            <td>kr. ${sumTotal(order.orderItems)}</td>
        </tr>
      `);
    });
  });

  function parseOrderItems(items){
    return items.map(item => {
      return item.count + " x " + item.bookInfo.title
    }).join(", ");
  }

  function sumTotal(items){
    let total = 0;
    items.forEach(item => {
      total += item.count * item.bookInfo.price
    });
    return total;
  }

  $("#logoutBtn").click(function() {
    SDK.logOut();
    window.location.href = "index.html";
  });


});