'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/RichTextEditor';

export default function EditPageForm({ page }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: page.title,
        slug: page.slug,
        content: page.content,
        showInMenu: page.showInMenu,
        sortOrder: page.sortOrder,
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/pages/${page._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update page');
            }

            router.push('/admin/pages');
            router.refresh();
        } catch (err) {
            setError(err.message);
        }
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`/api/pages/${page._id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete page');
            }

            router.push('/admin/pages');
            router.refresh();
        } catch (err) {
            setError(err.message);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Edit Page Form</h3>
                        <button className="btn btn-danger btn-sm float-right" onClick={handleDeleteClick}>Delete Page</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            {showDeleteConfirm && (
                                <div className="alert alert-warning">
                                    <h4>Are you sure you want to delete this page?</h4>
                                    <p>This action cannot be undone.</p>
                                    <button type="button" className="btn btn-danger mr-2" onClick={confirmDelete}>Yes, Delete</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Slug</label>
                                <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input className="custom-control-input" type="checkbox" id="showInMenu" name="showInMenu" checked={formData.showInMenu} onChange={handleChange} />
                                    <label htmlFor="showInMenu" className="custom-control-label">Show in Menu</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Sort Order</label>
                                <input type="number" className="form-control" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <RichTextEditor value={formData.content} onChange={(content) => setFormData({ ...formData, content })} />
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
