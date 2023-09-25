const NodeJS = require('node:stream/web')
if (!global.ReadableStream) {
    global.ReadableStream = NodeJS.ReadableStream
}
// global.structuredClone = (val) => JSON.parse(JSON.stringify(val)); // node 17版本之前，没有这个方法；这里重新定义会有问题，无法正确的获取到数据了，建议node升级到17版本之上(包含17的版本)
require('./js/pdf.js')
require('./js/pdf.worker.js')
const fs = require('fs')

/**
 * 使用pdfjs解析
 * @see https://github.com/mozilla/pdf.js/tree/master
 */
function parsePDF(data) {
    let pdf = pdfjsLib.getDocument({ data: data })
    return pdf.promise.then(async function(pdf) {
        let result = { pages: [], outline: await pdf.getOutline() }
        let maxPages = pdf._pdfInfo.numPages
        for (let j = 1; j <= maxPages; j++) {
            const page = await pdf.getPage(j)
            result.pages.push({
                page: page.pageNumber,
                view: page.view,
                ref: page.ref,
                text: await page.getTextContent()
            })
        }
        return result
    })
}

/**
 * 获取命令行传入的文件路径参数
 * @type {string[]}
 */
const args = process.argv.slice(2)
if (args[0]) {
    /**
     * 先读取PDF文件，再转成Uint8Array数据后使用PDFJS进行解析
     * 本地测试PDF 文件 /Users/liujianchun/Downloads/compressed.tracemonkey-pldi-09.pdf
     */
    fs.readFile(args[0], function(err, data) {
        if (err) {
            console.log('ERROR: ' + err)
        } else {
            const uint8Array = new Uint8Array(data)
            parsePDF(uint8Array).then(
                function(text) {
                    console.log(JSON.stringify(text))
                },
                function(reason) {
                    console.log('ERROR: ' + reason.name + '; message: ' + reason.message)
                }
            )
        }
    })
} else {
    console.log('ERROR: 请输入PDF文件路径参数！')
}
