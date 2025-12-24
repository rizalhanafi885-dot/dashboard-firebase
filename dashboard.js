import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists()) {
    const u = snap.data();
    document.getElementById("namaUser").innerText = u.nama || "-";
    document.getElementById("npmUser").innerText = u.npm || "-";
    document.getElementById("alamatUser").innerText = u.alamat || "-";
  }
});

// ===== TAB & MENU =====
function openTab(id, el){
  document.querySelectorAll('.tab')
    .forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.menu-item')
    .forEach(m => m.classList.remove('active'));

  const tab = document.getElementById(id);
  if(tab) tab.classList.add('active');
  if(el) el.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const firstMenu = document.querySelector('.menu-item');
  if(firstMenu) openTab('profil', firstMenu);
});


// ===== DATA AKADEMIK =====
let data = JSON.parse(localStorage.getItem('akademik')) || [];
let editIndex = null;

function nilaiKeAngka(n){
  return {A:4, B:3, C:2, D:1}[n.toUpperCase()] ?? null;
}

function render(){
  const tbody = document.getElementById('tbody');
  const filterSemester = document.getElementById('filterSemester');
  const totalSksEl = document.getElementById('totalSks');
  const ipkEl = document.getElementById('ipk');

  if(!tbody) return;

  tbody.innerHTML = '';
  let totalSks = 0, totalBobot = 0;
  let semesterSet = new Set();
  let filter = filterSemester?.value || '';

  data.forEach((d,i)=>{
    semesterSet.add(d.semester);
    if(filter && d.semester !== filter) return;

    const bobot = nilaiKeAngka(d.nilai);
    totalSks += d.sks;
    totalBobot += bobot * d.sks;

    tbody.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${d.mk}</td>
        <td>${d.semester}</td>
        <td>${d.dosen}</td>
        <td>${d.nilai}</td>
        <td>${bobot}</td>
        <td>${d.sks}</td>
        <td>
          <button onclick="editData(${i})">✏️</button>
          <button onclick="hapusData(${i})">🚮</button>
        </td>
      </tr>`;
  });

  if(filterSemester){
    filterSemester.innerHTML =
      `<option value="">Semua Semester</option>` +
      [...semesterSet].map(s=>`<option>${s}</option>`).join('');
  }

  totalSksEl.innerText = totalSks;
  ipkEl.innerText = totalSks ? (totalBobot / totalSks).toFixed(2) : '0.00';

  localStorage.setItem('akademik', JSON.stringify(data));
}

function tambah(){
  const mk = document.getElementById('mk');
  const semester = document.getElementById('semester');
  const dosen = document.getElementById('dosen');
  const nilai = document.getElementById('nilai');
  const sks = document.getElementById('sks');

  if(!mk.value || !semester.value || !dosen.value || !nilai.value || !sks.value){
    alert('Lengkapi semua data'); return;
  }

  if(nilaiKeAngka(nilai.value) === null){
    alert('Nilai hanya A/B/C/D'); return;
  }

  const obj = {
    mk: mk.value,
    semester: semester.value,
    dosen: dosen.value,
    nilai: nilai.value.toUpperCase(),
    sks: parseInt(sks.value)
  };

  if(editIndex !== null){
    data[editIndex] = obj;
    editIndex = null;
  } else {
    data.push(obj);
  }

  mk.value = semester.value = dosen.value = nilai.value = sks.value = '';
  render();
}

function editData(i){
  const d = data[i];
  const mk = document.getElementById('mk');
  const semester = document.getElementById('semester');
  const dosen = document.getElementById('dosen');
  const nilai = document.getElementById('nilai');
  const sks = document.getElementById('sks');

  mk.value = d.mk;
  semester.value = d.semester;
  dosen.value = d.dosen;
  nilai.value = d.nilai;
  sks.value = d.sks;
  editIndex = i;
}

function hapusData(i){
  if(confirm('Hapus data?')){
    data.splice(i,1);
    render();
  }
}

render();

// ===== CASH FLOW =====
let cashFlowData = JSON.parse(localStorage.getItem('cashFlow')) || [];
let editCashFlowIndex = null;

function renderCashFlow(){
  const tbody = document.getElementById('tbodyCashFlow');
  const totalPemasukanEl = document.getElementById('totalPemasukan');
  const totalPengeluaranEl = document.getElementById('totalPengeluaran');
  const saldoEl = document.getElementById('saldo');

  if(!tbody) return;

  tbody.innerHTML = '';
  let totalPemasukan = 0, totalPengeluaran = 0;

  cashFlowData.forEach((d,i)=>{
    const jumlah = parseFloat(d.jumlah);
    if(d.tipe === 'pemasukan'){
      totalPemasukan += jumlah;
    } else {
      totalPengeluaran += jumlah;
    }

    tbody.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${d.tanggal}</td>
        <td>${d.deskripsi}</td>
        <td>${jumlah.toLocaleString()}</td>
        <td>${d.tipe}</td>
        <td>
          <button onclick="editCashFlow(${i})">✏️</button>
          <button onclick="hapusCashFlow(${i})">🗑</button>
        </td>
      </tr>`;
  });

  totalPemasukanEl.innerText = totalPemasukan.toLocaleString();
  totalPengeluaranEl.innerText = totalPengeluaran.toLocaleString();
  saldoEl.innerText = (totalPemasukan - totalPengeluaran).toLocaleString();

  localStorage.setItem('cashFlow', JSON.stringify(cashFlowData));
}

function tambahCashFlow(){
  const tanggal = document.getElementById('tanggal');
  const deskripsi = document.getElementById('deskripsi');
  const jumlah = document.getElementById('jumlah');
  const tipe = document.getElementById('tipe');

  if(!tanggal.value || !deskripsi.value || !jumlah.value || !tipe.value){
    alert('Lengkapi semua data'); return;
  }

  const obj = {
    tanggal: tanggal.value,
    deskripsi: deskripsi.value,
    jumlah: parseFloat(jumlah.value),
    tipe: tipe.value
  };

  if(editCashFlowIndex !== null){
    cashFlowData[editCashFlowIndex] = obj;
    editCashFlowIndex = null;
  } else {
    cashFlowData.push(obj);
  }

  tanggal.value = deskripsi.value = jumlah.value = '';
  renderCashFlow();
}

function editCashFlow(i){
  const d = cashFlowData[i];
  const tanggal = document.getElementById('tanggal');
  const deskripsi = document.getElementById('deskripsi');
  const jumlah = document.getElementById('jumlah');
  const tipe = document.getElementById('tipe');

  tanggal.value = d.tanggal;
  deskripsi.value = d.deskripsi;
  jumlah.value = d.jumlah;
  tipe.value = d.tipe;
  editCashFlowIndex = i;
}

function hapusCashFlow(i){
  if(confirm('Hapus data?')){
    cashFlowData.splice(i,1);
    renderCashFlow();
  }
}

renderCashFlow();
function logout() {
  signOut(auth).then(() => {
    window.location.href = "login.html"
  })
  window.location.href = "login.html";
}
