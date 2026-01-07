-- ================================================
-- STORAGE BUCKET POLICIES
-- ================================================
-- Jalankan script ini di Supabase SQL Editor
-- setelah membuat storage buckets:
-- - guru-photos
-- - siswa-photos
-- - berita-images
-- ================================================

-- =====================================
-- GURU PHOTOS BUCKET POLICIES
-- =====================================

-- Allow public to upload files to guru-photos
DROP POLICY IF EXISTS "Public can upload guru photos" ON storage.objects;
CREATE POLICY "Public can upload guru photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'guru-photos');

-- Allow public to read files from guru-photos
DROP POLICY IF EXISTS "Public can read guru photos" ON storage.objects;
CREATE POLICY "Public can read guru photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'guru-photos');

-- Allow public to update files in guru-photos
DROP POLICY IF EXISTS "Public can update guru photos" ON storage.objects;
CREATE POLICY "Public can update guru photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'guru-photos');

-- Allow public to delete files from guru-photos
DROP POLICY IF EXISTS "Public can delete guru photos" ON storage.objects;
CREATE POLICY "Public can delete guru photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'guru-photos');

-- =====================================
-- SISWA PHOTOS BUCKET POLICIES
-- =====================================

-- Allow public to upload files to siswa-photos
DROP POLICY IF EXISTS "Public can upload siswa photos" ON storage.objects;
CREATE POLICY "Public can upload siswa photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'siswa-photos');

-- Allow public to read files from siswa-photos
DROP POLICY IF EXISTS "Public can read siswa photos" ON storage.objects;
CREATE POLICY "Public can read siswa photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'siswa-photos');

-- Allow public to update files in siswa-photos
DROP POLICY IF EXISTS "Public can update siswa photos" ON storage.objects;
CREATE POLICY "Public can update siswa photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'siswa-photos');

-- Allow public to delete files from siswa-photos
DROP POLICY IF EXISTS "Public can delete siswa photos" ON storage.objects;
CREATE POLICY "Public can delete siswa photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'siswa-photos');

-- =====================================
-- BERITA IMAGES BUCKET POLICIES
-- =====================================

-- Allow public to upload files to berita-images
DROP POLICY IF EXISTS "Public can upload berita images" ON storage.objects;
CREATE POLICY "Public can upload berita images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'berita-images');

-- Allow public to read files from berita-images
DROP POLICY IF EXISTS "Public can read berita images" ON storage.objects;
CREATE POLICY "Public can read berita images"
ON storage.objects FOR SELECT
USING (bucket_id = 'berita-images');

-- Allow public to update files in berita-images
DROP POLICY IF EXISTS "Public can update berita images" ON storage.objects;
CREATE POLICY "Public can update berita images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'berita-images');

-- Allow public to delete files from berita-images
DROP POLICY IF EXISTS "Public can delete berita images" ON storage.objects;
CREATE POLICY "Public can delete berita images"
ON storage.objects FOR DELETE
USING (bucket_id = 'berita-images');

-- =====================================
-- VERIFICATION
-- =====================================

SELECT
  'Storage policies created successfully!' as status,
  'Check Supabase Dashboard -> Storage -> Policies to verify' as note;

-- =====================================
-- NOTES:
-- =====================================
-- 1. Pastikan buckets sudah dibuat terlebih dahulu
--    di Supabase Dashboard -> Storage
--
-- 2. Set semua bucket sebagai PUBLIC untuk
--    memudahkan akses file
--
-- 3. Untuk production, ubah policy agar hanya
--    authenticated user yang bisa upload/delete
--
-- 4. Contoh policy untuk authenticated user:
--    CREATE POLICY "Authenticated can upload"
--    ON storage.objects FOR INSERT
--    WITH CHECK (
--      bucket_id = 'guru-photos' AND
--      auth.role() = 'authenticated'
--    );
-- =====================================
