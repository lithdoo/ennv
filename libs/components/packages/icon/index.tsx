import styled from "styled-components"

export const Root = styled.svg`
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
`

export const EnIcon = ({ family, name, kind = ['', ''] }: { family?: string, name?: string, kind?: [string, string] }) => {
    const f = family || kind[0]
    const n = name || kind[1]

    return (
        <Root className="ennv-base-icon" aria-hidden="true">
            <use xlinkHref={`#${f}-${n}`}></use>
        </Root>
    )
}