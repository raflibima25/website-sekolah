// Utility Functions

// Show loading spinner
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="flex justify-center items-center py-8"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>';
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Confirm dialog
function confirmDialog(message) {
    return confirm(message);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Validate file type
function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        showToast('Format file harus JPG, PNG, atau GIF', 'error');
        return false;
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB', 'error');
        return false;
    }

    return true;
}

// Generate unique filename
function generateFileName(originalName) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
}

// Preview image
function previewImage(input, previewElementId) {
    const file = input.files[0];
    if (file && validateImageFile(file)) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewElementId);
            if (preview) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
        return true;
    }
    return false;
}

// Upload image to Supabase Storage
async function uploadImage(file, bucket) {
    if (!validateImageFile(file)) {
        return null;
    }

    const fileName = generateFileName(file.name);

    try {
        const { data, error } = await supabaseClient.storage
            .from(bucket)
            .upload(fileName, file);

        if (error) {
            console.error('Upload error:', error);
            showToast('Gagal mengunggah gambar', 'error');
            return null;
        }

        // Get public URL
        const { data: urlData } = supabaseClient.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Gagal mengunggah gambar', 'error');
        return null;
    }
}

// Delete image from Supabase Storage
async function deleteImage(imageUrl, bucket) {
    if (!imageUrl) return true;

    try {
        // Extract filename from URL
        const fileName = imageUrl.split('/').pop();

        const { error } = await supabaseClient.storage
            .from(bucket)
            .remove([fileName]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete error:', error);
        return false;
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Reset form
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}
