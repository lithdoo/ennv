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


const EnIconBtnContainer = styled.button``

export const EnIconBtn = ({onClick=()=>{}})=>{
    return (
        <EnIconBtnContainer onClick={onClick}>
            test
        </EnIconBtnContainer>
    )
}