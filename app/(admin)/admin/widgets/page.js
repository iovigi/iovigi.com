export const dynamic = 'force-dynamic';

import Link from 'next/link';
import dbConnect from '@/lib/db';
import Widget from '@/models/Widget';

async function getWidgets() {
    await dbConnect();
    const widgets = await Widget.find({}).sort({ key: 1 });
    return JSON.parse(JSON.stringify(widgets));
}

export default async function WidgetList() {
    const widgets = await getWidgets();

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Widgets</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">All Widgets</h3>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Key</th>
                                            <th>Title</th>
                                            <th>Visible</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {widgets.map((widget) => (
                                            <tr key={widget._id}>
                                                <td>{widget.key}</td>
                                                <td>
                                                    {widget.title && widget.title.en ? widget.title.en : "No Title"}
                                                    <br />
                                                    <small className="text-muted">
                                                        {widget.isVisible && widget.isVisible.en ? <span className="badge badge-success mr-1">EN</span> : <span className="badge badge-secondary mr-1">EN</span>}
                                                        {widget.isVisible && widget.isVisible.bg ? <span className="badge badge-success">BG</span> : <span className="badge badge-secondary">BG</span>}
                                                    </small>
                                                </td>
                                                <td>{(widget.isVisible?.en || widget.isVisible?.bg) ? 'Yes' : 'No'}</td>
                                                <td>
                                                    <Link href={`/admin/widgets/${widget._id}`} className="btn btn-primary btn-sm mr-2"><i className="fas fa-edit"></i> Edit</Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {widgets.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center">No widgets found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
