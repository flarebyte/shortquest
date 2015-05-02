/*global describe, it */
'use strict';
var assert = require('chai').assert;
var shortquest = require('../');

var initial = function(key) {
    var r = {};
    r[key] = {
        check: true
    };
    return r;
};

var init = function() {
    return {
        check: true
    };
};


var validConf = {
    rules: [{
        when: [{
            trigger: "uri starts with",
            value: "gist:"
        }],
        then: [{
            action: "replace start",
            values: ["gist:", "http://gist"]
        }]
    }]
};

var optsBasicAuth = {
    'uri': 'http://some.server.com/',
    'method': 'POST',
    'proxy': 'spyproxy',

    'auth': {
        'user': 'username',
        'pass': 'password',
        'sendImmediately': false
    }
};

var optsBearer = {
    'uri': 'http://some.server.com/',
    'method': 'POST',
    'auth': {
        'bearer': 'bearerToken'
    }
};

var optsOauth = {
    'uri': 'http://some.server.com/',
    'method': 'POST',
    'oauth': {
        "consumer_key": "CONSUMER_KEY",
        "consumer_secret": "CONSUMER_SECRET",
        "token": "oauth_token",
        "token_secret": "perm_data.oauth_token_secret"
    }
};

var optsOauthRsaSha1 = {
    'uri': 'http://some.server.com/',
    'method': 'POST',
    'oauth': {
        "consumer_key": "CONSUMER_KEY",
        "private_key": "PEM format",
        "token": "oauth_token",
        "token_secret": "perm_data.oauth_token_secret",
        "signature_method": 'RSA-SHA1'
    }
};

var optsOauthPlus = {
    'uri': 'http://some.server.com/',
    'method': 'POST',
    'oauth': {
        "consumer_key": "CONSUMER_KEY",
        "consumer_secret": "CONSUMER_SECRET",
        "token": "oauth_token",
        "token_secret": "perm_data.oauth_token_secret",
        "signature_method": "PLAINTEXT",
        "transport_method": "query",
        "body_hash": true

    }
};

var optsAWS = {
    'uri': 'http://some.server.com/',
    'method': 'PUT',
    'aws': {
        "key": "CONSUMER_KEY",
        "secret": "CONSUMER_SECRET",
        "bucket": "my bucket"
    }
};

var optsSSLClientCertificate = {
    'uri': 'http://some.server.com/',
    'method': 'PUT',
    'agentOptions': {
        "certPath": "/etc/pki/cert.pem",
        "keyPath": "/etc/pki/key.pem",
        "passphrase": "password",
        "securityOptions": "SSL_OP_NO_SSLv3"
    }
};

var optsSSLServerCertificate = {
    'uri': 'http://some.server.com/',
    'method': 'PUT',
    'agentOptions': {
        "pfxPath": "/etc/pki/cert.pfx",
        "caPath": "/etc/pki/ca.pem",
        "passphrase": "password"
    }
};


