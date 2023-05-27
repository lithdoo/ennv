import styled from "styled-components"

export const Root = styled.svg`
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
`

export const EnIcon = ({ family, name }: { family: string, name: string }) => {
    return (
        <Root className="ennv-base-icon" aria-hidden="true">
            <use xlinkHref={`#${family}-${name}`}></use>
        </Root>
    )
}