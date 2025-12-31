'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { dictionary } from '@/lib/dictionary';

export default function CommentForm({ postId }) {
    const router = useRouter();
    const { locale } = useLanguage();
    const t = dictionary[locale] || dictionary.en;
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
                body: JSON.stringify({ ...formData, locale }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit comment');
            }

            setSuccess(t.commentSubmitted);
            setFormData({ author: '', content: '', post: postId });
            router.refresh(); // This might not refresh the Client Component list immediately unless we trigger a re-fetch or use router.refresh() combined with the fact that SinglePost is a Server Comp wrapper... wait.
            // SinglePost is now a Server Component wrapping a Client Component. 
            // router.refresh() refreshes the Server Component (which fetches comments), creating a new Client Comp with new props. So it SHOULD work.
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="comment-form">
            <h3>{t.leaveComment}</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" className="form-control" name="author" placeholder={t.namePlaceholder} value={formData.author} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <textarea className="form-control" name="content" rows="4" placeholder={t.commentPlaceholder} value={formData.content} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="btn btn-black">{t.postComment}</button>
            </form>
        </div>
    );
}
