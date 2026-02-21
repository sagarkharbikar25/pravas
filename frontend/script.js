function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if(email === "" || password === "") {
        alert("Please fill all fields!");
        return;
    }

    alert("Welcome to PRAVAAS 🚀");

    // Show popup
    let popup = document.getElementById("popup");
    popup.classList.add("show");

    // Hide popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
}