// Data Guru CRUD Operations

let currentEditId = null;

// Load all guru data
async function loadGuruData() {
    showLoading('table-container');

    try {
        const { data, error } = await supabaseClient
            .from(TABLES.GURU)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading data:', error);
            showToast('Gagal memuat data guru', 'error');
            return;
        }

        renderTable(data);
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan saat memuat data', 'error');
    }
}

// Render table
function renderTable(data) {
    const container = document.getElementById('table-container');

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center text-gray-500">
                <i class="fas fa-inbox text-5xl mb-4"></i>
                <p class="text-lg">Belum ada data guru</p>
            </div>
        `;
        return;
    }

    let tableHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Guru</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
    `;

    data.forEach((guru, index) => {
        tableHTML += `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${index + 1}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${guru.nama}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${guru.mata_pelajaran}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${guru.foto_url
                        ? `<img src="${guru.foto_url}" alt="${guru.nama}" class="h-12 w-12 rounded-full object-cover">`
                        : `<div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <i class="fas fa-user text-gray-400"></i>
                           </div>`
                    }
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="editGuru(${guru.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteGuru(${guru.id}, '${guru.foto_url || ''}')" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
}

// Open add modal
function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Guru';
    document.getElementById('guruForm').reset();
    document.getElementById('guruId').value = '';
    document.getElementById('currentFotoUrl').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    openModal('guruModal');
}

// Close modal
function closeGuruModal() {
    closeModal('guruModal');
    resetForm('guruForm');
    currentEditId = null;
}

// Handle form submit
async function handleSubmit(event) {
    event.preventDefault();

    const nama = document.getElementById('namaGuru').value.trim();
    const mataPelajaran = document.getElementById('mataPelajaran').value.trim();
    const fotoFile = document.getElementById('fotoGuru').files[0];
    const currentFotoUrl = document.getElementById('currentFotoUrl').value;
    const guruId = document.getElementById('guruId').value;

    if (!nama || !mataPelajaran) {
        showToast('Nama dan mata pelajaran harus diisi', 'error');
        return;
    }

    let fotoUrl = currentFotoUrl;

    // Upload new photo if selected
    if (fotoFile) {
        const uploadedUrl = await uploadImage(fotoFile, STORAGE_BUCKETS.GURU);
        if (uploadedUrl) {
            // Delete old photo if exists
            if (currentFotoUrl) {
                await deleteImage(currentFotoUrl, STORAGE_BUCKETS.GURU);
            }
            fotoUrl = uploadedUrl;
        }
    }

    const guruData = {
        nama,
        mata_pelajaran: mataPelajaran,
        foto_url: fotoUrl
    };

    try {
        if (guruId) {
            // Update
            const { error } = await supabaseClient
                .from(TABLES.GURU)
                .update(guruData)
                .eq('id', guruId);

            if (error) {
                console.error('Update error:', error);
                showToast('Gagal mengupdate data guru', 'error');
                return;
            }

            showToast('Data guru berhasil diupdate', 'success');
        } else {
            // Insert
            const { error } = await supabaseClient
                .from(TABLES.GURU)
                .insert([guruData]);

            if (error) {
                console.error('Insert error:', error);
                showToast('Gagal menambahkan data guru', 'error');
                return;
            }

            showToast('Data guru berhasil ditambahkan', 'success');
        }

        closeGuruModal();
        loadGuruData();
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}

// Edit guru
async function editGuru(id) {
    try {
        const { data, error } = await supabaseClient
            .from(TABLES.GURU)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error:', error);
            showToast('Gagal memuat data guru', 'error');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Edit Guru';
        document.getElementById('guruId').value = data.id;
        document.getElementById('namaGuru').value = data.nama;
        document.getElementById('mataPelajaran').value = data.mata_pelajaran;
        document.getElementById('currentFotoUrl').value = data.foto_url || '';

        if (data.foto_url) {
            const preview = document.getElementById('imagePreview');
            preview.src = data.foto_url;
            preview.classList.remove('hidden');
        }

        openModal('guruModal');
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}

// Delete guru
async function deleteGuru(id, fotoUrl) {
    if (!confirmDialog('Apakah Anda yakin ingin menghapus data guru ini?')) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from(TABLES.GURU)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            showToast('Gagal menghapus data guru', 'error');
            return;
        }

        // Delete photo from storage
        if (fotoUrl) {
            await deleteImage(fotoUrl, STORAGE_BUCKETS.GURU);
        }

        showToast('Data guru berhasil dihapus', 'success');
        loadGuruData();
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}
