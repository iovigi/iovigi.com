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
                    <div className="col-md-12">
                        <div className="primary">
                            <div className="blog-title">
                                <h2>{title}</h2>
                            </div>
                            <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
