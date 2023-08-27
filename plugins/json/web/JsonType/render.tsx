import styled from "styled-components"
import React from "react"
import { JsonArrayType, JsonBooleanType, JsonNullType, JsonNumberType, JsonStringType, JsonType } from "./type"
import { IconEdit } from '@arco-design/web-react/icon';
import { Menu, Dropdown } from '@arco-design/web-react';

export const RenderSimpCntr = styled.span`
    display: inline-block;
    font-size: 16px;
    padding: 6px 12px;
    line-height: 1.2;
    border-radius: 4px; 

    &.null{
        background: #ccc;
    }

`
export const RenderNull = () => <RenderSimpCntr className="null">null</RenderSimpCntr>
export const RenderNumber = () => <RenderSimpCntr className="number">number</RenderSimpCntr>
export const RenderString = () => <RenderSimpCntr className="string">string</RenderSimpCntr>
export const RenderBoolean = () => <RenderSimpCntr className="boolean">boolean</RenderSimpCntr>


export const RenderArrayCntr = styled.div``
export const RenderArray = (
    { TypeRender, target }: {
        TypeRender: (props: { target: JsonType }) => JSX.Element
        target: JsonArrayType
    }
) => <RenderArrayCntr>
        <div className="header">Array</div>
        <TypeRender target={target.kind} ></TypeRender>
    </RenderArrayCntr>


export const RenderType = ({ target }: { target: JsonType }) => {
    if (target instanceof JsonNullType)
        return <RenderNull></RenderNull>

    if (target instanceof JsonNumberType)
        return <RenderNumber></RenderNumber>

    if (target instanceof JsonStringType)
        return <RenderString></RenderString>

    if (target instanceof JsonBooleanType)
        return <RenderBoolean></RenderBoolean>

    if (target instanceof JsonArrayType)

        return <RenderArray
            target={target}
            TypeRender={RenderType}
        ></RenderArray>

    throw new Error("unknown type");

}



const ChangeTypeCntr = styled.div`
    font-size: 20px;
    cursor: pointer;
    &:hover{
        opacity: 0.8;
    }

`
export const ChangeType = ({ target }: { target: JsonType }) => {
    const dropList = (
        <Menu>
            <Menu.Item key='1'>Beijing</Menu.Item>
            <Menu.Item key='2'>Shanghai</Menu.Item>
            <Menu.Item key='3'>Guangzhou</Menu.Item>
        </Menu>
    );
    return <ChangeTypeCntr>

        <Dropdown droplist={dropList} trigger='click' >
            <IconEdit />
        </Dropdown>
    </ChangeTypeCntr>
}

const EditorTypeCntr = styled.div`
    display: flex;
    min-height: 32px;
    line-height: 32px;
    flex-direction: row;

    .render{
        flex: 1 1 auto;
    }

    .change{
        flex: 0 0 auto;
    }

`

export const EditorType = ({ target }: { target: JsonType }) => {

    return <EditorTypeCntr>
        <div className="render">
            <RenderType target={target}></RenderType>
        </div>
        <div className="change">
            <ChangeType target={target}></ChangeType>
        </div>
    </EditorTypeCntr>

}