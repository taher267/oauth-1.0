const request = require('request')
const axios = require('axios')
const OAuth = require('oauth-1.0a')
const crypto = require('crypto')
const express = require('express')

// const QryParam = qry => qry.split('&').reduce((acc, cur) => ({
//     ...acc,
//     [cur.split('=')[0]]: cur.split('=')[1]
// }), {});

const objToHeaderStr = obj => Object.entries(obj).reduce((acc, cur, i, arr) => {
    if (i === 0) acc = 'OAuth ';
    let str = cur[1].toString();
    str = encodeURIComponent(str).replace(/\!/g, "%21").replace(/\*/g, "%2A")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
    acc += cur[0] + '="' + str + '"' + (i !== arr.length - 1 ? ', ' : '');
    return acc;
}, '');

// Initialize
const oauth = OAuth({
    consumer: {
        //Flickr
        // key: 'key',
        // secret: 'secter',
        //twitter
        key: 'consumer_key',
        secret: 'secret',
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
});

// const oauth_token = 'request access token';
const oauth_token = 'accessed access token';
// const oauth_token_secret = 'request access secret';
const oauth_token_secret = 'accessed access secret';
const oauth_verifier = 'callback redirect viarifier';



const request1 = {
    //Flickr
    // url: 'https://www.flickr.com/services/oauth/request_token',
    // twitter
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    data: {
        oauth_callback: 'https://example.com',
    },
}

// Note: The token is optional for some requests
const token = {
    //Flickr
    // key: 'token 2nd time',
    // secret: 'token secter 2nd times',
    //twitter
    key: oauth_token,
    secret: oauth_token_secret,
}
// load in browser
//https://api.twitter.com/oauth/authorize?oauth_token=

const requsestToken = () => {
    //Axios
    const obj = oauth.authorize(request1);
    axios.post(request1.url, obj, { headers: oauth.toHeader(obj) })
        .then(d => console.log(d.data))
        .catch(e => console.log(e.response.data));
    return
    request(
        {
            url: request1.url,
            method: request1.method,
            form: oauth.authorize(request1),
        },
        function (error, response, body) {
            if (response.statusCode === 200) {
                console.log(body);
            } else {
                console.log(response.statusCode, body);
            }
            // Process your data here
        },
    );
}


const request2 = {
    url: 'https://api.twitter.com/oauth/access_token',
    method: 'POST',
}
const accessToken = () => {
    const obj = oauth.authorize(request2, token);
    axios.post(request2.url, obj, { headers: oauth.toHeader({ ...obj, oauth_verifier }) })
        .then(d => console.log(d.data))
        .catch(e => console.log(e.response.data));
    return
    request(
        {
            url: request2.url,
            method: request2.method,
            form: { ...oauth.authorize(request2, token), oauth_verifier },
        },
        function (error, response, body) {
            if (response.statusCode === 200) {
                console.log(body);
            } else {
                console.log(response.statusCode, body);
            }
            // Process your data here
        },
        // console.log(oauth.authorize(request_data))
    );
}


const request_data3 = {
    url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
    method: 'GET'
}

const userInfo = () => {

    // axios.get(request3.url, { headers: { Authorization: objToHeaderStr(oauth.authorize(request3, token)) } })
    //     .then(d => console.log(d.data))
    //     .catch(e => console.log(e.response.data));

    request(
        {
            url: request_data3.url,
            method: request_data3.method,
            // headers: oauth.toHeader(oauth.authorize(request_data3, token)),
            headers: { Authorization: objToHeaderStr(oauth.authorize(request_data3, token)) },
        },
        function (error, response, body) {
            if (response.statusCode === 200) {
                console.log(body);
            } else {
                console.log(response.statusCode, body);
            }
            // Process your data here
        },
        // console.log(oauth.authorize(request_data))
    );
}
// requsestToken()
// accessToken()
userInfo()

// console.log(axiosCall(oauth.toHeader(oauth.authorize(request3, token)).Authorization));


// const app = express();
// app.use(express.json());
// app.use(require('cookie-parser')());
// app.use(express.urlencoded({ extended: false }));
// app.get('/oauth/access_token', (req, res) => {
//     // console.log(req.params);
//     // res.status(200).json(req.query)
// });






// app.listen(1919, _ => console.log(`Alhamdu lillah`))


package.json={
  "name": "oauth1-0a",
  "version": "1.0.0",
  "main": "server.js",
  "license": "MIT",
  "scripts": {
    "start": "nodemon server",
    "auth": "nodemon auth.js"
  },
  "dependencies": {
    "axios": "^0.27.2",
    "cookie-parser": "^1.4.6",
    "express": "^4.18.1",
    "oauth-1.0a": "^2.2.6",
    "request": "^2.88.2"
  }
}
