const http = require('http');
const fs = require('fs');
const {replaceTemplate, getMainView} = require('./modules/utils');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const productTemplate = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const server = http.createServer((req, resp) =>{
    const baseURL = 'http://' + req.headers.host + '/';
    const {pathname, searchParams} =  new URL(req.url, baseURL);
    let output = '';

    switch(pathname){
		case '/':
            /*Print out new string*/
            output = getMainView(resp, dataObj);
            resp.end(output);
			break;
		case '/overview':
            output = getMainView(resp, dataObj);
			resp.end(output);
			break;
		case '/product':
            resp.writeHead(200, {'Content-type': 'text/html'});

            const product = dataObj[searchParams.get('id')];
            output = replaceTemplate(productTemplate, product);

			resp.end(output);
            break;
        case '/api':
            resp.writeHead(200, {'Content-type': 'application/json'});
            resp.end(data);
            break;
		default:
			resp.writeHead(404, {
				'Content-type': 'text/html',
				'my-own-header': 'hello-world'
            });
            
			resp.end('<h1>Page not found!!</h1>');
    }
});

server.listen(8080);