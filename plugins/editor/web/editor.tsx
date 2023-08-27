import { useRef, useState, useEffect } from 'react';
import React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styled from 'styled-components';

const EditorCntr = styled.div`
    height: calc(100vh - 64px);
`
export const Editor = () => {
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    useEffect(() => {
        if (monacoEl) {
            setEditor((editor) => {
                if (editor) return editor;

                return monaco.editor.create(monacoEl.current!, {
                    value: '# 213 \n* fsfsda \n> fdsafdsa',
                    // value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                    language: 'markdown'
                });
            });
        }

        return () => editor?.dispose();
    }, [monacoEl.current]);

    return <EditorCntr className='inner' ref={monacoEl}></EditorCntr>;
};