'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/RichTextEditor';

export default function CreatePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        showInMenu: true,
        sortOrder: 0,
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create page');
            }

            router.push('/admin/pages');
            router.refresh();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Create Page</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">New Page Form</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    {error && <div className="alert alert-danger">{error}</div>}
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
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