describe('shortquest node module', function() {
    it('must accept valid configuration', function() {
        var conf = shortquest(validConf).configuration();
        assert.equal(conf.rules[0].when[0].trigger, "uri starts with");
    });
    it('must validate basic auth', function() {
        shortquest(validConf).assertRequestOpts(optsBasicAuth);
    });

    it('must set authorization with user password', function() {
        var builder = initial('auth');
        var p = {
            values: ["user123", "pass123"]
        };
        var r = shortquest(validConf).actions["set authorization"](builder, p);
        var expected = {
            auth: {
                check: true,
                user: 'user123',
                pass: 'pass123'
            }
        };
        assert.deepEqual(r, expected);
    });

    it('must set authorization send immediately', function() {
        var builder = initial('auth');
        var p = {
            values: ["yes"]
        };
        var r = shortquest(validConf).actions["set authorization send immediately"](builder, p);
        var expected = {
            auth: {
                check: true,
                sendImmediately: true
            }
        };
        assert.deepEqual(r, expected);
    });

    it('must validate auth with bearer', function() {
        shortquest(validConf).assertRequestOpts(optsBearer);
    });

    it('must set authorization bearer', function() {
        var builder = initial('auth');
        var p = {
            values: ["bearer123"]
        };
        var r = shortquest(validConf).actions["set authorization bearer"](builder, p);
        var expected = {
            auth: {
                check: true,
                bearer: 'bearer123'
            }
        };
        assert.deepEqual(r, expected);
    });



    it('must validate oauth', function() {
        shortquest(validConf).assertRequestOpts(optsOauth);
    });

    it('must set OAuth', function() {
        var builder = initial('oauth');
        var p = {
            values: ["key123", "secret123", "token123", "ts123"]
        };
        var r = shortquest(validConf).actions["set OAuth"](builder, p);
        var expected = {
            oauth: {
                check: true,
                consumer_key: 'key123',
                consumer_secret: 'secret123',
                token: 'token123',
                token_secret: 'ts123'
            }
        };
        assert.deepEqual(r, expected);
    });



    it('must validate oauth RSA SHA1', function() {
        shortquest(validConf).assertRequestOpts(optsOauthRsaSha1);
    });

    it('must set OAuth HMAC-SHA1', function() {
        var builder = initial('oauth');
        var p = {
            values: ["key123", "secret123", "token123", "ts123"]
        };
        var r = shortquest(validConf).actions["set OAuth HMAC-SHA1"](builder, p);
        var expected = {
            oauth: {
                check: true,
                consumer_key: 'key123',
                private_key: 'secret123',
                token: 'token123',
                token_secret: 'ts123',
                signature_method: "RSA-SHA1"
            }
        };
        assert.deepEqual(r, expected);
    });

    it('must validate oauth extra options', function() {
        shortquest(validConf).assertRequestOpts(optsOauthPlus);
    });
    it('must set OAuth body hash', function() {
        var builder = initial('oauth');
        var p = {
            values: ["yes"]
        };
        var r = shortquest(validConf).actions["set OAuth body hash"](builder, p);
        var expected = {
            oauth: {
                check: true,
                body_hash: true
            }
        };
        assert.deepEqual(r, expected);
    });


    it('must set OAuth transport method', function() {
        var builder = initial('oauth');
        var p = {
            values: ["query"]
        };
        var r = shortquest(validConf).actions["set OAuth transport method"](builder, p);
        var expected = {
            oauth: {
                check: true,
                transport_method: "query"
            }
        };
        assert.deepEqual(r, expected);
    });



    it('must validate AWS', function() {
        shortquest(validConf).assertRequestOpts(optsAWS);
    });

    it('must set AWS', function() {
        var builder = initial('aws');
        var p = {
            values: ["key123", "secret123"]
        };
        var r = shortquest(validConf).actions["set AWS"](builder, p);
        var expected = {
            aws: {
                check: true,
                key: 'key123',
                secret: 'secret123'
            }
        };
        assert.deepEqual(r, expected);
    });

    it('must set AWS bucket', function() {
        var builder = initial('aws');
        var p = {
            values: ["bucket123"]
        };
        var r = shortquest(validConf).actions["set AWS bucket"](builder, p);
        var expected = {
            aws: {
                check: true,
                bucket: 'bucket123'
            }
        };
        assert.deepEqual(r, expected);
    });


    it('must validate SSL Client certificate', function() {
        shortquest(validConf).assertRequestOpts(optsSSLClientCertificate);
    });

    it('must set SSL client', function() {
        var builder = initial('agentOptions');
        var p = {
            values: ["certPath/cert.pem", "keyPath/key.pem", "pass123"]
        };
        var r = shortquest(validConf).actions["set SSL client"](builder, p);
        var expected = {
            agentOptions: {
                check: true,
                certPath: 'certPath/cert.pem',
                keyPath: 'keyPath/key.pem',
                passphrase: 'pass123'
            }
        };

        assert.deepEqual(r, expected);
    });

    it('must set SSL client PFX', function() {
        var builder = initial('agentOptions');
        var p = {
            values: ["pfxPath/cert.pem", "pass123"]
        };
        var r = shortquest(validConf).actions["set SSL client PFX"](builder, p);
        var expected = {
            agentOptions: {
                check: true,
                pfxPath: 'pfxPath/cert.pem',
                passphrase: 'pass123'
            }
        };

        assert.deepEqual(r, expected);
    });


    it('must validate SSL Server certificate', function() {
        shortquest(validConf).assertRequestOpts(optsSSLServerCertificate);
    });

    it('must set SSL Certificate Authority', function() {
        var builder = initial('agentOptions');
        var p = {
            values: ["certPath/ca.pem"]
        };
        var r = shortquest(validConf).actions["set SSL Certificate Authority"](builder, p);
        var expected = {
            agentOptions: {
                check: true,
                caPath: 'certPath/ca.pem'
            }
        };

        assert.deepEqual(r, expected);
    });
    it('must set SSL security options', function() {
        var builder = initial('agentOptions');
        var p = {
            values: ["SSL_OP_NO_SSLv3"]
        };
        var r = shortquest(validConf).actions["set SSL security options"](builder, p);
        var expected = {
            agentOptions: {
                check: true,
                securityOptions: 'SSL_OP_NO_SSLv3'
            }
        };

        assert.deepEqual(r, expected);
    });

    it('must set SSL secure protocol', function() {
        var builder = initial('agentOptions');
        var p = {
            values: ["SSLv3_method"]
        };
        var r = shortquest(validConf).actions["set SSL secure protocol"](builder, p);
        var expected = {
            agentOptions: {
                check: true,
                secureProtocol: 'SSLv3_method'
            }
        };

        assert.deepEqual(r, expected);
    });


    it('must set request parameter', function() {
        var builder = init();
        builder.parameterList = [];
        var p = {
            values: ["param1", "value1"]
        };
        var r = shortquest(validConf).actions["set request parameter"](builder, p);
        var expected = {
            check: true,
            parameterList: [{
                k: "param1",
                v: "value1"
            }]
        };

        assert.deepEqual(r, expected);
    });

    it('must set request parameter as integer', function() {
        var builder = init();
        builder.parameterList = [];
        var p = {
            values: ["param1", "123"]
        };
        var r = shortquest(validConf).actions["set request parameter as integer"](builder, p);
        var expected = {
            check: true,
            parameterList: [{
                k: "param1",
                v: 123
            }]
        };

        assert.deepEqual(r, expected);
    });

    it('must set request parameter as past date time', function() {
        var builder = init();
        builder.parameterList = [];
        var p = {
            values: ["param1", "3", "hours", "h:mm:ss"]
        };
        var r = shortquest(validConf).actions["set request parameter as past date time"](builder, p);

        assert.match(r.parameterList[0].v, /^\d+:\d+:\d+/);
    });

    it('must set request parameter as date time starting of', function() {
        var builder = init();
        builder.parameterList = [];
        var p = {
            values: ["param1", "hours", "h:mm:ss"]
        };
        var r = shortquest(validConf).actions["set request parameter as date time starting of"](builder, p);

        assert.match(r.parameterList[0].v, /^\d+:\d+:\d+/);
    });


    //
    // 

    it('must set header parameter', function() {
        var builder = init();
        builder.headerList = [];
        var p = {
            values: ["param1", "value1"]
        };
        var r = shortquest(validConf).actions["set header parameter"](builder, p);
        var expected = {
            check: true,
            headerList: [{
                k: "param1",
                v: "value1"
            }]
        };

        assert.deepEqual(r, expected);
    });

    it('must set header parameter as integer', function() {
        var builder = init();
        builder.headerList = [];
        var p = {
            values: ["param1", "123"]
        };
        var r = shortquest(validConf).actions["set header parameter as integer"](builder, p);
        var expected = {
            check: true,
            headerList: [{
                k: "param1",
                v: 123
            }]
        };

        assert.deepEqual(r, expected);
    });

    it('must set header parameter as past date time', function() {
        var builder = init();
        builder.headerList = [];
        var p = {
            values: ["param1", "3", "hours", "h:mm:ss"]
        };
        var r = shortquest(validConf).actions["set header parameter as past date time"](builder, p);

        assert.match(r.headerList[0].v, /^\d+:\d+:\d+/);
    });

    it('must set header parameter as date time starting of', function() {
        var builder = init();
        builder.headerList = [];
        var p = {
            values: ["param1", "hours", "h:mm:ss"]
        };
        var r = shortquest(validConf).actions["set header parameter as date time starting of"](builder, p);

        assert.match(r.headerList[0].v, /^\d+:\d+:\d+/);
    });

    it('must set proxy', function() {
        var builder = init();
        var p = {
            values: ["proxy123"]
        };
        var r = shortquest(validConf).actions["set proxy"](builder, p);
        var expected = {
            check: true,
            proxy: 'proxy123'

        };

        assert.deepEqual(r, expected);
    });

    it('must set encoding', function() {
        var builder = init();
        var p = {
            values: ["enc123"]
        };
        var r = shortquest(validConf).actions["set encoding"](builder, p);
        var expected = {
            check: true,
            encoding: 'enc123'

        };

        assert.deepEqual(r, expected);
    });
    it('must set method', function() {
        var builder = init();
        var p = {
            values: ["POST"]
        };
        var r = shortquest(validConf).actions["set method"](builder, p);
        var expected = {
            check: true,
            method: 'POST'

        };

        assert.deepEqual(r, expected);
    });
    it('must set follow redirect', function() {
        var builder = init();
        var p = {
            values: ["on"]
        };
        var r = shortquest(validConf).actions["set follow redirect"](builder, p);
        var expected = {
            check: true,
            followRedirect: true

        };

        assert.deepEqual(r, expected);
    });
    it('must set GZIP', function() {
        var builder = init();
        var p = {
            values: ["yes"]
        };
        var r = shortquest(validConf).actions["set GZIP"](builder, p);
        var expected = {
            check: true,
            gzip: true

        };

        assert.deepEqual(r, expected);
    });
    it('must set jar', function() {
        var builder = init();
        var p = {
            values: ["on"]
        };
        var r = shortquest(validConf).actions["set jar"](builder, p);
        var expected = {
            check: true,
            jar: true

        };

        assert.deepEqual(r, expected);
    });
    it('must set strict SSL', function() {
        var builder = init();
        var p = {
            values: ["yes"]
        };
        var r = shortquest(validConf).actions["set strict SSL"](builder, p);
        var expected = {
            check: true,
            strictSSL: true

        };

        assert.deepEqual(r, expected);
    });
    it('must set time', function() {
        var builder = init();
        var p = {
            values: ["yes"]
        };
        var r = shortquest(validConf).actions["set time"](builder, p);
        var expected = {
            check: true,
            time: true

        };

        assert.deepEqual(r, expected);
    });
    it('must set timeout in ms', function() {
        var builder = init();
        var p = {
            values: ["20000"]
        };
        var r = shortquest(validConf).actions["set timeout in ms"](builder, p);
        var expected = {
            check: true,
            timeout: 20000

        };

        assert.deepEqual(r, expected);
    });

    it('must replace start', function() {
        var builder = init();
        builder.uri = "curie:info/123";
        var p = {
            values: ["curie:", "http://mysite.com/"]
        };
        var r = shortquest(validConf).actions["replace start"](builder, p);
        var expected = {
            check: true,
            uri: "http://mysite.com/info/123"

        };

        assert.deepEqual(r, expected);
    });

    it('must replace all', function() {
        var builder = init();
        builder.uri = "mysite:info.media.123.jpg";
        var p = {
            values: [".", "/"]
        };
        var r = shortquest(validConf).actions["replace all"](builder, p);
        var expected = {
            check: true,
            uri: "mysite:info/media/123/jpg"

        };

        assert.deepEqual(r, expected);
    });


    //Triggers

    var checkTriggerOnUri = function(name, value, uri) {
        return shortquest(validConf).triggers[name]({
            uri: uri
        }, value);
    };


    it('must check uri starts with', function() {
        assert.isTrue(checkTriggerOnUri("uri starts with", "curie", "curie:123"));
        assert.isFalse(checkTriggerOnUri("uri starts with", "alpha", "curie:123"));
    });

    it('must check uri ends with', function() {
        assert.isTrue(checkTriggerOnUri("uri ends with", ".jpg", "curie:123.jpg"));
        assert.isFalse(checkTriggerOnUri("uri ends with", ".jpg", "curie:123.png"));
    });

    //When

    var testWhen = function(when, quest) {
        return shortquest(validConf).testWhen(when, quest);
    };

    it('must test single when', function() {
        assert.isTrue(testWhen([{
            trigger: "uri starts with",
            value: "curie:"
        }], {
            uri: "curie:123"
        }));
    });

    it('must test double when', function() {
        var when = [{
            trigger: "uri starts with",
            value: "curie:"
        }, {
            trigger: "uri ends with",
            value: ".jpg"
        }];
        assert.isTrue(testWhen(when, {
            uri: "curie:123.jpg"
        }));
        assert.isFalse(testWhen(when, {
            uri: "curie:123.html"
        }));
    });


    // Make

    var ACTION_GZIP_TRUE = {
        action: "set GZIP",
        values: ["yes"]
    };

    var ACTION_REDIRECT_TRUE = {
        action: "set follow redirect",
        values: ["yes"]
    };

    var ACTION_SSL_TRUE = {
        action: "set strict SSL",
        values: ["yes"]
    };
    var ACTION_JAR_TRUE = {
        action: "set jar",
        values: ["yes"]
    };

    var ACTION_PROXY = {
        action: "set proxy",
        values: ["proxy123"]
    };

    var actionVal = function(action, values) {
        return {
            action: action,
            values: values
        };
    };

    var triggerVal = function(trigger, value) {
        return {
            trigger: trigger,
            value: value
        };
    };

    it('must list actions for trigger', function() {
        console.log("--------");
        var conf = {
            rules: [{
                when: [triggerVal("uri starts with", "gist:")],
                then: [ACTION_PROXY, ACTION_GZIP_TRUE]
            }]
        };
        var quest = {
            uri: "gist:123"
        };
        var r = shortquest(conf).whichActions(quest);

        assert.deepEqual(r, conf.rules[0].then);
    });

    it('must list actions for complex rules with no duplicate', function() {
        console.log("--------");
        var conf = {
            rules: [{
                when: [triggerVal("uri starts with", "curie:")],
                then: [ACTION_PROXY, ACTION_GZIP_TRUE, actionVal('set header parameter', ['Accept', 'application/json'])]
            }, {
                when: [triggerVal("uri starts with", "noway:")],
                then: [ACTION_REDIRECT_TRUE]
            }, {
                when: [triggerVal("uri ends with", ".jpg")],
                then: [ACTION_PROXY, ACTION_SSL_TRUE, actionVal('set header parameter', ['CustomH', 'header123'])]
            }, {
                when: [triggerVal("uri ends with", ".j")],
                then: [ACTION_JAR_TRUE]
            }]
        };
        var quest = {
            uri: "curie:123.jpg"
        };
        var r = shortquest(conf).whichActions(quest);

        var expected = [{
            action: 'set proxy',
            values: ['proxy123']
        }, {
            action: 'set GZIP',
            values: ['yes']
        }, {
            action: 'set header parameter',
            values: ['Accept', 'application/json']
        }, {
            action: 'set strict SSL',
            values: ['yes']
        }, {
            action: 'set header parameter',
            values: ['CustomH', 'header123']
        }, ];
        assert.deepEqual(r, expected);
    });

    it('must make a configuration', function() {
        var conf = {
            rules: [{
                when: [triggerVal("uri starts with", "curie:")],
                then: [ACTION_PROXY,
                    actionVal('set AWS', ['key123', 'secret123']),
                    actionVal('set header parameter', ['H1', 'hearder123']),
                    actionVal('set header parameter', ['H2', 'hearder456']),
                    actionVal('replace start', ['curie:', 'http://myweb.com/'])
                ]
            }, {
                when: [triggerVal("uri ends with", ".jpg")],
                then: [
                    actionVal('set request parameter', ['media', 'jpg'])
                ]
            }, ]
        };
        var quest = {
            uri: "curie:latest/123.jpg"
        };
        var r = shortquest(conf).make(quest);

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            aws: {
                key: 'key123',
                secret: 'secret123'
            },
            proxy: 'proxy123',
            headers: {
                H1: 'hearder123',
                H2: 'hearder456'
            },
            qs: {
                media: 'jpg'
            },
            method: 'GET'

        };

        assert.deepEqual(r, expected);
    });

    var simpleConf = {
        rules: [{
            when: [triggerVal("uri starts with", "curie:")],
            then: [ACTION_PROXY,
                actionVal('set header parameter', ['H1', 'hearder123']),
                actionVal('replace start', ['curie:', 'http://myweb.com/'])
            ]
        }, {
            when: [triggerVal("uri ends with", ".jpg")],
            then: [
                actionVal('set request parameter', ['media', 'jpg']),
                actionVal('set header parameter', ['header-media', 'jpeg']),
            ]
        }, ]
    };
    var paramsK1K2Array = [{
        k: "k1",
        v: "v1"
    }, {
        k: "k2",
        v: "v2"
    }];

    var paramsK1K2Object = {
        k1: "A1",
        k2: "B1"
    };

    it('must make a GET configuration with just uri', function() {
        var r = shortquest(simpleConf).makeGet("curie:latest/123.jpg");

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg'
            },
            method: 'GET'

        };

        assert.deepEqual(r, expected);
    });

    it('must make a GET configuration with uri and params as array', function() {
        var r = shortquest(simpleConf).makeGet("curie:latest/123.jpg", paramsK1K2Array);

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                "media": "jpg",
                "k1": "v1",
                "k2": "v2"
            },
            method: 'GET'

        };

        assert.deepEqual(r, expected);
    });

    it('must make a GET configuration with uri and params as object', function() {
        var r = shortquest(simpleConf).makeGet("curie:latest/123.jpg", paramsK1K2Object);

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            method: 'GET'

        };

        assert.deepEqual(r, expected);
    });

    it('must make a GET configuration with uri, params, and tags', function() {
        var r = shortquest(simpleConf).makeGet("curie:latest/123.jpg", paramsK1K2Array, ["red", "green"]);

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                "media": "jpg",
                "k1": "v1",
                "k2": "v2"
            },
            method: 'GET'

        };

        assert.deepEqual(r, expected);
    });


    // Head 


    it('must make a GET configuration with uri and params as object', function() {
        var r = shortquest(simpleConf).makeHead("curie:latest/123.jpg", paramsK1K2Object);

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            method: 'HEAD'

        };

        assert.deepEqual(r, expected);
    });

    // Delete

    it('must make a GET configuration with uri and params as object', function() {
        var r = shortquest(simpleConf).makeDelete("curie:latest/123.jpg", paramsK1K2Object);

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            method: 'DELETE'

        };

        assert.deepEqual(r, expected);
    });



    it('must make a PUT configuration with uri and params as object', function() {
        var r = shortquest(simpleConf).makePut("curie:latest/123.jpg", paramsK1K2Object, "body123");

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            body: "body123",
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            method: 'PUT'

        };

        assert.deepEqual(r, expected);
    });

    it('must make a PUT configuration with uri and params as object with Json Body', function() {
        var r = shortquest(simpleConf).makePutJson("curie:latest/123.jpg", paramsK1K2Object, {
            a: "b",
            c: "d"
        });

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            json: {
                a: "b",
                c: "d"
            },
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            method: 'PUT'

        };

        assert.deepEqual(r, expected);
    });

    it('must make a PUT configuration with uri and params as object with a form', function() {
        var r = shortquest(simpleConf).makePutForm("curie:latest/123.jpg", paramsK1K2Object, {
            a: "b",
            c: "d"
        });

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            form: {
                a: "b",
                c: "d"
            },
            method: 'PUT'

        };

        assert.deepEqual(r, expected);
    });

    // -- Post ---

    it('must make a POST configuration with uri and params as object', function() {
        var r = shortquest(simpleConf).makePost("curie:latest/123.jpg", paramsK1K2Object, "body123");

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            body: "body123",
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            method: 'POST'

        };

        assert.deepEqual(r, expected);
    });

    it('must make a POST configuration with uri and params as object with Json Body', function() {
        var r = shortquest(simpleConf).makePostJson("curie:latest/123.jpg", paramsK1K2Object, {
            a: "b",
            c: "d"
        });

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            json: {
                a: "b",
                c: "d"
            },
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            method: 'POST'

        };

        assert.deepEqual(r, expected);
    });

    it('must make a POST configuration with uri and params as object with a form', function() {
        var r = shortquest(simpleConf).makePostForm("curie:latest/123.jpg", paramsK1K2Object, {
            a: "b",
            c: "d"
        });

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            form: {
                a: "b",
                c: "d"
            },
            method: 'POST'

        };

        assert.deepEqual(r, expected);
    });

    // Patch


    // -- Post ---

    it('must make a PATCH configuration with uri and params as object', function() {
        var r = shortquest(simpleConf).makePatch("curie:latest/123.jpg", paramsK1K2Object, "body123");

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            body: "body123",
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            method: 'PATCH'

        };

        assert.deepEqual(r, expected);
    });

    it('must make a PATCH configuration with uri and params as object with Json Body', function() {
        var r = shortquest(simpleConf).makePatchJson("curie:latest/123.jpg", paramsK1K2Object, {
            a: "b",
            c: "d"
        });

        var expected = {
            uri: 'http://myweb.com/latest/123.jpg',
            proxy: 'proxy123',
            json: {
                a: "b",
                c: "d"
            },
            headers: {
                H1: 'hearder123',
                "header-media": "jpeg"
            },
            qs: {
                media: 'jpg',
                "k1": "A1",
                "k2": "B1"
            },
            method: 'PATCH'

        };

        assert.deepEqual(r, expected);
    });



});