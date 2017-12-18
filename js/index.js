$(document).ready(() => {

    //gir knappen funksjonalitet til å hente informasjonen, lage en bruker og sjekke om brukeren eksisterer
    $("#loginBtn").on('click', (e) => {
        e.preventDefault();

        $username = $("#usernameBox").val();
        $password = $("#passwordBox").val();

        SDK.login($username, $password, (err, data) =>{
            if (err && err.xhr.status !== 200){
                console.log("Could not login")
            }
            else{
                loadUser();
            }
        });
    });

    $("#createBtn").click(() => {
       window.location.href = "createUser.html";
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
//gjør det mulig å logge inn ved å trykke enter når man har markøren i passord-boksen
$("#passwordBox").keypress(function (e) {
    if(e.which === 13){
        $("#loginBtn").click();
        return false;
    }
});