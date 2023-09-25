# use node and pdf.js parse PDF file to json

[pdf.js github链接](https://github.com/mozilla/pdf.js/tree/master)

测试页面 可以直接使用浏览器打开 test.html 文件进行访问，打开浏览器调试器，在 Console 中可以看到解析结果。

本地或者服务器上运行解析
```shell
node main.js pdf/test.pdf
```

注意⚠️：node版本低于17 将无法正常运行命令进行解析，会报错 `structuredClone is not defined`; node升级至17的版本之上即可(包含node17)。