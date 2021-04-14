const fs = require('fs');

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

    if (!product.organic) result = result.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return result;
}

const cardTemplate = fs.readFileSync(`${__dirname}/../templates/template-card.html`, 'utf-8');
const overviewTemplate = fs.readFileSync(`${__dirname}/../templates/template-overview.html`, 'utf-8');

const getMainView = (resp, dataObj) => {
    /*Due to we set content-type to be HTML, any string will be parse to HTML*/
    resp.writeHead(200, { 'Content-type': 'text/html' });

    /*Using map to iterate over array of objects from data.json. Convert result into a long string*/
    const cardsHtml = dataObj.map(element => replaceTemplate(cardTemplate, element)).join('');
    /*Insert string (cards with data.json info) inside overview.html template using replace*/
    const output = overviewTemplate.replace('{%PRODUCT_CARDS%}', cardsHtml);

    return output;
}

module.exports = {replaceTemplate, getMainView};