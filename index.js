'use strict';
var Joi = require('joi');
var S = require('string');
var _ = require('lodash');
var moment = require('moment');

var assertArgsLength = function(p, size) {
    Joi.assert(p.values, Joi.array(Joi.string()).length(size));
};

var assertEnum = function(value, enumeration) {
    Joi.assert(value, Joi.string().valid(enumeration));
    return value;
};

var assertString = function(value) {
    Joi.assert(value, Joi.string().min(1).max(5000));
    return value;
};

var assertInteger = function(value) {
    Joi.assert(value, Joi.number().integer());
    return S(value).toInt();
};

var assertTimeUnit = function(value) {
    Joi.assert(value, Joi.string().valid('days', 'hours', 'minutes', 'seconds'));
    return value;
};

var assertBoolean = function(value) {
    Joi.assert(value, Joi.boolean());
    return S(value).toBoolean();
};

//Triggers


var uriStartsWith = function(quest, term) {
    return S(quest.uri).startsWith(term);
};

var uriNotStartsWith = function(quest, term) {
    return !uriStartsWith(quest.uri, term);
};

var uriEndsWith = function(quest, term) {
    return S(quest.uri).endsWith(term);
};

var uriNotEndsWith = function(quest, term) {
    return !uriEndsWith(quest.uri, term);
};

var uriContains = function(quest, term) {
    return S(quest.uri).contains(term);
};

var uriNotContains = function(quest, term) {
    return !uriContains(quest.uri, term);
};

var uriRegex = function(quest, regex) {
    var rx = new RegExp(regex);
    return rx.matches(quest.uri);
};

var uriNotRegex = function(quest, regex) {
    return !uriRegex(quest.uri, regex);
};

var uriHasParams = function(quest) {
    return S(quest.uri).contains("?");
};

var uriHasNoParam = function(quest) {
    return !uriHasParams(quest.uri);
};


var isLocalHost = function(quest) {
    return S(quest.uri).startsWith("localhost");
};

var isNotLocalHost = function(quest) {
    return !isLocalHost(quest.uri);
};

var isSecure = function(quest) {
    return S(quest.uri).startsWith("https://");
};

var isNotSecure = function(quest) {
    return !isSecure(quest.uri);
};


var triggers = {
    "uri starts with": uriStartsWith,
    "uri does not start with": uriNotStartsWith,
    "uri ends with": uriEndsWith,
    "uri does not end with": uriNotEndsWith,
    "uri contains": uriContains,
    "uri does not contain": uriNotContains,
    "uri regex": uriRegex,
    "not uri regex": uriNotRegex,
    "uri has params": uriHasParams,
    "uri does not have params": uriHasNoParam,
    "uri is localhost": isLocalHost,
    "uri is not localhost": isNotLocalHost,
    "uri is secure": isSecure,
    "uri is not secure": isNotSecure
};

var testWhen = function(when, quest) {
    return _.every(when, function(singleWhen) {
        return triggers[singleWhen.trigger](quest, singleWhen.value);
    });
};

var _setParameter = function(name, builder, p) {
    assertArgsLength(p, 2);
    builder[name].push({
        k: assertString(p.values[0]),
        v: assertString(p.values[1])
    });
    return builder;
};

var _setParameterAsInteger = function(name, builder, p) {
    assertArgsLength(p, 2);
    builder[name].push({
        k: assertString(p.values[0]),
        v: assertInteger(p.values[1])
    });
    return builder;
};

var _setParameterAsPastDateTime = function(name, builder, p) {
    assertArgsLength(p, 4);
    var since = moment().subtract(assertInteger(p.values[1]), assertTimeUnit(p.values[2]));
    builder[name].push({
        k: assertString(p.values[0]),
        v: since.format(assertString(p.values[3]))
    });
    return builder;
};


var _setParameterAsDateTimeStarting = function(name, builder, p) {
    assertArgsLength(p, 3);
    var since = moment().startOf(assertTimeUnit(p.values[1]));
    builder[name].push({
        k: assertString(p.values[0]),
        v: since.format(assertString(p.values[2]))
    });
    return builder;
};


//
var setRequestParameter = function(builder, p) {
    return _setParameter('parameterList', builder, p);
};

var setRequestParameterAsInteger = function(builder, p) {
    return _setParameterAsInteger('parameterList', builder, p);
};

var setRequestParameterAsPastDateTime = function(builder, p) {
    return _setParameterAsPastDateTime('parameterList', builder, p);
};


