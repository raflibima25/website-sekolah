# Website Sekolah

Website manajemen sekolah yang dibangun dengan HTML, Tailwind CSS, JavaScript, dan Supabase (PostgreSQL + Storage).

## Fitur

- **Halaman Utama**: Landing page dengan informasi umum sekolah
- **Profil Sekolah**: Visi, misi, sejarah, fasilitas, dan ekstrakurikuler
- **Data Guru**: CRUD (Create, Read, Update, Delete) data guru dengan upload foto
- **Data Siswa**: CRUD data siswa dengan kelas, NIP, dan foto
- **Berita Sekolah**: Manajemen artikel berita dengan gambar
- **About**: Informasi tentang website dan teknologi yang digunakan
- **Responsive Design**: Tampilan optimal di desktop, tablet, dan mobile

## Teknologi

- **Frontend**: HTML5, Tailwind CSS, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL Database + Storage)
- **Icons**: Font Awesome 6.4.0
- **CDN**: Tailwind CSS, Supabase JS Client

## Struktur Project

```
website_sekolah/
├── index.html              # Halaman utama
├── pages/
│   ├── profil.html        # Profil sekolah
│   ├── berita.html        # Daftar berita
│   ├── data-guru.html     # Manajemen data guru
│   ├── data-siswa.html    # Manajemen data siswa
│   └── about.html         # Tentang website
├── js/
│   ├── config.js          # Konfigurasi Supabase
│   ├── utils.js           # Helper functions
│   ├── guru.js            # CRUD guru
│   ├── siswa.js           # CRUD siswa
│   └── berita.js          # CRUD berita
├── assets/
│   └── images/            # Gambar lokal
└── README.md
```

## Setup Supabase

### 1. Buat Project Supabase

