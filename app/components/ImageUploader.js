'use client';

import { useState } from 'react';

export default function ImageUploader({ value, onChange }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }

            const data = await res.json();
            onChange(data.url);
        } catch (error) {
            console.error(error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        // We generally don't delete from server immediately on remove from UI to avoid accidental data loss 
        // before saving the form, though we could implement a cleanup later.
    };

    return (
        <div className="form-group">
            <label>Featured Image</label>

            {value ? (
                <div className="image-preview mb-2">
                    <img
                        src={value}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <button type="button" className="btn btn-danger btn-sm" onClick={handleRemove}>
                        Remove Image
                    </button>
                </div>
            ) : (
                <div className="input-group">
                    <div className="custom-file">
                        <input
                            type="file"
                            className="custom-file-input"
                            id="imageUpload"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        <label className="custom-file-label" htmlFor="imageUpload">
                            {uploading ? 'Uploading...' : 'Choose file'}
                        </label>
                    </div>
                </div>
            )}
            {/* Hidden input to ensure existing forms that might try to read `name="image"` still work if they were using native inputs, 
                though we are passing state so it shouldn't matter for controlled components */}
        </div>
    );
}
