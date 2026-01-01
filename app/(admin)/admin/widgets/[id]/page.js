import dbConnect from '@/lib/db';
import Widget from '@/models/Widget';
import EditWidgetForm from './EditWidgetForm';
import { notFound } from 'next/navigation';

async function getWidget(id) {
    await dbConnect();
    const widget = await Widget.findById(id);
    if (!widget) return null;
    return JSON.parse(JSON.stringify(widget));
}

export default async function EditWidgetPage({ params }) {
    const { id } = await params;
    const widget = await getWidget(id);

    if (!widget) {
        notFound();
    }

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Edit Widget</h1>
                    </div>
                </div>
                <EditWidgetForm widget={widget} />
            </div>
        </div>
    );
}
