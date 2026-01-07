// Supabase Configuration
// INSTRUKSI:
// 1. Rename file ini menjadi 'config.js'
// 2. Ganti YOUR_SUPABASE_URL dan YOUR_SUPABASE_ANON_KEY dengan kredensial Anda
// 3. Dapatkan kredensial dari Supabase Dashboard -> Settings -> API

const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Contoh: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Anon/Public key

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Storage bucket names
const STORAGE_BUCKETS = {
    GURU: 'guru-photos',
    SISWA: 'siswa-photos',
    BERITA: 'berita-images'
};

// Table names
const TABLES = {
    GURU: 'guru',
    SISWA: 'siswa',
    BERITA: 'berita'
};

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        supabaseClient,
        STORAGE_BUCKETS,
        TABLES
    };
}
