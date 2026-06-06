'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsForm({ initialSettings }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        google_analytics: initialSettings.google_analytics || '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update settings');
            }

            setSuccess('Settings updated successfully!');
            router.refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card card-primary card-outline">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fas fa-cog mr-2 text-primary"></i>
                            General Settings
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <div className="form-group">
                                <label htmlFor="google_analytics">Google Analytics Code (HTML Snippet)</label>
                                <textarea
                                    name="google_analytics"
                                    id="google_analytics"
                                    className="form-control"
                                    rows="10"
                                    placeholder="<!-- Google tag (gtag.js) -->&#10;<script async src=&quot;https://www.googletagmanager.com/gtag/js?id=G-XXXXXX&quot;></script>&#10;<script>&#10;  window.dataLayer = window.dataLayer || [];&#10;  ...&#10;</script>"
                                    value={formData.google_analytics}
                                    onChange={handleChange}
                                    style={{ fontFamily: 'monospace', fontSize: '14px' }}
                                />
                                <small className="form-text text-muted mt-2">
                                    <strong>EN:</strong> Paste the full Google Analytics tag tracking snippet (including the <code>&lt;script&gt;</code> tags). It will be injected automatically into the public site layout. Leave blank to disable.
                                    <br />
                                    <strong>BG:</strong> Поставете пълния проследяващ код от Google Analytics (заедно със <code>&lt;script&gt;</code> таговете). Той ще бъде добавен автоматично в публичния изглед на сайта. Оставете празно за деактивиране.
                                </small>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-1"></i> Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-1"></i> Save Settings
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
