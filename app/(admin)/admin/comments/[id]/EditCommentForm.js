'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditCommentForm({ comment }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        author: comment.author,
        content: comment.content,
        locale: comment.locale || 'en'
    });
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/comments/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update comment');
            }

            router.push('/admin/comments');
            router.refresh();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`/api/comments/${comment._id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete comment');
            }

            router.push('/admin/comments');
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
                        <h3 className="card-title">Edit Comment</h3>
                        <button className="btn btn-danger btn-sm float-right" onClick={handleDeleteClick}>Delete Comment</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            {showDeleteConfirm && (
                                <div className="alert alert-warning">
                                    <h4>Are you sure you want to delete this comment?</h4>
                                    <p>This action cannot be undone.</p>
                                    <button type="button" className="btn btn-danger mr-2" onClick={confirmDelete}>Yes, Delete</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Author</label>
                                <input type="text" className="form-control" name="author" value={formData.author} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Language</label>
                                <select className="form-control" name="locale" value={formData.locale} onChange={handleChange}>
                                    <option value="en">English (EN)</option>
                                    <option value="bg">Bulgarian (BG)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Content</label>
                                <textarea className="form-control" name="content" rows="5" value={formData.content} onChange={handleChange} required></textarea>
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
