
export default function AdminDashboard() {
    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1 className="m-0 text-dark">Dashboard</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Welcome Admin</h5>
                                <p className="card-text">
                                    Manage your posts and pages here.
                                </p>
                                <a href="/admin/posts" className="btn btn-primary">Manage Posts</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
