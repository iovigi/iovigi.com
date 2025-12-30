'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/RichTextEditor';
import ImageUploader from '@/app/components/ImageUploader';

export default function CreatePost() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create post');
            }

            router.push('/admin/posts');
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
                        <h1>Create Post</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">New Post Form</h3>
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
                                        <label>Excerpt</label>
                                        <textarea className="form-control" name="excerpt" rows="2" value={formData.excerpt} onChange={handleChange}></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Content</label>
                                        <RichTextEditor value={formData.content} onChange={(content) => setFormData({ ...formData, content })} />
                                    </div>
                                    <div className="form-group">
                                        <ImageUploader value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
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
