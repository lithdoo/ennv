import { EnIcon } from "@ennv/components"
import { PropsWithChildren } from "react"
import styled from "styled-components"

export const HeightHideBox = ({ innerClassName = '', outerClassName = "", height, hide, children }: PropsWithChildren<{
    height: string,
    hide: boolean,
    innerClassName?: string,
    outerClassName?: string
}>) => {

    return <div className={outerClassName} style={{ height: hide ? '0' : height, overflow: 'hidden' }}>
        <div className={innerClassName} style={{ height }}>{children}</div>
    </div>
}


export const WidthHideBox = ({ innerClassName = '', outerClassName = "", minWidth='' , width, hide, children }: PropsWithChildren<{
    width: string,
    minWidth?:string,
    hide: boolean,
    innerClassName?: string,
    outerClassName?: string
}>) => {

    return <div className={outerClassName} style={{ width: hide ? '0' : width, overflow: 'hidden'}}>
        <div className={innerClassName} style={{ width,minWidth  }}>{children}</div>
    </div>
}



const EnIconBtnContainer = styled.button`
    font-size:18px;
    height: 24px;
    width: 24px;
    line-height: 24px;
    padding: 0;
    text-align: center;
`

export const EnIconBtn = ({icon, onClick=()=>{}}:{icon:[string,string],onClick:()=>void})=>{
    return (
        <EnIconBtnContainer type="button" onClick={onClick}>
            <EnIcon  kind={icon}/>
        </EnIconBtnContainer>
    )
}