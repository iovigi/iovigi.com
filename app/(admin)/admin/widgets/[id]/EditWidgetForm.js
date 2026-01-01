'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/RichTextEditor';
import LocalizationTabs from '@/components/LocalizationTabs';

export default function EditWidgetForm({ widget }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('en');

    const getLocalizedField = (field, fallback = '') => {
        if (!field) return { en: fallback, bg: fallback };
        if (typeof field === 'string') return { en: field, bg: fallback };
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
        title: getLocalizedField(widget.title),
        key: widget.key,
        content: getLocalizedField(widget.content),
        isVisible: getLocalizedBoolean(widget.isVisible, true)
    });
    const [error, setError] = useState('');

    const handleLocalizedChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: { ...formData[field], [activeTab]: e.target.value }
        });
    };

    const handleLocalizedContentChange = (content, field) => {
        setFormData({
            ...formData,
            [field]: { ...formData[field], [activeTab]: content }
        });
    };

    const handleLocalizedCheckboxChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: { ...formData[field], [activeTab]: e.target.checked }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/widgets/${widget._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update widget');
            }

            router.push('/admin/widgets');
            router.refresh();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Edit Widget: {widget.key}</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="form-group">
                                <label>Key (Read Only)</label>
                                <input type="text" className="form-control" value={formData.key} readOnly disabled />
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
