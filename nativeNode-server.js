let http=require("http"),
    fs=require("fs"),
    path=require("path")


//1- craete server
let app=http.createServer(handelrequest)


//2- handel all reqs
function handelrequest(req,res){
    console.log("encoming req",req.url,req.method)
    res.writeHead(200,{
        //'content-Type':"text/plain"
        //'content-Type':"application/json"
        'content-Type':"text/html"

    })
    //res.end("hello")
    //res.end(JSON.stringify({data:"hello from json"}))
    //res.end(`<h1>hi</h1>`)
    switch (req.url){
        case '/home':
            fs.readFile(path.join(__dirname,"home.html"),(err,result)=>{
                //console.log(__dirname)
                if(!err)
                    res.end(result)
            })
            break;
        case '/about':
            fs.readFile(path.join(__dirname,"about.html"),(err,result)=>{
                //console.log(__dirname)
                if(!err)
                    res.end(result)
            })
            break;
        default:
       
            fs.readFile(path.join(__dirname,"notFound.html"),(err,result)=>{
                if(!err)
                    res.end(result)
            })
    }
    
}

//3- listining port number
app.listen(8080,()=>{console.log("I'm listining")})
