export const dynamic = 'force-dynamic';

import Link from 'next/link';
import dbConnect from '@/lib/db';
import Page from '@/models/Page';

async function getPages() {
    await dbConnect();
    const pages = await Page.find({}).sort({ sortOrder: 1 });
    return JSON.parse(JSON.stringify(pages));
}

export default async function PageList() {
    const pages = await getPages();

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Pages</h1>
                    </div>
                    <div className="col-sm-6">
                        <Link href="/admin/pages/create" className="btn btn-success float-sm-right">Add New Page</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">All Pages</h3>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Slug</th>
                                            <th>Show In Menu</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pages.map((page) => (
                                            <tr key={page._id}>
                                                <td>
                                                    {page.title && page.title.en ? page.title.en : "No Title"}
                                                    <br />
                                                    <small className="text-muted">
                                                        {page.isVisible && page.isVisible.en ? <span className="badge badge-success mr-1">EN</span> : <span className="badge badge-secondary mr-1">EN</span>}
                                                        {page.isVisible && page.isVisible.bg ? <span className="badge badge-success">BG</span> : <span className="badge badge-secondary">BG</span>}
                                                    </small>
                                                </td>
                                                <td>{page.slug}</td>
                                                <td>{page.showInMenu ? 'Yes' : 'No'}</td>
                                                <td>
                                                    <Link href={`/admin/pages/${page._id}`} className="btn btn-primary btn-sm mr-2"><i className="fas fa-edit"></i> Edit</Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {pages.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center">No pages found.</td>
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
