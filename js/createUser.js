$(document).ready(() => {

    //gir knappen funksjonalitet til å hente informasjonen tastet inn og lage en bruker av det
    $("#createUserButton").click(() => {
        const $username = $("#usernameField").val();
        const $password = $("#passwordField").val();

        SDK.Users.create($username, $password, (err, data) =>{
            if (err && err.xhr.status !== 200){
                console.log("Could not create user")
            }
            else{
                console.log("User created")
                window.location.href = "index.html";
            }
        });
    });
});