import dbConnect from '@/lib/db';
import Page from '@/models/Page';
import EditPageForm from './EditPageForm';
import { notFound } from 'next/navigation';

async function getPage(id) {
    await dbConnect();
    const page = await Page.findById(id);
    if (!page) return null;
    return JSON.parse(JSON.stringify(page));
}

export default async function EditPagePage({ params }) {
    const { id } = await params;
    const page = await getPage(id);

    if (!page) {
        notFound();
    }

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Edit Page</h1>
                    </div>
                </div>
                <EditPageForm page={page} />
            </div>
        </div>
    );
}
