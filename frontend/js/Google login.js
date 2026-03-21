function handleGoogleLogin(response)
{
    const token = response.credential;

    fetch("http://localhost:8000/backend/google_login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: token
        })
    })
    .then(res => res.json())
    .then(data => {

        if(data.status === "success")
        {
            localStorage.setItem("user", JSON.stringify(data.user));

            showPopup("Google Login Successful ✈");

            setTimeout(()=>{
                window.location.href="dashboard.html";
            },1000);
        }
        else
        {
            alert("Google login failed");
        }

    });
}