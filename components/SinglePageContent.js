'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function SinglePageContent({ page }) {
    const { locale } = useLanguage();

    // Safety check if page.title is legacy string or object
    const title = page.title?.[locale] || page.title?.en || (typeof page.title === 'string' ? page.title : 'Untitled');
    const content = page.content?.[locale] || page.content?.en || (typeof page.content === 'string' ? page.content : '');

    return (
        <section id="content">
            <div className="container">
                <div className="row">
                    <div className={page.widgets && page.widgets.length > 0 ? "col-md-9" : "col-md-12"}>
                        <div className="primary">
                            <div className="blog-title">
                                <h2>{title}</h2>
                            </div>
                            <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
                        </div>
                    </div>
                    {page.widgets && page.widgets.length > 0 && (
                        <div className="col-md-3">
                            <div className="sidebar">
                                {page.widgets.map(widget => {
                                    const wTitle = widget.title?.[locale] || widget.title?.en;
                                    const wContent = widget.content?.[locale] || widget.content?.en;
                                    const isVisible = widget.isVisible?.[locale] ?? (locale === 'en');

                                    if (!isVisible) return null;

                                    return (
                                        <div className="widget-box" key={widget._id}>
                                            <div className="widget-title">
                                                <span>{wTitle}</span>
                                                <div className="line"></div>
                                            </div>
                                            <div className="widget-item">
                                                <div dangerouslySetInnerHTML={{ __html: wContent }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
