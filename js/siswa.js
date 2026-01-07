// Data Siswa CRUD Operations

let currentEditId = null;

// Load all siswa data
async function loadSiswaData() {
    showLoading('table-container');

    try {
        const { data, error } = await supabaseClient
            .from(TABLES.SISWA)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading data:', error);
            showToast('Gagal memuat data siswa', 'error');
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
                <p class="text-lg">Belum ada data siswa</p>
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
    `;

    data.forEach((siswa, index) => {
        tableHTML += `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${index + 1}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${siswa.nama}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${siswa.kelas}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${siswa.nip}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${siswa.foto_url
                        ? `<img src="${siswa.foto_url}" alt="${siswa.nama}" class="h-12 w-12 rounded-full object-cover">`
                        : `<div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <i class="fas fa-user text-gray-400"></i>
                           </div>`
                    }
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="editSiswa(${siswa.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteSiswa(${siswa.id}, '${siswa.foto_url || ''}')" class="text-red-600 hover:text-red-900">
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
    document.getElementById('modalTitle').textContent = 'Tambah Siswa';
    document.getElementById('siswaForm').reset();
    document.getElementById('siswaId').value = '';
    document.getElementById('currentFotoUrl').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    openModal('siswaModal');
}

// Close modal
function closeSiswaModal() {
    closeModal('siswaModal');
    resetForm('siswaForm');
    currentEditId = null;
}

// Handle form submit
async function handleSubmit(event) {
    event.preventDefault();

    const nama = document.getElementById('namaSiswa').value.trim();
    const kelas = document.getElementById('kelas').value.trim();
    const nip = document.getElementById('nipSiswa').value.trim();
    const fotoFile = document.getElementById('fotoSiswa').files[0];
    const currentFotoUrl = document.getElementById('currentFotoUrl').value;
    const siswaId = document.getElementById('siswaId').value;

    if (!nama || !kelas || !nip) {
        showToast('Semua field harus diisi', 'error');
        return;
    }

    let fotoUrl = currentFotoUrl;

    // Upload new photo if selected
    if (fotoFile) {
        const uploadedUrl = await uploadImage(fotoFile, STORAGE_BUCKETS.SISWA);
        if (uploadedUrl) {
            // Delete old photo if exists
            if (currentFotoUrl) {
                await deleteImage(currentFotoUrl, STORAGE_BUCKETS.SISWA);
            }
            fotoUrl = uploadedUrl;
        }
    }

    const siswaData = {
        nama,
        kelas,
        nip,
        foto_url: fotoUrl
    };

    try {
        if (siswaId) {
            // Update
            const { error } = await supabaseClient
                .from(TABLES.SISWA)
                .update(siswaData)
                .eq('id', siswaId);

            if (error) {
                console.error('Update error:', error);
                showToast('Gagal mengupdate data siswa', 'error');
                return;
            }

            showToast('Data siswa berhasil diupdate', 'success');
        } else {
            // Insert
            const { error } = await supabaseClient
                .from(TABLES.SISWA)
                .insert([siswaData]);

            if (error) {
                console.error('Insert error:', error);
                showToast('Gagal menambahkan data siswa', 'error');
                return;
            }

            showToast('Data siswa berhasil ditambahkan', 'success');
        }

        closeSiswaModal();
        loadSiswaData();
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}

// Edit siswa
async function editSiswa(id) {
    try {
        const { data, error } = await supabaseClient
            .from(TABLES.SISWA)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error:', error);
            showToast('Gagal memuat data siswa', 'error');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Edit Siswa';
        document.getElementById('siswaId').value = data.id;
        document.getElementById('namaSiswa').value = data.nama;
        document.getElementById('kelas').value = data.kelas;
        document.getElementById('nipSiswa').value = data.nip;
        document.getElementById('currentFotoUrl').value = data.foto_url || '';

        if (data.foto_url) {
            const preview = document.getElementById('imagePreview');
            preview.src = data.foto_url;
            preview.classList.remove('hidden');
        }

        openModal('siswaModal');
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}

// Delete siswa
async function deleteSiswa(id, fotoUrl) {
    if (!confirmDialog('Apakah Anda yakin ingin menghapus data siswa ini?')) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from(TABLES.SISWA)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            showToast('Gagal menghapus data siswa', 'error');
            return;
        }

        // Delete photo from storage
        if (fotoUrl) {
            await deleteImage(fotoUrl, STORAGE_BUCKETS.SISWA);
        }

        showToast('Data siswa berhasil dihapus', 'success');
        loadSiswaData();
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan', 'error');
    }
}
