const PORT = process.env.PORT || 3000;
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var server_url = "https://ibrahim-stratus.herokuapp.com/"
var maxComics = 2475; 
var app = express();




app.use(bodyParser.json());




app.get('/',(req,res)=>{
   https.get('https://xkcd.com/info.0.json',resp =>{
       let data = "";
       
       resp.on("data", chunk =>{
           data += chunk;
       });

       resp.on("end", () => {
        if(resp.statusCode == 200){
            let Jdata = JSON.parse(data);
            
            res.writeHead(200, { 'Content-Type':'text/html'});
            res.end(make_html(Jdata));
        }
        else{
            res.send(resp.statusCode, "" + resp.statusCode);
        }
       });

       
   }).on("error", () =>{
    
    res.send(500,"error");
    });
    
});


app.get('/:comicId',(req,res)=>{
    var comicId = req.params.comicId;
    if(isNaN(comicId)){
        res.send(401, 'invalid');
    }else{
        var url = `https://xkcd.com/${comicId}/info.0.json`;
        
        https.get(url,resp =>{
        let data = "";
       
        resp.on("data", chunk =>{
            data += chunk;
        });

        resp.on("end", () => {
            if(resp.statusCode == 200){
                let Jdata = JSON.parse(data);
                
                res.writeHead(200, { 'Content-Type':'text/html'});
                res.end(make_html(Jdata));
            }
            else{
                res.status(resp.statusCode).send('Error').end();
            }
        });

        
    }).on("error", () =>{
        console.log("error");
        res.status(500).send('Error').end();
        });
    }
});

// Should be a stored in another file but becuase its not staic i had some trouble editing files in Node.js so this solution made the code more simplier 
function make_html(data){
    var prev,next,random;
    random = Math.floor(Math.random() * (maxComics) + 1); 
    if(data.num >= maxComics){
        maxComics = data.num;
        next = maxComics;
        prev = maxComics - 1;
    }
    else if(data.num == 1){
        next = 2;
        prev = 1;
    }
    else{
        prev = data.num - 1;
        next = data.num + 1;
    }

    var web_html = `<html>
                        <body>
                        <div style="text-align:center">
                            <h1>Stratus360 Case Study</h1>
                            <div>
                                <h2>Title: ${data.safe_title}</h2>
                                <h3>Date created: ${data.month}/${data.day}/${data.year}</h3>
                                <img src=${data.img} alt=${data.alt}>
                            </div>
                            <div>
                                Transcript: 
                                <p>${data.transcript}</p>
                            </div>
                            <div>
                                <a href="${server_url+prev}">
                                    <button>Prev</button>
                                </a>
                                <a href="${server_url+random}">
                                <button>Random</button>
                                </a>
                                <a href="${server_url+next}">
                                    <button>Next</button>
                                </a>
                            </div>
                        </div>
                        </body>
                        
                        </html>`;


    return web_html;
}



app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});