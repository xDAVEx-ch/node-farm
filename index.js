const http = require('http');
const fs = require('fs');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const cardTemplate = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const productTemplate = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

/*A function to replace patterns with information inside data.json*/
const replaceTemplate = (template, product) => {
    let result = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    result = result.replace(/{%IMAGE%}/g, product.image);
    result = result.replace(/{%PRICE%}/g, product.price);
    result = result.replace(/{%FROM%}/g, product.from);
    result = result.replace(/{%NUTRIENTS%}/g, product.nutrients);
    result = result.replace(/{%QUANTITY%}/g, product.quantity);
    result = result.replace(/{%DESCRIPTION%}/g, product.description);
    result = result.replace(/{%ID%}/g, product.id);

    if(!product.organic) result = result.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return result;
}

const server = http.createServer((req, resp) =>{
    const baseURL = 'http://' + req.headers.host + '/';
    const {pathname, searchParams} =  new URL(req.url, baseURL);
    let output = '';

    switch(pathname){
		case '/':
            /*Due to we set content-type to be HTML, any string will be parse to HTML*/
            resp.writeHead(200, {'Content-type': 'text/html'});

            /*Using map to iterate over array of objects from data.json. Convert result into a long string*/
            const cardsHtml = dataObj.map(element => replaceTemplate(cardTemplate, element)).join('');
            /*Insert string (cards with data.json info) inside overview.html template using replace*/
            output = overviewTemplate.replace('{%PRODUCT_CARDS%}', cardsHtml);

            /*Print out new string*/
			resp.end(output);
			break;
		case '/overview':
			resp.end('Hellow from OVERVIEW');
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