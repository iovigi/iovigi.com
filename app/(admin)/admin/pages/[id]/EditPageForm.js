'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/RichTextEditor';
import LocalizationTabs from '@/components/LocalizationTabs';

export default function EditPageForm({ page, availableWidgets = [] }) {
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
        title: getLocalizedField(page.title),
        slug: page.slug,
        content: getLocalizedField(page.content),
        showInMenu: page.showInMenu,
        sortOrder: page.sortOrder,
        isVisible: getLocalizedBoolean(page.isVisible, true),
        widgets: page.widgets || []
    });
    const [error, setError] = useState('');

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Handle localized text changes
    const handleLocalizedChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: { ...formData[field], [activeTab]: e.target.value }
        });
    };

    // Handle localized content (RichText)
    const handleLocalizedContentChange = (content, field) => {
        setFormData({
            ...formData,
            [field]: { ...formData[field], [activeTab]: content }
        });
    };

    // Handle localized boolean (checkbox)
    const handleLocalizedCheckboxChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: { ...formData[field], [activeTab]: e.target.checked }
        });
    };

    // Handle global changes
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
                                <label>Content ({activeTab.toUpperCase()})</label>
                                <RichTextEditor
                                    key={activeTab}
                                    value={formData.content[activeTab]}
                                    onChange={(content) => handleLocalizedContentChange(content, 'content')}
                                />
                            </div>

                            <div className="form-group">
                                <label>Widgets</label>
                                {availableWidgets.length === 0 ? <p className="text-muted">No widgets available.</p> : (
                                    availableWidgets.map(widget => (
                                        <div className="custom-control custom-checkbox" key={widget._id}>
                                            <input
                                                className="custom-control-input"
                                                type="checkbox"
                                                id={`widget_${widget._id}`}
                                                checked={formData.widgets.includes(widget._id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    let newWidgets = [...formData.widgets];
                                                    if (checked) {
                                                        newWidgets.push(widget._id);
                                                    } else {
                                                        newWidgets = newWidgets.filter(id => id !== widget._id);
                                                    }
                                                    setFormData({ ...formData, widgets: newWidgets });
                                                }}
                                            />
                                            <label htmlFor={`widget_${widget._id}`} className="custom-control-label">
                                                {widget.key}
                                            </label>
                                        </div>
                                    ))
                                )}
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
