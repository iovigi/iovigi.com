import dbConnect from '@/lib/db';
import Page from '@/models/Page';
import { notFound } from 'next/navigation';

async function getPage(slug) {
    await dbConnect();
    const page = await Page.findOne({ slug }).populate('widgets');
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
    const title = page.title?.en || (typeof page.title === 'string' ? page.title : 'Untitled');
    return {
        title: title,
    }
}

import SinglePageContent from '@/components/SinglePageContent';

export default async function DynamicPage({ params }) {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
        notFound();
    }

    return <SinglePageContent page={page} />;
}
