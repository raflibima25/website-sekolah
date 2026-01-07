-- ================================================
-- SETUP DATABASE WEBSITE SEKOLAH
-- ================================================
-- Jalankan script ini di Supabase SQL Editor
-- untuk membuat tabel dan policies yang diperlukan
-- ================================================

-- =====================================
-- 1. CREATE TABLES
-- =====================================

-- Tabel Guru
CREATE TABLE IF NOT EXISTS guru (
  id BIGSERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  mata_pelajaran VARCHAR(255) NOT NULL,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Siswa
CREATE TABLE IF NOT EXISTS siswa (
  id BIGSERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  kelas VARCHAR(50) NOT NULL,
  nip VARCHAR(50) UNIQUE NOT NULL,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Berita
CREATE TABLE IF NOT EXISTS berita (
  id BIGSERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  isi TEXT NOT NULL,
  gambar_url TEXT,
  tanggal_publish TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  slug VARCHAR(255) UNIQUE
);

-- =====================================
-- 2. CREATE INDEXES (untuk performa)
-- =====================================

CREATE INDEX IF NOT EXISTS idx_guru_nama ON guru(nama);
CREATE INDEX IF NOT EXISTS idx_siswa_nama ON siswa(nama);
CREATE INDEX IF NOT EXISTS idx_siswa_nip ON siswa(nip);
CREATE INDEX IF NOT EXISTS idx_berita_tanggal ON berita(tanggal_publish DESC);
CREATE INDEX IF NOT EXISTS idx_berita_slug ON berita(slug);

-- =====================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================

ALTER TABLE guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

-- =====================================
-- 4. CREATE RLS POLICIES
-- =====================================

-- Policies untuk Guru
DROP POLICY IF EXISTS "Public can read guru" ON guru;
CREATE POLICY "Public can read guru"
  ON guru FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can insert guru" ON guru;
CREATE POLICY "Public can insert guru"
  ON guru FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update guru" ON guru;
CREATE POLICY "Public can update guru"
  ON guru FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Public can delete guru" ON guru;
CREATE POLICY "Public can delete guru"
  ON guru FOR DELETE
  USING (true);

-- Policies untuk Siswa
DROP POLICY IF EXISTS "Public can read siswa" ON siswa;
CREATE POLICY "Public can read siswa"
  ON siswa FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can insert siswa" ON siswa;
CREATE POLICY "Public can insert siswa"
  ON siswa FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update siswa" ON siswa;
CREATE POLICY "Public can update siswa"
  ON siswa FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Public can delete siswa" ON siswa;
CREATE POLICY "Public can delete siswa"
  ON siswa FOR DELETE
  USING (true);

-- Policies untuk Berita
DROP POLICY IF EXISTS "Public can read berita" ON berita;
CREATE POLICY "Public can read berita"
  ON berita FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can insert berita" ON berita;
CREATE POLICY "Public can insert berita"
  ON berita FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update berita" ON berita;
CREATE POLICY "Public can update berita"
  ON berita FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Public can delete berita" ON berita;
CREATE POLICY "Public can delete berita"
  ON berita FOR DELETE
  USING (true);

-- =====================================
-- 5. INSERT SAMPLE DATA (Optional)
-- =====================================

-- Sample Guru
INSERT INTO guru (nama, mata_pelajaran) VALUES
  ('Ahmad Santoso, S.Pd', 'Matematika'),
  ('Siti Nurhaliza, S.Si', 'Fisika'),
  ('Budi Setiawan, S.Kom', 'Informatika'),
  ('Rina Wijaya, S.S', 'Bahasa Indonesia'),
  ('Dedi Kurniawan, S.Pd', 'Bahasa Inggris')
ON CONFLICT DO NOTHING;

-- Sample Siswa
INSERT INTO siswa (nama, kelas, nip) VALUES
  ('Andi Pratama', 'X IPA 1', '2024001'),
  ('Dewi Lestari', 'X IPA 1', '2024002'),
  ('Fajar Ramadhan', 'X IPA 2', '2024003'),
  ('Siska Amelia', 'XI IPS 1', '2024004'),
  ('Rudi Hermawan', 'XII IPA 1', '2024005')
ON CONFLICT (nip) DO NOTHING;

-- Sample Berita
INSERT INTO berita (judul, isi, slug) VALUES
  (
    'Pembukaan Tahun Ajaran Baru 2026/2027',
    'Sekolah kami dengan bangga mengumumkan pembukaan tahun ajaran baru 2026/2027. Kegiatan dimulai dengan upacara bendera yang diikuti oleh seluruh siswa, guru, dan staff sekolah. Kepala sekolah memberikan sambutan dan motivasi kepada siswa baru untuk semangat dalam menuntut ilmu.',
    'pembukaan-tahun-ajaran-baru-2026-2027-' || EXTRACT(EPOCH FROM NOW())::bigint
  ),
  (
    'Lomba Sains Tingkat Nasional',
    'Tim olimpiade sains sekolah kami berhasil meraih medali emas pada lomba sains tingkat nasional yang diadakan di Jakarta. Prestasi ini merupakan bukti dedikasi dan kerja keras para siswa dan pembimbing. Selamat kepada para juara!',
    'lomba-sains-tingkat-nasional-' || EXTRACT(EPOCH FROM NOW())::bigint
  ),
  (
    'Tata Tertib Siswa Tahun Ajaran 2026',
    'Dalam rangka menciptakan lingkungan belajar yang kondusif, sekolah mengingatkan kembali tata tertib yang harus dipatuhi oleh seluruh siswa. Mulai dari ketepatan waktu, seragam, hingga etika dalam berperilaku. Mari kita jaga nama baik sekolah bersama-sama.',
    'tata-tertib-siswa-tahun-ajaran-2026-' || EXTRACT(EPOCH FROM NOW())::bigint
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================
-- 6. VERIFICATION
-- =====================================

-- Check tables created
SELECT
  'Tables created successfully!' as status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('guru', 'siswa', 'berita')) as table_count;

-- Check sample data
SELECT 'Guru count:' as info, COUNT(*) as count FROM guru
UNION ALL
SELECT 'Siswa count:' as info, COUNT(*) as count FROM siswa
UNION ALL
SELECT 'Berita count:' as info, COUNT(*) as count FROM berita;

-- =====================================
-- NOTES:
-- =====================================
-- 1. Jangan lupa buat Storage Buckets:
--    - guru-photos (Public)
--    - siswa-photos (Public)
--    - berita-images (Public)
--
-- 2. Untuk production, ganti RLS policies
--    agar hanya authenticated user yang bisa
--    insert/update/delete
--
-- 3. Backup database secara berkala!
-- =====================================
