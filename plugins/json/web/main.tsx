import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import styled from "styled-components"
import { JsonNullType, JsonType } from './JsonType/type'
import { EditorType } from './JsonType/render'
import "@arco-design/web-react/dist/css/arco.css";

const MainContainer = styled.div`
  max-width: 660px;
  margin: 72px auto;
  padding: 48px;
  box-shadow: 0 3px 6px 0 rgba(0,0,0,0.1)

`

const MainLayout = () => {

    const [type, setType] = useState<JsonType>(new JsonNullType())

    return <MainContainer>

        <EditorType target={type}></EditorType>
        <h1>JsonType</h1>
    </MainContainer>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <MainLayout></MainLayout>
    </React.StrictMode>,
)
