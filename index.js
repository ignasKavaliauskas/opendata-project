const nunjucks = require('nunjucks');
const express = require('express');
const DataParser = require('./DataParser')
const app = express();
const bodyParser = require('body-parser');
const { data } = require('jquery');


const port = process.env.PORT || 3000;
const path = __dirname;

app.use(bodyParser.json());

// Paths visible to the client
app.use('/bootstrap', express.static(path + '/node_modules/bootstrap/dist/'));
app.use('/jquery', express.static(path + '/node_modules/jquery/dist/'));
app.use('/popper', express.static(path + '/node_modules/popper.js/dist/'));
app.use('/d3', express.static(path + '/node_modules/d3/dist'));
app.use('/data', express.static(path + '/static/data/'));
app.use('/scripts', express.static(path + '/static/scripts/'));
app.use('/style', express.static(path + '/static/style/'));

// Use nunjucks as templating engine
nunjucks.configure('static/', {
    autoescape: true,
    express: app
});

// Init our data parser
var dataParser = new DataParser(path + "/static/data/Berlin_crimes.csv");

app.get('/', function (req, res) {
    console.log(dataParser.getData())
    let payload = {
        homeActive: true,
        years: dataParser.years,
        header: dataParser.getKeys(),
        tableData: dataParser.getData()
    }

    res.render(path + "/static/pages/index.html", payload)
});

app.get('/about', function (req, res) {
    res.render(path + "/static/pages/about.html", { aboutActive: true })
});

app.get('/filter', function (req, res) {
    console.log(req.body);
});

app.listen(port, function () {
    console.log('Webserver listening on port ' + port);
});