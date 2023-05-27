
const style: Partial<CSSStyleDeclaration> = {
    width: '1em',height:'1em',
    verticalAlign:'-0.15em',
    fill:'currentColor',
    overflow:'hidden'
}

export const EnIcon = ({ family, name }: { family: string, name: string }) => {
    return (
        <svg className="ennv-base-icon" style={style as any} aria-hidden="true">
            <use xlinkHref={`#${family}-${name}`}></use>
        </svg>
    )
}