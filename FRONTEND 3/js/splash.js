/* =========================
   SPLASH REDIRECT LOGIC START
========================= */

(function redirectAfterSplash() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");

  setTimeout(() => {
    if (next === "app") {
      window.location.href = "index.html";
      return;
    }

    if (next === "login") {
      window.location.href = "login.html";
      return;
    }

    const isLoggedIn = localStorage.getItem("pravaas_logged_in") === "true";
    window.location.href = isLoggedIn ? "index.html" : "login.html";
  }, 3000);
})();

/* =========================
   SPLASH REDIRECT LOGIC END
========================= */