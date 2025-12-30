import dbConnect from '@/lib/db';
import Page from '@/models/Page';
import { notFound } from 'next/navigation';

async function getPage(slug) {
    await dbConnect();
    const page = await Page.findOne({ slug });
    if (!page) return null;
    return JSON.parse(JSON.stringify(page));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = await getPage(slug);
    if (!page) {
        return {
            title: 'Page Not Found',
        }
    }
    return {
        title: page.title,
    }
}

export default async function DynamicPage({ params }) {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <section id="content">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="primary">
                            <div className="blog-title">
                                <h2>{page.title}</h2>
                            </div>
                            <div className="content" dangerouslySetInnerHTML={{ __html: page.content }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
