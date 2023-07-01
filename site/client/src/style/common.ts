export const vars = {
    taskBarHeight: () => `72px`,
    taskBarMinHeight: () => `24px`,
    rootSiderWidth: () => `300px`,
    infoSiderWidth: () => `320px`
}


export const group = {
    trans_ease_out: () => `
        transition:all 0.3s ease-out;
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
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    fill: () => `
        height: 100%;
        width: 100%;
    `,
    ellipsis:(lines?:number)=>{
        if(!lines) return `
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `
        else return `
            overflow: hidden;  
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: ${lines};
            -webkit-box-orient: vertical;
        `

    }
}