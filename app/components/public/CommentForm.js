'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommentForm({ postId }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        author: '',
        content: '',
        post: postId,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit comment');
            }

            setSuccess('Comment submitted!');
            setFormData({ author: '', content: '', post: postId });
            router.refresh();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="comment-form">
            <h3>Leave a Comment</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" className="form-control" name="author" placeholder="Name" value={formData.author} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <textarea className="form-control" name="content" rows="4" placeholder="Your Comment" value={formData.content} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="btn btn-black">Post Comment</button>
            </form>
        </div>
    );
}
