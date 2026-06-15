'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/RichTextEditor';
import ImageUploader from '@/app/components/ImageUploader';
import LocalizationTabs from '@/components/LocalizationTabs';

export default function EditPostForm({ post }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('en');

    // Helper to ensure we have the correct structure
    const getLocalizedField = (field, fallback = '') => {
        if (!field) return { en: fallback, bg: fallback };
        if (typeof field === 'string') return { en: field, bg: fallback }; // Legacy fallback
        return {
            en: field.en || fallback,
            bg: field.bg || fallback
        };
    };

    const getLocalizedBoolean = (field, fallback = true) => {
        if (typeof field === 'boolean') return { en: field, bg: false };
        if (!field) return { en: fallback, bg: false };
        return {
            en: field.en !== undefined ? field.en : fallback,
            bg: field.bg !== undefined ? field.bg : false
        };
    }

    const [formData, setFormData] = useState({
        title: getLocalizedField(post.title),
        slug: post.slug,
        content: getLocalizedField(post.content),
        excerpt: getLocalizedField(post.excerpt),
        image: post.image || '',
        isVisible: getLocalizedBoolean(post.isVisible, true),
        // Convert DB ISO date to the 'YYYY-MM-DDTHH:mm' format required by datetime-local input.
        scheduledAt: post.scheduledAt
            ? new Date(post.scheduledAt).toISOString().slice(0, 16)
            : ''
    });
    const [error, setError] = useState('');

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Handle localized text changes
    const handleLocalizedChange = (e, field) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [activeTab]: value }
        }));
    };

    // Handle localized content (RichText)
    const handleLocalizedContentChange = (content, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [activeTab]: content }
        }));
    };

    // Handle localized boolean (checkbox)
    const handleLocalizedCheckboxChange = (e, field) => {
        const { checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [activeTab]: checked }
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
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
                                <label>Slug</label>
                                <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <ImageUploader value={formData.image} onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} />
                            </div>

                            {/* ── Scheduled Publishing ── */}
                            <div className="form-group">
                                <label htmlFor="scheduledAt">
                                    <i className="fas fa-clock mr-1"></i> Schedule Publication
                                </label>
                                {/* Status badge */}
                                {(() => {
                                    const now = new Date();
                                    const scheduled = formData.scheduledAt ? new Date(formData.scheduledAt) : null;
                                    const isVisibleAny = formData.isVisible?.en || formData.isVisible?.bg;
                                    if (scheduled && scheduled > now) {
                                        return (
                                            <div className="mb-2">
                                                <span className="badge badge-warning" style={{ fontSize: '0.85rem' }}>
                                                    <i className="fas fa-hourglass-half mr-1"></i>
                                                    Scheduled &mdash; goes live: {scheduled.toLocaleString()}
                                                </span>
                                            </div>
                                        );
                                    } else if (scheduled && scheduled <= now) {
                                        return (
                                            <div className="mb-2">
                                                <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                                                    <i className="fas fa-check-circle mr-1"></i>
                                                    Published (schedule passed)
                                                </span>
                                            </div>
                                        );
                                    } else if (isVisibleAny) {
                                        return (
                                            <div className="mb-2">
                                                <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                                                    <i className="fas fa-eye mr-1"></i>
                                                    Published
                                                </span>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="mb-2">
                                                <span className="badge badge-secondary" style={{ fontSize: '0.85rem' }}>
                                                    <i className="fas fa-eye-slash mr-1"></i>
                                                    Draft
                                                </span>
                                            </div>
                                        );
                                    }
                                })()}
                                <input
                                    type="datetime-local"
                                    id="scheduledAt"
                                    className="form-control"
                                    name="scheduledAt"
                                    value={formData.scheduledAt}
                                    onChange={handleChange}
                                />
                                <small className="form-text text-muted">
                                    Leave empty to publish based on visibility. Set a future date/time to schedule.
                                </small>
                                {formData.scheduledAt && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-link text-danger p-0 mt-1"
                                        onClick={() => setFormData(prev => ({ ...prev, scheduledAt: '' }))}
                                    >
                                        <i className="fas fa-times mr-1"></i>Clear schedule
                                    </button>
                                )}
                            </div>

                            <hr />
                            <LocalizationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                            <div className="form-group">
                                <div className="custom-control custom-switch">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id={`isVisible_${activeTab}`}
                                        checked={formData.isVisible[activeTab]}
                                        onChange={(e) => handleLocalizedCheckboxChange(e, 'isVisible')}
                                    />
                                    <label className="custom-control-label" htmlFor={`isVisible_${activeTab}`}>Visible in {activeTab === 'en' ? 'English' : 'Bulgarian'}</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Title ({activeTab.toUpperCase()})</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.title[activeTab]}
                                    onChange={(e) => handleLocalizedChange(e, 'title')}
                                    required={activeTab === 'en'}
                                />
                            </div>

                            <div className="form-group">
                                <label>Excerpt ({activeTab.toUpperCase()})</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={formData.excerpt[activeTab]}
                                    onChange={(e) => handleLocalizedChange(e, 'excerpt')}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Content ({activeTab.toUpperCase()})</label>
                                <RichTextEditor
                                    key={activeTab}
                                    value={formData.content[activeTab]}
                                    onChange={(content) => handleLocalizedContentChange(content, 'content')}
                                />
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
