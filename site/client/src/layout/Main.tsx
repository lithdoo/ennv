import { type PropsWithChildren } from "react"
import styled from "styled-components"


const MainContainer = styled.div`
    height:100%;
    width: 100%;
    min-height:600px;
    min-width:800px;
    display: grid;
    grid-template-areas:  'header header header'
                          'left center right';
    grid-template-rows: auto 1fr;
    grid-template-columns: auto 1fr auto;
    
`

export const MainLayout = ({ children }: PropsWithChildren<{}>) => {

    return (
        <MainContainer>
            {children}
        </MainContainer>
    )
}