var setRequestParameterAsDateTimeStarting = function(builder, p) {
    return _setParameterAsDateTimeStarting('parameterList', builder, p);
};

// ---

var setHeaderParameter = function(builder, p) {
    return _setParameter('headerList', builder, p);
};

var setHeaderParameterAsInteger = function(builder, p) {
    return _setParameterAsInteger('headerList', builder, p);
};

var setHeaderParameterAsPastDateTime = function(builder, p) {
    return _setParameterAsPastDateTime('headerList', builder, p);
};


var setHeaderParameterAsDateTimeStarting = function(builder, p) {
    return _setParameterAsDateTimeStarting('headerList', builder, p);
};


var setAuthorization = function(builder, p) {
    assertArgsLength(p, 2);
    builder.auth.user = assertString(p.values[0]);
    builder.auth.pass = assertString(p.values[1]);
    return builder;
};

var setAuthorizationSendImmediately = function(builder, p) {
    assertArgsLength(p, 1);
    builder.auth.sendImmediately = assertBoolean(p.values[0]);
    return builder;
};

var setAuthorizationBearer = function(builder, p) {
    assertArgsLength(p, 1);
    builder.auth.bearer = assertString(p.values[0]);
    return builder;
};

var setOAuth = function(builder, p) {
    assertArgsLength(p, 4);
    builder.oauth.consumer_key = assertString(p.values[0]);
    builder.oauth.consumer_secret = assertString(p.values[1]);
    builder.oauth.token = assertString(p.values[2]);
    builder.oauth.token_secret = assertString(p.values[3]);
    return builder;
};

var setOAuthRSA = function(builder, p) {
    assertArgsLength(p, 4);
    builder.oauth.consumer_key = assertString(p.values[0]);
    builder.oauth.private_key = assertString(p.values[1]);
    builder.oauth.token = assertString(p.values[2]);
    builder.oauth.token_secret = assertString(p.values[3]);
    builder.oauth.signature_method = 'RSA-SHA1';
    return builder;
};

var setOAuthBodyHash = function(builder, p) {
    assertArgsLength(p, 1);
    builder.oauth.body_hash = assertBoolean(p.values[0]);
    return builder;
};

var setOAuthTransportMethod = function(builder, p) {
    assertArgsLength(p, 1);
    builder.oauth.transport_method = assertEnum(p.values[0], ['query', 'body', 'header']);
    return builder;
};

var setSSLClient = function(builder, p) {
    assertArgsLength(p, 3);
    builder.agentOptions.certPath = assertString(p.values[0]);
    builder.agentOptions.keyPath = assertString(p.values[1]);
    builder.agentOptions.passphrase = assertString(p.values[2]);
    return builder;
};

var setSSLClientPFX = function(builder, p) {
    assertArgsLength(p, 2);
    builder.agentOptions.pfxPath = assertString(p.values[0]);
    builder.agentOptions.passphrase = assertString(p.values[1]);
    return builder;
};

var setSSL_CA = function(builder, p) {
    assertArgsLength(p, 1);
    builder.agentOptions.caPath = assertString(p.values[0]);
    return builder;
};

var setSecurityOptions = function(builder, p) {
    assertArgsLength(p, 1);
    builder.agentOptions.securityOptions = assertEnum(p.values[0], ['SSL_OP_NO_SSLv3']);
    return builder;
};

var setSecureProtocol = function(builder, p) {
    assertArgsLength(p, 1);

    builder.agentOptions.secureProtocol = assertEnum(p.values[0], ['SSLv3_method']);
    return builder;
};

var setAws = function(builder, p) {
    assertArgsLength(p, 2);
    builder.aws.key = assertString(p.values[0]);
    builder.aws.secret = assertString(p.values[1]);
    return builder;
};

var setAwsBucket = function(builder, p) {
    assertArgsLength(p, 1);
    builder.aws.bucket = assertString(p.values[0]);
    return builder;
};

