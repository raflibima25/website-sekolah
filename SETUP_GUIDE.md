# 📚 Panduan Setup Website Sekolah

Panduan lengkap step-by-step untuk setup dan menjalankan website sekolah.

## 🎯 Prerequisites

- Browser modern (Chrome, Firefox, Edge)
- Text editor (VS Code recommended)
- Koneksi internet
- Akun Supabase (gratis)

---

## 🚀 Langkah 1: Setup Supabase Project

### 1.1 Buat Akun Supabase

1. Kunjungi https://supabase.com
2. Klik **"Start your project"**
3. Login dengan GitHub atau email
4. Klik **"New Project"**

### 1.2 Konfigurasi Project

Isi form berikut:

- **Name**: `website-sekolah` (atau nama lain)
- **Database Password**: Buat password yang kuat (SIMPAN password ini!)
- **Region**: Pilih **Southeast Asia (Singapore)** untuk performa terbaik
- **Pricing Plan**: Pilih **Free** (sudah cukup untuk development)

Klik **"Create new project"** dan tunggu ~2 menit.

---

## 🗄️ Langkah 2: Setup Database

### 2.1 Buat Tabel

1. Di dashboard Supabase, buka **SQL Editor** (icon ⚡ di sidebar)
2. Klik **"New query"**
3. Copy seluruh isi file `setup.sql` dari project ini
4. Paste ke SQL Editor
5. Klik **"Run"** atau tekan `Ctrl+Enter`
6. Tunggu hingga muncul pesan sukses

✅ **Berhasil!** Anda sudah membuat:
- Tabel `guru`, `siswa`, `berita`
- RLS policies
- Sample data (5 guru, 5 siswa, 3 berita)

### 2.2 Verifikasi Tabel

1. Buka **Table Editor** di sidebar
2. Anda akan melihat 3 tabel: `guru`, `siswa`, `berita`
3. Klik masing-masing tabel untuk melihat sample data

---

## 📦 Langkah 3: Setup Storage

### 3.1 Buat Storage Buckets

1. Buka **Storage** di sidebar Supabase
2. Klik **"New bucket"**

**Bucket 1: guru-photos**
- Nama: `guru-photos`
- **Toggle "Public bucket" → ON** ✅
- Klik "Create bucket"

**Bucket 2: siswa-photos**
- Nama: `siswa-photos`
- **Toggle "Public bucket" → ON** ✅
- Klik "Create bucket"

**Bucket 3: berita-images**
- Nama: `berita-images`
- **Toggle "Public bucket" → ON** ✅
- Klik "Create bucket"

### 3.2 Setup Storage Policies

1. Kembali ke **SQL Editor**
2. Copy seluruh isi file `storage-policies.sql`
3. Paste dan **Run**
4. Tunggu hingga selesai

✅ **Berhasil!** Storage buckets sudah siap digunakan.

---

## 🔑 Langkah 4: Dapatkan API Credentials

### 4.1 Copy Credentials

1. Buka **Settings** (icon ⚙️) → **API**
2. Cari section **Project URL** dan **API Keys**
3. **COPY** kedua nilai ini:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4.2 Konfigurasi Project

1. Di folder project, cari file `js/config.example.js`
2. **Rename** file tersebut menjadi `js/config.js`
3. Buka `js/config.js` dengan text editor
4. **Ganti** nilai berikut:

```javascript
const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co'; // Paste Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Paste anon public
```

5. **Save** file

⚠️ **PENTING**: Jangan commit file `config.js` ke GitHub! File ini sudah ada di `.gitignore`.

---

## 💻 Langkah 5: Jalankan Website

### Opsi A: Menggunakan VS Code Live Server (Recommended) ⭐

1. Install extension **"Live Server"** di VS Code
   - Buka Extensions (Ctrl+Shift+X)
   - Search "Live Server"
   - Install by Ritwick Dey

2. Buka file `index.html`
3. Klik kanan → **"Open with Live Server"**
4. Browser akan otomatis terbuka di `http://localhost:5500`

### Opsi B: Menggunakan Python

```bash
# Buka terminal di folder project
cd website_sekolah

# Jalankan server
python -m http.server 8000

# Buka browser: http://localhost:8000
```

### Opsi C: Menggunakan Node.js

```bash
# Install http-server (hanya sekali)
npm install -g http-server

# Jalankan server
http-server

# Buka browser: http://localhost:8080
```

### Opsi D: Buka Langsung File

Double-click `index.html` (tidak recommended, beberapa fitur mungkin tidak jalan karena CORS).

---

## ✅ Langkah 6: Testing Website

### 6.1 Test Homepage

1. Buka `http://localhost:5500` (atau port yang sesuai)
2. Anda akan melihat homepage dengan menu navigasi
3. Klik semua menu untuk memastikan halaman terbuka

