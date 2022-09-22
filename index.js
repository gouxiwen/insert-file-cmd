#!/usr/bin/env node
// 使用minimist包解析命令行参数
const minimist = require('minimist')
// 使用commander包处理交互操作
const { program }  = require('commander');
const cheerio = require('cheerio');
const path = require('path')
const fs = require('fs')
const argv = minimist(process.argv.slice(2));

// 查看版本号
program
  .version(`${require('./package.json').version}`)
  .usage('sourceFile destinationFile')
  .description('这是一个文件内容插入目标文件的命令');

// 定义addcss命令
program
    .command('css <cssPath> <htmlPath> [outPath] [other...]')
    .description('这是添加css到html的命令')
    .alias('c')
    .option('-d')
    .action((cssPath, htmlPath, outPath, other, cmdOption) => {
        // console.log('cssPath', cssPath);
        // console.log('htmlPath', htmlPath);
        console.log('outPath', outPath);
        // console.log('other', other);
        // console.log('cmdOption', cmdOption);
        cssToHtml(cssPath, htmlPath, outPath)
    })
program.parse(process.argv); // 这一行最后调用

function cssToHtml(cssFilepath, targetFilepath, outPath) {
    // const cssFilepath = argv._[0] 
    // const targetFilepath = argv._[1]
    const cwd =  process.cwd()
    if(!cssFilepath) {
        console.log('请输入css文件路径');
        return
    }
    if(!targetFilepath) {
        console.log('请输入html文件路径');
        return
    }
    const cssFileResolvePath = path.join(cwd, cssFilepath)
    if(!fs.existsSync(cssFileResolvePath)) {
        console.log('请输入正确的css文件路径');
        return
    }
    const targetFileResolvePath = path.join(cwd, targetFilepath)
    if(!fs.existsSync(targetFileResolvePath)) {
        console.log('请输入正确的html文件路径');
        return
    }
    const cssFile = fs.readFileSync(cssFileResolvePath, 'utf-8')
    const htmlFile = fs.readFileSync(targetFileResolvePath, 'utf-8')
    const $ = cheerio.load(htmlFile)
    $('\n<style>\n'+cssFile+'\n</style>\n').insertAfter('title')
    const targetFileName = path.basename(targetFileResolvePath)
    console.log('targetFileName', targetFileName);
    outPath = outPath || './new-'+targetFileName
    fs.writeFileSync(path.join(cwd, outPath),  $.html(), 'utf-8')
}


