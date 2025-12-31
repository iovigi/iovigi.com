'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/RichTextEditor';
import ImageUploader from '@/app/components/ImageUploader';
import LocalizationTabs from '@/components/LocalizationTabs';

export default function CreatePost() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('en');
    const [formData, setFormData] = useState({
        title: { en: '', bg: '' },
        slug: '',
        content: { en: '', bg: '' },
        excerpt: { en: '', bg: '' },
        image: '',
        isVisible: { en: true, bg: false }
    });
    const [error, setError] = useState('');

    // Handle nested localized changes
    const handleLocalizedChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: { ...formData[field], [activeTab]: e.target.value }
        });
    };

    // Handle RichText nested localized changes
    const handleLocalizedContentChange = (content, field) => {
        setFormData({
            ...formData,
            [field]: { ...formData[field], [activeTab]: content }
        });
    };

    // Handle Checkbox nested localized changes
    const handleLocalizedCheckboxChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: { ...formData[field], [activeTab]: e.target.checked }
        });
    };

    // Handle top-level changes (slug, image)
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
                                        <label>Slug (URL)</label>
                                        <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} required />
                                        <small className="form-text text-muted">Unique identifier for the URL (e.g. my-first-post). Same for both languages.</small>
                                    </div>

                                    <div className="form-group">
                                        <ImageUploader value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
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
                                            required={activeTab === 'en'} // En required, Bg optional? Or enforce both? 
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
                                        {/* Force re-render of RichTextEditor when tab changes might be needed if it doesn't handle prop updates well. 
                                            Actually RichTextEditor usually updates if value prop changes. 
                                        */}
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
