const {gba} =require('./build/index.js')

module.exports = {
    port:14003,
    roots:['C:','D:'],
    plugins: [gba],
}