const express = require('express'),
      serveStatic = require('serve-static'),
      serveFavicon = require('serve-favicon'),
      app = express(),
      {spawn} = require('child_process')

    app.use(serveFavicon('./favicon.ico'))

    app.use(function(req,res,next) {
        if(!req.url.includes('.') && !(req.url === '/')){
            req.url = req.url.concat(req.url.split('/')[1])
        }
        next()
    })

    app.use(serveStatic('./public', {
        index: 'index/index.html',
        extensions: 'html',
    }))

    //Running a python script in the console
    let enddata = '';
    const python = spawn('python3', ['test.py'])
    python.stdout.on('data', function(data) {
        console.log('pipe data from python script ,,,')
        enddata += data.toString()
    })
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`)
        console.log(enddata.slice(0,-1))
    })

    app.listen(3000);


//XML upload => python run local => abc string => abcjs
