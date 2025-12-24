alert("register.js KELOAD");
function register() {
  // ambil element
  const nama = document.getElementById("nama");
  const npm = document.getElementById("npm");
  const tglLahir = document.getElementById("tglLahir");
  const alamat = document.getElementById("alamat");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const password2 = document.getElementById("password2");
  const smp = document.getElementById("smp");
  const sma = document.getElementById("sma");
  const foto = document.getElementById("foto");

  // validasi
  if (!nama.value || !email.value || !password.value) {
    alert("Data wajib diisi");
    return;
  }

  if (password.value !== password2.value) {
    alert("Password tidak sama");
    return;
  }

  // cek email dobel
  const oldUser = JSON.parse(localStorage.getItem("user"));
  if (oldUser && oldUser.email === email.value.trim()) {
    alert("Email sudah terdaftar");
    return;
  }

  // object user
  const user = {
    nama: nama.value.trim(),
    npm: npm.value.trim(),
    tglLahir: tglLahir.value,
    alamat: alamat.value.trim(),
    email: email.value.trim(),
    password: password.value,
    pendidikan: {
      smp: smp.value,
      sma: sma.value
    },
    foto: null
  };

  const fotoFile = foto.files[0];

  // tanpa foto
  if (!fotoFile) {
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "login.html";
    return;
  }

  // dengan foto
  const reader = new FileReader();
  reader.onload = function () {
    user.foto = reader.result;
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "login.html";
  };
  reader.readAsDataURL(fotoFile);
}

