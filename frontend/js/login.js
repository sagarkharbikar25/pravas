async function loginUser() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    const result = await apiCall("login.php", formData);

    if (result.success) {

        localStorage.setItem("user_id", result.user_id);

        window.location.href = "dashboard.html";

    } else {

        alert(result.message);

    }

}