### 6.2 Test Data Guru

1. Klik menu **"Data Guru"**
2. Anda akan melihat 5 data sample guru
3. Klik **"Tambah Guru"**
4. Isi form:
   - Nama: `Test Guru`
   - Mata Pelajaran: `Testing`
   - Upload foto (max 5MB, JPG/PNG/GIF)
5. Klik **"Simpan"**
6. Data baru muncul di tabel ✅

**Test Edit:**
- Klik tombol **Edit** di salah satu data
- Ubah nama atau mata pelajaran
- Klik **Simpan**
- Data berubah ✅

**Test Hapus:**
- Klik tombol **Hapus** di data test
- Konfirmasi hapus
- Data hilang dari tabel ✅

### 6.3 Test Data Siswa

Lakukan testing serupa dengan Data Guru:

1. Klik menu **"Data Siswa"**
2. Test: Tambah, Edit, Hapus
3. **Perhatian**: NIP harus unik!

### 6.4 Test Berita

1. Klik menu **"Berita Sekolah"**
2. Anda akan melihat 3 berita sample
3. Klik **"Baca"** untuk melihat detail berita
4. Klik **"Tambah Berita"**
5. Isi form dengan artikel dan upload gambar
6. Klik **"Publish"**
7. Berita baru muncul di halaman ✅

---

## 🐛 Troubleshooting

### ❌ Error: "Failed to fetch" / Data tidak muncul

**Penyebab:**
- Supabase credentials salah
- Koneksi internet bermasalah

**Solusi:**
1. Cek `js/config.js` apakah URL dan KEY sudah benar
2. Cek koneksi internet
3. Buka Console browser (F12) untuk lihat error detail

### ❌ Upload gambar gagal

**Penyebab:**
- Storage bucket belum dibuat
- Bucket tidak di-set sebagai Public
- Storage policies belum di-run

**Solusi:**
1. Cek Supabase Dashboard → Storage
2. Pastikan 3 bucket ada dan PUBLIC
3. Jalankan `storage-policies.sql` di SQL Editor

### ❌ CORS Error

**Penyebab:**
- Membuka file HTML langsung tanpa server

**Solusi:**
- Gunakan Live Server / http-server
- Jangan buka file dengan double-click

### ❌ RLS Policy Error

**Penyebab:**
- RLS policies belum dibuat

**Solusi:**
1. Jalankan `setup.sql` di SQL Editor
2. Atau disable RLS untuk testing:
   - Buka Table Editor
   - Klik tabel → RLS → Disable RLS

---

## 🚢 Deployment

### Deploy ke Netlify (Tercepat)

1. Buka https://netlify.com
2. Login dengan GitHub
3. Drag & drop folder `website_sekolah` ke Netlify
4. Website langsung live! 🎉

**PENTING:**
- Pastikan file `config.js` sudah ada di folder (bukan `config.example.js`)
- Jangan lupa ganti credentials

### Deploy ke Vercel

1. Buka https://vercel.com
2. Import project dari GitHub
3. Deploy otomatis!

### Deploy ke GitHub Pages

1. Buat repository di GitHub
2. Push semua file (kecuali `config.js` - ganti pakai environment variables)
3. Settings → Pages → Enable

---

## 📊 Next Steps

Setelah website jalan, Anda bisa:

### 1. Tambah Authentication (Opsional)

Gunakan Supabase Auth untuk login admin:

```javascript
// Login
const { data, error } = await supabaseClient.auth.signInWithPassword({
  email: 'admin@sekolah.com',
  password: 'password123'
});

// Ubah RLS policy agar hanya authenticated user yang bisa CRUD
```

### 2. Custom Domain

- Netlify: Settings → Domain management
- Vercel: Settings → Domains

### 3. Tambah Fitur

- **Pagination** untuk tabel data
- **Search** untuk mencari data
- **Export** data ke Excel/PDF
- **Dashboard** dengan statistik
- **Galeri** foto kegiatan sekolah

### 4. Optimasi

- Compress gambar sebelum upload
- Lazy loading images
- Caching
- CDN untuk assets

---

## 📞 Support

Jika mengalami kendala:

1. Cek section **Troubleshooting** di atas
2. Baca dokumentasi Supabase: https://supabase.com/docs
3. Buka issue di repository ini

---

## ✨ Tips

- **Backup database** secara berkala dari Supabase Dashboard
- Gunakan **browser DevTools** (F12) untuk debugging
- Test di **berbagai device** (desktop, tablet, mobile)
- Simpan credentials di **password manager**
- **Jangan commit** `config.js` ke repository public

---

**Selamat! Website sekolah Anda sudah siap digunakan! 🎉**
