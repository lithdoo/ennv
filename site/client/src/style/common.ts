export const vars = {
    taskBarHeight: () => `72px`,
    taskBarMinHeight: () => `24px`,
    rootSiderWidth: () => `300px`,
    infoSiderWidth: () => `320px`
}


export const group = {
    trans_ease: () => `
        transition:all 0.3s ease;
    `,
    text_font: () => `
        font-size: 14px;
    `,
    flex_row: () => `
        display: flex;
        flex-direction: row;
    `,
    flex_col: () => `
        display: flex;
        flex-direction: column;
    `,
    flex_center: () => `
        justify-content: center;
        align-items: center;
    `,
    fill: () => `
        height: 100%;
        width: 100%;
    `
}