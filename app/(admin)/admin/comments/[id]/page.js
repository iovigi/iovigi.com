import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import EditCommentForm from './EditCommentForm';
import { notFound } from 'next/navigation';

async function getComment(id) {
    await dbConnect();
    const comment = await Comment.findById(id);
    if (!comment) return null;
    return JSON.parse(JSON.stringify(comment));
}

export default async function EditCommentPage({ params }) {
    const { id } = await params;
    const comment = await getComment(id);

    if (!comment) {
        notFound();
    }

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Edit Comment</h1>
                    </div>
                </div>
                <EditCommentForm comment={comment} />
            </div>
        </div>
    );
}
