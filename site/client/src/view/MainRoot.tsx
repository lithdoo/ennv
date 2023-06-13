import styled from "styled-components";
import { RootPanel } from "./root/RootPanel";
import { group } from "../style/common";


const Container = styled.div`
    ${group.fill()}
    background: #f3f3f3;
`

export const MainRoot = () => {
    return (
        <Container>
            <RootPanel></RootPanel>
        </Container>
    )
}