$(document).ready(() => {

    SDK.User.loadNav();

    $("#login-button").click(() => {

        const email = $("#usernameBox").val();
        const password = $("#passwordBox").val();

        SDK.User.login(email, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".loginInput").addClass("has-error");
            }
            else if (err){
                console.log("BAd stuff happened")
            } else {
                window.location.href = "my-page.html";
            }
        });

    });

});