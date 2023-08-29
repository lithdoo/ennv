import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import styled from "styled-components"
import { Editor } from './editor'
import { Button, AutoComplete, Dropdown, Menu } from "@arco-design/web-react";
import { IconSave, IconDown } from '@arco-design/web-react/icon'
import "@arco-design/web-react/dist/css/arco.css";
import './lang';
import { instance } from './run';


const ToolsCntr = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0 20px;
    height: 56px;
    align-items: center;

    .btn{
        margin-right: 12px;
        flex: 0 0 auto;
    }
    .file{
        flex: 1 1 auto;
        .file_name{
            font-size: 16px;
        }
        .file_path{
            font-size: 12px;
            font-weight: bolder;
            color: #999;
        }

    }
    .lang{
        margin-left: 6px;
        flex: 0 0 auto;
    }

`
const langs = [
    'markdown', 'typescirpt', 'html', 'css', 'javascript'
]

const Tools = () => {
    const [lang, setLang] = useState('')
    const [eol, setEol] = useState('LF')

    useEffect(() => {
        instance.resolveSetLang(setLang)
    })

    useEffect(() => {
        instance.changeLang(lang)
    }, [lang])

    return <ToolsCntr>
        <div className='btn'>
            <Button type='primary' onClick={() => instance.save()} shape='circle' icon={<IconSave />} />
        </div>
        <div className='file'>
            <div className='file_name'>测试.ts</div>
            <div className='file_path'>/N/test/测试.ts</div>
        </div>
        <div className='eof'>
            <Dropdown droplist={
                <Menu>
                    <Menu.Item onClick={() => setEol('CRLF')} key='CRLF'>CRLF</Menu.Item>
                    <Menu.Item onClick={() => setEol('LF')} key='LF'>LF</Menu.Item>
                </Menu>
            }>
                <Button type='text'>
                    {eol}<IconDown />
                </Button>
            </Dropdown>
        </div>
        <div className='lang'>
            <AutoComplete
                placeholder='选择语言...'
                allowClear={true}
                data={langs}
                value={lang}
                onChange={(value) => {
                    setLang(value);
                }}
                onBlur={() => {
                    setLang((value) => ((!value) || (langs.indexOf(value) >= 0) ? value : ''));
                }}
                style={{ width: 154 }}
            />

        </div>
    </ToolsCntr>
}

const MainCntr = styled.div`
    height: 100vh;

    .tools{
        height: 56px;
        border-top: 1px solid rgb(236, 236, 236);
        position: relative;
        background: #fff;
        z-index: 1;
    }

    .editor{
        height: calc(100vh - 56px);
    }

`

const MainLayout = () => {
    return (
        <MainCntr >
            <div className='editor'><Editor /></div>
            <div className='tools'><Tools /></div>
        </MainCntr>
    )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <MainLayout></MainLayout>
    // </React.StrictMode>,
)