1. Kunjungi [supabase.com](https://supabase.com)
2. Login atau daftar akun baru
3. Klik "New Project"
4. Isi detail project:
   - **Name**: Website Sekolah
   - **Database Password**: (simpan password ini)
   - **Region**: Southeast Asia (Singapore) - untuk performa optimal
5. Tunggu project selesai dibuat (~2 menit)

### 2. Setup Database

1. Buka **SQL Editor** di dashboard Supabase
2. Jalankan query SQL berikut untuk membuat tabel:

```sql
-- Tabel Guru
CREATE TABLE guru (
  id BIGSERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  mata_pelajaran VARCHAR(255) NOT NULL,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Siswa
CREATE TABLE siswa (
  id BIGSERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  kelas VARCHAR(50) NOT NULL,
  nip VARCHAR(50) UNIQUE NOT NULL,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Berita
CREATE TABLE berita (
  id BIGSERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  isi TEXT NOT NULL,
  gambar_url TEXT,
  tanggal_publish TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  slug VARCHAR(255) UNIQUE
);
```

3. Klik "Run" untuk menjalankan query

### 3. Setup Storage

1. Buka **Storage** di sidebar Supabase
2. Buat 3 bucket baru:
   - Nama: `guru-photos` → Public bucket
   - Nama: `siswa-photos` → Public bucket
   - Nama: `berita-images` → Public bucket

**Cara membuat bucket:**

- Klik "New bucket"
- Masukkan nama bucket
- Toggle "Public bucket" menjadi ON
- Klik "Create bucket"

### 4. Setup Row Level Security (RLS) - Opsional

Untuk production, aktifkan RLS dengan policy berikut:

```sql
-- Enable RLS untuk semua tabel
ALTER TABLE guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

-- Policy: Public dapat read semua data
CREATE POLICY "Public can read guru" ON guru FOR SELECT USING (true);
CREATE POLICY "Public can read siswa" ON siswa FOR SELECT USING (true);
CREATE POLICY "Public can read berita" ON berita FOR SELECT USING (true);

-- Policy: Public dapat insert/update/delete (untuk demo)
-- Untuk production, ganti dengan auth check
CREATE POLICY "Public can insert guru" ON guru FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update guru" ON guru FOR UPDATE USING (true);
CREATE POLICY "Public can delete guru" ON guru FOR DELETE USING (true);

CREATE POLICY "Public can insert siswa" ON siswa FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update siswa" ON siswa FOR UPDATE USING (true);
CREATE POLICY "Public can delete siswa" ON siswa FOR DELETE USING (true);

CREATE POLICY "Public can insert berita" ON berita FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update berita" ON berita FOR UPDATE USING (true);
CREATE POLICY "Public can delete berita" ON berita FOR DELETE USING (true);
```

### 5. Dapatkan API Keys

1. Buka **Settings** → **API**
2. Salin nilai berikut:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (API Key)

### 6. Konfigurasi Project

1. Buka file `js/config.js`
2. Ganti nilai berikut dengan credentials Supabase Anda:

```javascript
const SUPABASE_URL = "https://xxxxx.supabase.co"; // Ganti dengan Project URL Anda
const SUPABASE_ANON_KEY = "eyJhbGc..."; // Ganti dengan anon public key Anda
```

## Cara Menjalankan

### Opsi 1: Live Server (Recommended)

1. Install extension **Live Server** di VS Code
2. Klik kanan pada `index.html`
3. Pilih "Open with Live Server"
4. Website akan terbuka di browser

### Opsi 2: Python Simple HTTP Server

```bash
# Python 3
python -m http.server 8000

# Buka browser: http://localhost:8000
```

### Opsi 3: Node.js HTTP Server

```bash
# Install http-server globally
npm install -g http-server

# Jalankan server
http-server

# Buka browser: http://localhost:8080
```

### Opsi 4: Langsung Buka File

Cukup buka file `index.html` di browser. Namun beberapa fitur mungkin tidak bekerja karena CORS policy.

## Deployment

Website ini dapat di-deploy ke:

- **Netlify**: Drag & drop folder project
- **Vercel**: Import dari GitHub
- **GitHub Pages**: Push ke repository dan aktifkan Pages
- **Firebase Hosting**: Deploy dengan Firebase CLI

### Deploy ke Netlify (Tercepat)

1. Buka [netlify.com](https://netlify.com)
2. Drag & drop folder `website_sekolah` ke Netlify
3. Website langsung live!

## Testing

### Test CRUD Guru

1. Buka halaman **Data Guru**
2. Klik "Tambah Guru"
3. Isi form dan upload foto
4. Klik "Simpan" → Data muncul di tabel
5. Test Edit dan Hapus

### Test CRUD Siswa

1. Buka halaman **Data Siswa**
2. Lakukan operasi serupa dengan Data Guru
3. Pastikan NIP unik (tidak boleh duplikat)

### Test Berita

1. Buka halaman **Berita Sekolah**
2. Tambah artikel dengan gambar
3. Klik "Baca" untuk melihat detail
4. Test Edit dan Hapus berita

## Troubleshooting

### Error: "Failed to fetch"

- Pastikan Supabase credentials sudah benar di `js/config.js`
- Cek koneksi internet
- Pastikan project Supabase masih aktif

### Upload gambar gagal

- Pastikan bucket sudah dibuat dan di-set sebagai Public
- Cek ukuran file (max 5MB)
- Pastikan format file: JPG, PNG, atau GIF

### Tabel kosong / data tidak muncul

- Buka Supabase Dashboard → Table Editor
- Pastikan tabel sudah dibuat dengan benar
- Cek RLS policies (disable untuk testing)

### CORS Error

- Jangan buka file HTML langsung, gunakan local server
- Gunakan Live Server atau http-server

## Custom Storage Bucket Policies

Jika upload gagal, set policy untuk storage buckets:

1. Buka **Storage** → Pilih bucket → **Policies**
2. Tambah policy berikut:

```sql
-- Allow public to upload files
CREATE POLICY "Public can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'guru-photos');

-- Allow public to read files
CREATE POLICY "Public can read"
ON storage.objects FOR SELECT
USING (bucket_id = 'guru-photos');

-- Allow public to delete files
CREATE POLICY "Public can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'guru-photos');
```

Ulangi untuk bucket `siswa-photos` dan `berita-images`.

## Lisensi

MIT License - Free to use and modify

## Kontributor

Dibuat dengan ❤️ untuk pembelajaran web development

## Support

Jika ada pertanyaan atau issue, silakan buat issue di repository ini.
