function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if(email === "" || password === "") {
        alert("Please fill all fields!");
    } else {
        alert("Welcome to PRAVAAS 🚀");
    }
}