#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> HTTP request client supporting shortcut urls

This library has the following purposes:
 - provide shortcuts for urls the same way a curie would (e.g wiki:picasso instead of http://mywiki.com/picasso).
 - provide contextualisation for urls (e.g env becomes stage in http://env.mywiki.com/picasso)
 - provide automatic headers based on rules.
 - provide automatic authentication based on rules.
 - provide automatic SSL certificates based on rules.
 - provide JSON support.
 - provide support for request.js.
 - provide support for (asynchronous) promises.
 - provide support for piping.

The main idea is help to store urls in a compact form.
It is very similar to the concept of curie.

For instance:
```
{
	name: "Picasso",
	websites: ["wikipedia:Picasso","bbc:Picasso","tate:Picasso"]
}
```
The exact urls, as well as all information concerning headers and authorisation are provided by the rules engine.

## Install

```sh
$ npm install --save shortquest
```


## Usage

All the possible rules are described in details in RULES.md.
You should also consult the request.js documentation as this library is used under the hood.
In addition, the unit tests (test.js) are also a good source of examples.

### GET Request

```js
var shortquest = require('shortquest');

var rulesConf = {
    rules: [{
        when: [{
            trigger: "uri starts with",
            value: "wiki:"
        }],
        then: [{
            action: "replace start",
            values: ["wiki:", "http://mywiki.com/"]
        }]
    }]
};
var myshortquest = shortquest(rulesConf);

myshortquest.request("wiki:picasso", function(error, response, body) {
            console.log(body);
            //will get the body for url: http://mywiki.com/picasso
        });
```

### POST, PUT, DELETE Requests

You could perform any kind of requests by specifying the method with POST,PUT,DELETE,PATCH or HEAD.
The body could be some json or a string.
Note that for a good JSON support you will need to add a "set JSON" rule.

Example:
```js
myshortquest.request({
            uri: "wiki:picasso",
            method: 'POST',
            body: {title: "good story"}
        }, function(error, response, body) {
            //log success or error
        });
```

### Passing parameters

You can pass request parameters with parameterObj:

```js
myshortquest.request({
            uri: "wiki:picasso",
            parameterObj: {search: "birth"}
        }, function(error, response, body) {
            //log success or error
        });
```

### Passing a form

You can pass a form with formObj:

```js
myshortquest.request({
            uri: "wiki:picasso",
            method: "POST",
            formObj: {firstName: "Pablo"}
        }, function(error, response, body) {
            //log success or error
        });
```

### Passing tags

You can pass tags that can be used by the rule engine:

```js
myshortquest.request({
            uri: "wiki:picasso",
            method: "POST",
            tags: ["sandbox", "XML"]
        }, function(error, response, body) {
            //log success or error
        });
```

### Pipe a request

It is possible to pipe requests:

Example:
```js
myshortquest.request("curie:latest/123.jpg").pipe(requests.request({
            uri: "curie:update/post123.json",
            method: 'POST'
        }));
```

### Async

You can also do asynchronous requests using promises (we are using bluebird internally);

Example:
```js
    myshortquest.requestAsync("curie:latest/123.jpg").then(function(data) {
        var response = data[0];
        var body = data[1];
     });

```

## License

MIT © [Olivier Huin]()

## Contributors

..and with the help of Aradhna ..

[npm-url]: https://npmjs.org/package/shortquest
[npm-image]: https://badge.fury.io/js/shortquest.svg
[travis-url]: https://travis-ci.org/flarebyte/shortquest
[travis-image]: https://travis-ci.org/flarebyte/shortquest.svg?branch=master
[daviddm-url]: https://david-dm.org/flarebyte/shortquest.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/flarebyte/shortquest
