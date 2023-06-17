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



const EnIconBtnContainer = styled.button``

export const EnIconBtn = ({onClick=()=>{}})=>{
    return (
        <EnIconBtnContainer onClick={onClick}>
            test
        </EnIconBtnContainer>
    )
}