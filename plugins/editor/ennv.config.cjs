const { LocalFile } = require('@ennv/app')
const {gba} =require('./build/index.js')

module.exports= {
    port:14003,
    disk:{
        "D-0": new LocalFile('D:/115 Downloads'),
        "D-1": new LocalFile('D:/BaiduNetdiskDownload'),
        "D-2": new LocalFile('D:/game'),
        "D-3": new LocalFile('D:'),
    },
    plugins: [gba],
}