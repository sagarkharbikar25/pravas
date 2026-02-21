/* REGISTER */
async function register() {

    const firstName = document.getElementById("firstName").value;
    const lastName  = document.getElementById("lastName").value;
    const email     = document.getElementById("regEmail").value;
    const password  = document.getElementById("regPassword").value;

    const name = firstName + " " + lastName;

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    const result = await apiCall("register.php", formData);

    if(result.success){

        showPopup("Registration successful ✈");

        setTimeout(() => {

            showLogin();

        },1500);

    }
    else{

        alert(result.message);

    }

}


/* LOGIN */
async function login(){

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    const result = await apiCall("login.php", formData);

    if(result.success){

        localStorage.setItem("user_id", result.user_id);

        showPopup("Login successful 🚀");

        setTimeout(()=>{

            window.location.href="dashboard.html";

        },1500);

    }
    else{

        alert(result.message);

    }

}