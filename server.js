import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import path from 'path'
import fs from 'fs'
import {JSDOM} from 'jsdom'
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.static(path.resolve(__dirname,'build')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(logger('dev'))

app.get('*',(req,res) => {
fs.stat('./build/index.html',(err,stat) => {
    if(err) {
        fs.readFile(path.resolve(__dirname,'build/manifest.json'),'utf8',(err, data) => {
            if(err) res.send(JSON.stringify({err: 'No manifest.json found'}))
            fs.readFile('./build/index_no.html',(err,html) => {
                if(err) res.status(404).send(JSON.stringify({err: 'No index_no.html hound'}))
                const page = new JSDOM(html.toString())
                const script = page.window.document.createElement('script')
                const text  = page.window.document.createTextNode(`window.webpackManifest = ${data.toString()}`)
                script.appendChild(text)
                script.type = 'text/javascript'
                page.window.document.head.appendChild(script)
                fs.writeFile('./build/index.html',page.serialize(),(err) => {
                    if(err) res.status(404).send(JSON.stringify({err: 'Could not inline manifest'}))
                    res.sendFile(path.resolve(__dirname,'./build/index.html'))
                })
            })
        })
    }
    else res.sendFile(path.resolve(__dirname,'build/index.html'))
})

   
})
const server = app.listen(PORT,() => {
    console.log(`Listening on port ${server.address().port}`)
})
