'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && editorRef.current && !quillRef.current) {
            const quill = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        ['link', 'image'],
                        ['clean']
                    ],
                },
            });

            quillRef.current = quill;

            // Set initial value
            if (value) {
                quill.root.innerHTML = value;
            }

            quill.on('text-change', () => {
                const html = quill.root.innerHTML;
                onChange(html === '<p><br></p>' ? '' : html);
            });
        }
    }, []);

    // Update content if value changes externally (optional, but good for edit mode)
    useEffect(() => {
        if (quillRef.current) {
            const currentContent = quillRef.current.root.innerHTML;
            // Basic comparison to prevent cursor jumps on typing
            // Using simple equality check. 
            // Note: external updates while typing can still be tricky without Delta management,
            // but for this simple CMS it's usually fine as local state drives the editor.
            // We mainly need this for initial load in Edit mode.
            if (value !== currentContent && value !== undefined) {
                // If the value is effectively empty, and editor has empty paragraph, ignore
                if (!value && currentContent === '<p><br></p>') return;
                quillRef.current.root.innerHTML = value;
            }
        }
    }, [value]);

    return (
        <div style={{ height: '350px', marginBottom: '50px' }}>
            <div ref={editorRef} style={{ height: '300px' }} />
        </div>
    );
}
