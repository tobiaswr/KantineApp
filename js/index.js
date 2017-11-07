$(document).ready(() => {
    $("#loginBtn").on('click', (e) => {
        e.preventDefault();

        $username = $("#usernameBox").val();
        $password = $("#passwordBox").val();

        SDK.login($username, $password, (error, data) => {
            if (error) {
                alert("You have entered an incorrect username or password.");
            }
            else {
                setTimeout(loadUser, 1000);
            }
        })
    });
});

loadUser = () => {
    if (!SDK.Storage.load("isPersonel")) {
        window.location.href = "my-page.html";
    }
    else {
        window.location.href = "staff.html";
    }
};