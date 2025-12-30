'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/RichTextEditor';
import ImageUploader from '@/app/components/ImageUploader';

export default function EditPostForm({ post }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        image: post.image || '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update post');
            }

            router.push('/admin/posts');
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
            const res = await fetch(`/api/posts/${post._id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete post');
            }

            router.push('/admin/posts');
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
                        <h3 className="card-title">Edit Post Form</h3>
                        <button className="btn btn-danger btn-sm float-right" onClick={handleDeleteClick}>Delete Post</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            {showDeleteConfirm && (
                                <div className="alert alert-warning">
                                    <h4>Are you sure you want to delete this post?</h4>
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
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
