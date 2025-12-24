function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email dan password wajib diisi");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Belum daftar");
    return;
  }

  if (email === user.email && password === user.password) {
    localStorage.setItem("login", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Email atau password salah");
  }
}
