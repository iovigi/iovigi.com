'use client';

import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const initQuill = async () => {
            if (typeof window !== 'undefined' && editorRef.current && !quillRef.current) {
                const { default: Quill } = await import('quill');

                // Double check if component is still mounted and ref is still null after await
                if (!isMounted || quillRef.current) return;

                // Cleanup any potential existing toolbar if something went wrong
                if (editorRef.current.previousSibling && editorRef.current.previousSibling.classList.contains('ql-toolbar')) {
                    editorRef.current.previousSibling.remove();
                }
                // Clear container just in case
                editorRef.current.innerHTML = '';

                const quillInstance = new Quill(editorRef.current, {
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

                quillRef.current = quillInstance;

                // Set initial value
                if (value) {
                    quillInstance.root.innerHTML = value;
                }

                quillInstance.on('text-change', () => {
                    if (!isMounted) return;
                    const html = quillInstance.root.innerHTML;
                    onChange(html === '<p><br></p>' ? '' : html);
                });
            }
        };

        initQuill();

        return () => {
            isMounted = false;
            // Optionally destroy quill instance if API supports it, but referencing null is enough
        };
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
