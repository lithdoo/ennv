document.head.append(((style) => {
    style.innerHTML = `
    html,body,iframe{
        border:none;
        padding:0;
        margin:0;
        overflow:hidden;
        height:100%;
        width:100%;
    }
    `
    return style
})(document.createElement('style')))

document.body.append(((iframe) => {
    iframe.src = '/plugin/static/gba-emulator/gbajs/index.html'
    return iframe
})(document.createElement('iframe')))