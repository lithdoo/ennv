import { useRef, useState, useEffect } from 'react';
import React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styled from 'styled-components';
import { instance } from './run';

const EditorCntr = styled.div`
    height: calc(100vh - 57px);
`

export const Editor = () => {
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    useEffect(() => {
        if (monacoEl) {
            setEditor((cur) => {
                if (cur) return cur;

                const editor =  monaco.editor.create(monacoEl.current!, {
                    value: '',
                    language: 'markdown'
                });

                instance.resolveEditor(editor)
                ;(window as any).editor = editor
                ;(window as any).monaco = monaco
                return editor
            });
        }

        return () => editor?.dispose();
    }, [monacoEl.current]);

    return <EditorCntr className='inner' ref={monacoEl}></EditorCntr>;
};

