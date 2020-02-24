const http = require('http');
const Cinema = require('./cinema');

function getCinema(url){
    const cinemaObj = new Cinema(url);
    const cinemaData = cinemaObj.scrapeData();
    return cinemaData;
}

const server = http.createServer((req,res)=>{
    if(req.url === '/'){
        const url = "https://www.clickthecity.com/movies/theaters/sm-city-rosales";
        getCinema(url).then(data=>{
            res.writeHead(200,{'Content-Type': 'application/json'});
            res.end(JSON.stringify(data));
        });
     }
     else if(req.url.includes('/date')){
        const urlwithDate = "https://www.clickthecity.com/movies/theaters/sm-city-rosales/" + req.url.split("/")[2];
        getCinema(urlwithDate).then(data=>{
            res.writeHead(200,{'Content-Type': 'application/json'});
            res.end(JSON.stringify(data));
        });
     }else{
        // 404
        res.writeHead(404);
        res.end(`Server Error: 404`);
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT,() => console.log(`Server running on port ${PORT}`));