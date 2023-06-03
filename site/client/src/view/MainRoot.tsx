import styled from "styled-components";
import { RootPanel } from "./root/RootPanel";


const Container = styled.div`
    background: #f3f3f3;
    width: 300px;
    grid-area: left;
`

export const MainRoot = () => {
    return (
        <Container>
            <RootPanel></RootPanel>            
        </Container>
    )
}