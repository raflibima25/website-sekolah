// Berita CRUD Operations

let currentEditId = null;

// Load all berita data
async function loadBeritaData() {
    const container = document.getElementById('berita-container');
    container.innerHTML = '<div class="col-span-full flex justify-center items-center py-8"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>';

    try {
        const { data, error } = await supabaseClient
            .from(TABLES.BERITA)
            .select('*')
            .order('tanggal_publish', { ascending: false });

        if (error) {
            console.error('Error loading data:', error);
            showToast('Gagal memuat berita', 'error');
            return;
        }

        renderBeritaCards(data);
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan saat memuat berita', 'error');
    }
}

// Render berita cards
function renderBeritaCards(data) {
    const container = document.getElementById('berita-container');

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="col-span-full p-8 text-center text-gray-500">
                <i class="fas fa-newspaper text-5xl mb-4"></i>
                <p class="text-lg">Belum ada berita</p>
            </div>
        `;
        return;
    }

    let cardsHTML = '';

    data.forEach((berita) => {
        const excerpt = berita.isi.length > 150 ? berita.isi.substring(0, 150) + '...' : berita.isi;
        const tanggal = formatDate(berita.tanggal_publish);

        cardsHTML += `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                ${berita.gambar_url
                    ? `<img src="${berita.gambar_url}" alt="${berita.judul}" class="w-full h-48 object-cover">`
                    : `<div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <i class="fas fa-image text-gray-400 text-5xl"></i>
                       </div>`
                }
                <div class="p-6">
                    <div class="text-sm text-gray-500 mb-2">
                        <i class="far fa-calendar mr-1"></i>${tanggal}
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">${berita.judul}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">${excerpt}</p>
                    <div class="flex space-x-2">
                        <button onclick="viewDetail(${berita.id})" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm">
                            <i class="fas fa-eye mr-1"></i>Baca
                        </button>
                        <button onclick="editBerita(${berita.id})" class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition text-sm">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteBerita(${berita.id}, '${berita.gambar_url || ''}')" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition text-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = cardsHTML;
}

// View detail
async function viewDetail(id) {
    try {
        const { data, error } = await supabaseClient
            .from(TABLES.BERITA)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error:', error);
            showToast('Gagal memuat detail berita', 'error');
            return;
        }

        document.getElementById('detailTitle').textContent = data.judul;
        const detailContent = document.getElementById('detailContent');

        detailContent.innerHTML = `
            <div class="mb-4 text-gray-500">
                <i class="far fa-calendar mr-2"></i>${formatDate(data.tanggal_publish)}
            </div>
            ${data.gambar_url
                ? `<img src="${data.gambar_url}" alt="${data.judul}" class="w-full h-64 object-cover rounded-lg mb-6">`
                : ''
            }
            <div class="prose max-w-none">
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">${data.isi}</p>
            </div>
        `;

        openModal('detailModal');
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}

// Open add modal
function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Berita';
    document.getElementById('beritaForm').reset();
    document.getElementById('beritaId').value = '';
    document.getElementById('currentGambarUrl').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    openModal('beritaModal');
}

// Close modal
function closeBeritaModal() {
    closeModal('beritaModal');
    resetForm('beritaForm');
    currentEditId = null;
}

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Handle form submit
async function handleSubmit(event) {
    event.preventDefault();

    const judul = document.getElementById('judulBerita').value.trim();
    const isi = document.getElementById('isiBerita').value.trim();
    const gambarFile = document.getElementById('gambarBerita').files[0];
    const currentGambarUrl = document.getElementById('currentGambarUrl').value;
    const beritaId = document.getElementById('beritaId').value;

    if (!judul || !isi) {
        showToast('Judul dan isi artikel harus diisi', 'error');
        return;
    }

    let gambarUrl = currentGambarUrl;

    // Upload new image if selected
    if (gambarFile) {
        const uploadedUrl = await uploadImage(gambarFile, STORAGE_BUCKETS.BERITA);
        if (uploadedUrl) {
            // Delete old image if exists
            if (currentGambarUrl) {
                await deleteImage(currentGambarUrl, STORAGE_BUCKETS.BERITA);
            }
            gambarUrl = uploadedUrl;
        }
    }

    const slug = generateSlug(judul);

    const beritaData = {
        judul,
        isi,
        gambar_url: gambarUrl,
        slug: slug + '-' + Date.now()
    };

    try {
        if (beritaId) {
            // Update
            const { error } = await supabaseClient
                .from(TABLES.BERITA)
                .update(beritaData)
                .eq('id', beritaId);

            if (error) {
                console.error('Update error:', error);
                showToast('Gagal mengupdate berita', 'error');
                return;
            }

            showToast('Berita berhasil diupdate', 'success');
        } else {
            // Insert
            const { error } = await supabaseClient
                .from(TABLES.BERITA)
                .insert([beritaData]);

            if (error) {
                console.error('Insert error:', error);
                showToast('Gagal menambahkan berita', 'error');
                return;
            }

            showToast('Berita berhasil dipublish', 'success');
        }

        closeBeritaModal();
        loadBeritaData();
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}

// Edit berita
async function editBerita(id) {
    try {
        const { data, error } = await supabaseClient
            .from(TABLES.BERITA)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error:', error);
            showToast('Gagal memuat data berita', 'error');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Edit Berita';
        document.getElementById('beritaId').value = data.id;
        document.getElementById('judulBerita').value = data.judul;
        document.getElementById('isiBerita').value = data.isi;
        document.getElementById('currentGambarUrl').value = data.gambar_url || '';

        if (data.gambar_url) {
            const preview = document.getElementById('imagePreview');
            preview.src = data.gambar_url;
            preview.classList.remove('hidden');
        }

        openModal('beritaModal');
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}

// Delete berita
async function deleteBerita(id, gambarUrl) {
    if (!confirmDialog('Apakah Anda yakin ingin menghapus berita ini?')) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from(TABLES.BERITA)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            showToast('Gagal menghapus berita', 'error');
            return;
        }

        // Delete image from storage
        if (gambarUrl) {
            await deleteImage(gambarUrl, STORAGE_BUCKETS.BERITA);
        }

        showToast('Berita berhasil dihapus', 'success');
        loadBeritaData();
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}
