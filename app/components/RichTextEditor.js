'use client';

import { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css';
import { useLanguage } from '@/context/LanguageContext';
import { dictionary } from '@/lib/dictionary';

export default function RichTextEditor({ value, onChange }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const [showHtml, setShowHtml] = useState(false);

    const { locale } = useLanguage() || { locale: 'en' };
    const t = dictionary[locale] || dictionary.en;

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
        };
    }, []);

    // Update content if value changes externally (and NOT in HTML mode)
    useEffect(() => {
        if (quillRef.current && !showHtml) {
            const currentContent = quillRef.current.root.innerHTML;
            if (value !== currentContent && value !== undefined) {
                if (!value && currentContent === '<p><br></p>') return;
                quillRef.current.root.innerHTML = value;
            }
        }
    }, [value, showHtml]);

    // Handle visibility of Quill toolbar and container when mode changes
    useEffect(() => {
        if (editorRef.current) {
            const parent = editorRef.current.parentElement;
            if (parent) {
                const toolbar = parent.querySelector('.ql-toolbar');
                if (toolbar) {
                    toolbar.style.display = showHtml ? 'none' : 'block';
                }
            }
            editorRef.current.style.display = showHtml ? 'none' : 'block';
        }
    }, [showHtml]);

    return (
        <div style={{ minHeight: '380px', marginBottom: '50px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">
                    {showHtml ? t.editingHtmlMode : t.editingVisualMode}
                </span>
                <button
                    type="button"
                    className={`btn btn-sm ${showHtml ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                        if (showHtml) {
                            if (quillRef.current) {
                                quillRef.current.root.innerHTML = value || '';
                            }
                        }
                        setShowHtml(!showHtml);
                    }}
                >
                    <i className={`fas ${showHtml ? 'fa-eye' : 'fa-code'} mr-1`}></i>
                    {showHtml ? t.visualEditor : t.editHtml}
                </button>
            </div>

            <div ref={editorRef} style={{ height: '300px' }} />

            {showHtml && (
                <textarea
                    className="form-control"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        height: '300px',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        backgroundColor: '#272b30',
                        color: '#f8f9fa',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        padding: '10px',
                        resize: 'vertical'
                    }}
                />
            )}
        </div>
    );
}