var setHttpMethod = function(builder, p) {
    assertArgsLength(p, 1);
    builder.method = assertEnum(p.values[0], ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']);
    return builder;
};

var setProxy = function(builder, p) {
    assertArgsLength(p, 1);
    builder.proxy = assertString(p.values[0]);
    return builder;
};

var setEncoding = function(builder, p) {
    assertArgsLength(p, 1);
    builder.encoding = assertString(p.values[0]);
    return builder;
};

var setFollowRedirect = function(builder, p) {
    assertArgsLength(p, 1);
    builder.followRedirect = assertBoolean(p.values[0]);
    return builder;
};

var setGzip = function(builder, p) {
    assertArgsLength(p, 1);
    builder.gzip = assertBoolean(p.values[0]);
    return builder;
};
var setJar = function(builder, p) {
    assertArgsLength(p, 1);
    builder.jar = assertBoolean(p.values[0]);
    return builder;
};
var setStrictSSL = function(builder, p) {
    assertArgsLength(p, 1);
    builder.strictSSL = assertBoolean(p.values[0]);
    return builder;
};
var setTime = function(builder, p) {
    assertArgsLength(p, 1);
    builder.time = assertBoolean(p.values[0]);
    return builder;
};

var setTimeoutMilli = function(builder, p) {
    assertArgsLength(p, 1);
    builder.timeout = assertInteger(p.values[0]);
    return builder;
};
var replaceStart = function(builder, p) {
    assertArgsLength(p, 2);
    var search = assertString(p.values[0]);
    var repl = assertString(p.values[1]);
    var uri = builder.uri;
    builder.uri = repl + S(uri).chompLeft(search).s;
    return builder;
};

var replaceAll = function(builder, p) {
    assertArgsLength(p, 2);
    var search = assertString(p.values[0]);
    var repl = assertString(p.values[1]);
    var uri = builder.uri;
    builder.uri = S(uri).replaceAll(search, repl).s;
    return builder;
};


var actions = {
    "set authorization": setAuthorization,
    "set authorization send immediately": setAuthorizationSendImmediately,
    "set authorization bearer": setAuthorizationBearer,
    "set OAuth": setOAuth,
    "set OAuth HMAC-SHA1": setOAuthRSA,
    "set OAuth body hash": setOAuthBodyHash,
    "set OAuth transport method": setOAuthTransportMethod,
    "set SSL client": setSSLClient,
    "set SSL client PFX": setSSLClientPFX,
    "set SSL Certificate Authority": setSSL_CA,
    "set SSL security options": setSecurityOptions,
    "set SSL secure protocol": setSecureProtocol,
    "set AWS": setAws,
    "set AWS bucket": setAwsBucket,
    "set request parameter": setRequestParameter,
    "set request parameter as integer": setRequestParameterAsInteger,
    "set request parameter as past date time": setRequestParameterAsPastDateTime,
    "set request parameter as date time starting of": setRequestParameterAsDateTimeStarting,
    "set header parameter": setHeaderParameter,
    "set header parameter as integer": setHeaderParameterAsInteger,
    "set header parameter as past date time": setHeaderParameterAsPastDateTime,
    "set header parameter as date time starting of": setHeaderParameterAsDateTimeStarting,
    "set proxy": setProxy,
    "set encoding": setEncoding,
    "set method": setHttpMethod,
    "set follow redirect": setFollowRedirect,
    "set GZIP": setGzip,
    "set jar": setJar,
    "set strict SSL": setStrictSSL,
    "set time": setTime,
    "set timeout in ms": setTimeoutMilli,
    "replace start": replaceStart,
    "replace all": replaceAll

};

var triggerSchema = Joi.object().keys({
    trigger: Joi.string().valid(_.keys(triggers)).required(),
    value: Joi.string()
});

var actionSchema = Joi.object().keys({
    action: Joi.string().valid(_.keys(actions)).required(),
    values: Joi.array().items(Joi.string()).min(1)
});


var ruleSchema = Joi.object().keys({
    when: Joi.array().items(triggerSchema).min(1),
    then: Joi.array().items(actionSchema).min(1)
});

var confSchema = Joi.object().keys({
    rules: Joi.array().items(ruleSchema)
});

var keyValueSchema = Joi.object().keys({
    k: Joi.string().min(1).required(),
    v: Joi.string().required()
});


var authSchema = Joi.object().keys({
    user: Joi.string().min(1).max(1000).required(),
    pass: Joi.string().min(1).max(1000).required(),
    sendImmediately: Joi.boolean().optional()
});

var authBearerSchema = Joi.object().keys({
    bearer: Joi.string().min(1).max(1000).required()
});

var oauthSchema = Joi.object().keys({
    consumer_key: Joi.string().min(1).max(1000).required(),
    consumer_secret: Joi.string().min(1).max(1000).when('private_key', {
        is: false,
        then: Joi.required()
    }),
    private_key: Joi.string().min(1).max(5000).when('signature_method', {
        is: "RSA-SHA1",
        then: Joi.required()
    }),
    token: Joi.string().min(1).max(1000).required(),
    token_secret: Joi.string().min(1).max(1000).required(),
    signature_method: Joi.string().valid('RSA-SHA1', 'PLAINTEXT'),
    body_hash: Joi.boolean(),
    transport_method: Joi.string().valid('query', 'body', 'header')
}).without('consumer_secret', ['private_key']).without('private_key', ['consumer_secret']);


var agentOptions = Joi.object().keys({
    cert: Joi.binary().min(10),
    certPath: Joi.string().min(4).max(1000).example('/etc/pki/client.crt'),
    key: Joi.binary().min(10),
    keyPath: Joi.string().min(4).max(1000).example('/etc/pki/client.key'),
    pfx: Joi.binary().min(10),
    pfxPath: Joi.string().min(4).max(1000).example('/etc/pki/client.pfx'),
    ca: Joi.binary().min(10),
    caPath: Joi.string().min(4).max(1000).example('/etc/pki/ca.cert.pem'),
    passphrase: Joi.string().min(1).max(1000),
    securityOptions: Joi.string().valid('SSL_OP_NO_SSLv3'),
    secureProtocol: Joi.string().valid('SSLv3_method')
}).without('pfxPath', ['keyPath', 'certPath']);

var awsSchema = Joi.object().keys({
    key: Joi.string().min(6).max(1000).required(),
    secret: Joi.string().min(6).max(1000).required(),
    bucket: Joi.string().min(1)
});

var SCHEME = {
    scheme: ['http', 'https']
};

var EMPTY_OBJ = Joi.object().max(0);
var requestSchema = Joi.object().keys({
    method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'),
    uri: Joi.string().uri(SCHEME).min(5),
    formList: Joi.array().items(keyValueSchema),
    headerList: Joi.array().items(keyValueSchema),
    parameterList: Joi.array().items(keyValueSchema),
    body: [Joi.binary(), Joi.string()],
    json: Joi.object(),
    auth: [authSchema, authBearerSchema, EMPTY_OBJ],
    oauth: [oauthSchema, EMPTY_OBJ],
    aws: [awsSchema, EMPTY_OBJ],
    followRedirect: Joi.boolean(),
    gzip: Joi.boolean(),
    jar: Joi.boolean(),
    strictSSL: Joi.boolean(),
    time: Joi.boolean(),
    encoding: Joi.string().example('utf8'),
    timeout: Joi.number().integer().unit('milliseconds').less(2 * 60 * 1000),
    proxy: Joi.string(),
    agentOptions: [agentOptions, EMPTY_OBJ],
    tags: Joi.array().items(Joi.string())

});

var assertRequestOpts = function(options) {
    Joi.assert(options, requestSchema);
};

var questSchema = Joi.object().keys({
    uri: Joi.string().min(5).max(1000).required(),
    method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'),
    formList: Joi.array().items(keyValueSchema),
    parameterList: Joi.array().items(keyValueSchema),
    body: [Joi.binary(), Joi.string()],
    json: Joi.object(),
    tags: Joi.array().items(Joi.string())
});

var createQuest = function(quest) {
    var made = _.cloneDeep(quest);
    made.auth = {};
    made.oauth = {};
    made.aws = {};
    made.agentOptions = {};
    made.formList = _.isEmpty(quest.formList) ? [] : quest.formList;
    made.headerList = [];
    made.parameterList = _.isEmpty(quest.parameterList) ? [] : quest.parameterList;
    return made;
};

var deleteIfEmpty = function(made, key) {
    if (_.isEmpty(made[key])) {
        delete made[key];
    }
    return made;
};

var convertListToMap = function(made, fromKey, toKey) {
    var isEmpty = _.isEmpty(made[fromKey]);
    if (isEmpty) {
        return;
    }
    made[toKey] = {};
    var kvToMap = function(kv) {
        made[toKey][kv.k] = kv.v;
    };
    _.forEach(made[fromKey], kvToMap);
};

var ensureArrayOfKeyValues = function(keyValues) {
    if (_.isEmpty(keyValues)) {
        return null;
    }
    if (_.isArray(keyValues)) {
        return keyValues;
    }
    Joi.assert(keyValues, Joi.object().min(1));
    var kvArray = [];
    _.forIn(keyValues, function(value, key) {
        kvArray.push({
            k: key,
            v: value
        });
    });
    return kvArray;
};
var normalizeQuest = function(made) {
    deleteIfEmpty(made, 'auth');
    deleteIfEmpty(made, 'oauth');
    deleteIfEmpty(made, 'aws');
    deleteIfEmpty(made, 'agentOptions');
    convertListToMap(made, 'formList', 'form');
    convertListToMap(made, 'headerList', 'headers');
    convertListToMap(made, 'parameterList', 'qs');
    delete made.formList;
    delete made.headerList;
    delete made.parameterList;
    delete made.tags;
    return made;
};

module.exports = function(config) {


    var confg = Joi.validate(config, confSchema);

    if (!_.isNull(confg.error)) {
        throw new Error(confg.error);
    }

    var cfg = confg.value;
    var rules = cfg.rules;

    var getConfiguration = function() {
        return _.clone(cfg);
    };


    var whichActions = function(quest) {
        Joi.assert(quest, questSchema);
        var _collectActions = function(total, rule) {
            var fired = testWhen(rule.when, quest);
            if (fired) {
                total = _.union(total, rule.then);
            }
            return total;
        };
        var acts = _.reduce(rules, _collectActions, []);
        var _comp = function(n) {
            return n.action + '=' + n.values.join(',');
        };
        return _.uniq(acts, _comp);
    };

    var make = function(quest) {
        var acts = whichActions(quest);
        var made = createQuest(quest);
        var applyAction = function(act) {
            acts = actions[act.action](made, act);
        };
        _.forEach(acts, applyAction);

        var isHttpMethodAbsent = !_.has(made, 'method');
        if (isHttpMethodAbsent) {
            made.method = 'GET';
        }
        assertRequestOpts(made);
        normalizeQuest(made);
        return made;
    };

    // --- GET ---

    var makeGet = function(uri, parameters, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var quest = {
            uri: uri,
            method: 'GET'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        return make(quest);

    };

    // --- HEAD ---

    var makeHead = function(uri, parameters, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var quest = {
            uri: uri,
            method: 'HEAD'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        return make(quest);

    };


    // --- DELETE ---

    var makeDelete = function(uri, parameters, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var quest = {
            uri: uri,
            method: 'DELETE'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        return make(quest);

    };


    // --- PUT ---
    var makePut = function(uri, parameters, body, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var quest = {
            uri: uri,
            method: 'PUT'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        if (!_.isNull(body)) {
            quest['body'] = body;
        }

        return make(quest);

    };


    var makePutJson = function(uri, parameters, json, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var quest = {
            uri: uri,
            method: 'PUT'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        if (!_.isNull(json)) {
            quest['json'] = json;
        }

        return make(quest);

    };

    var makePutForm = function(uri, parameters, formValues, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var formList = ensureArrayOfKeyValues(formValues);
        var quest = {
            uri: uri,
            method: 'PUT'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isNull(formList)) {
            quest['formList'] = formList;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        return make(quest);

    };

    //---Post---

    var makePost = function(uri, parameters, body, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var quest = {
            uri: uri,
            method: 'POST'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        if (!_.isNull(body)) {
            quest['body'] = body;
        }

        return make(quest);

    };


    var makePostJson = function(uri, parameters, json, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var quest = {
            uri: uri,
            method: 'POST'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        if (!_.isNull(json)) {
            quest['json'] = json;
        }

        return make(quest);

    };

    var makePostForm = function(uri, parameters, formValues, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var formList = ensureArrayOfKeyValues(formValues);
        var quest = {
            uri: uri,
            method: 'POST'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isNull(formList)) {
            quest['formList'] = formList;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        return make(quest);

    };

    //---Patch---

    var makePatch = function(uri, parameters, body, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var quest = {
            uri: uri,
            method: 'PATCH'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        if (!_.isNull(body)) {
            quest['body'] = body;
        }

        return make(quest);

    };

    var makePatchJson = function(uri, parameters, json, tags) {
        var params = ensureArrayOfKeyValues(parameters);
        var quest = {
            uri: uri,
            method: 'PATCH'
        };

        if (!_.isNull(params)) {
            quest['parameterList'] = params;
        }

        if (!_.isEmpty(tags)) {
            quest['tags'] = tags;
        }

        if (!_.isNull(json)) {
            quest['json'] = json;
        }

        return make(quest);

    };


    var shortquest = {
        configuration: getConfiguration,
        triggers: triggers,
        assertRequestOpts: assertRequestOpts,
        actions: actions,
        testWhen: testWhen,
        whichActions: whichActions,
        make: make,
        makeGet: makeGet,
        makeHead: makeHead,
        makeDelete: makeDelete,
        makePut: makePut,
        makePutJson: makePutJson,
        makePutForm: makePutForm,
        makePost: makePost,
        makePostJson: makePostJson,
        makePostForm: makePostForm,
        makePatch: makePatch,
        makePatchJson: makePatchJson
    };

    return shortquest;

};