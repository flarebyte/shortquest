# Shortquest Rules
## Triggers

### uri starts with

With one parameter:
 - term (wikipedia:,..)

Example:
```
{
   "when": [
      {
         "trigger": "uri starts with",
         "value": "wikipedia:"
      }
   ],
   "then": []
}
```

### uri does not start with

With one parameter:
 - term (wikipedia:,..)

Example:
```
{
   "when": [
      {
         "trigger": "uri does not start with",
         "value": "wikipedia:"
      }
   ],
   "then": []
}
```

### uri ends with

With one parameter:
 - term (.jpg,..)

Example:
```
{
   "when": [
      {
         "trigger": "uri ends with",
         "value": ".jpg"
      }
   ],
   "then": []
}
```

### uri does not end with

With one parameter:
 - term (.jpg,..)

Example:
```
{
   "when": [
      {
         "trigger": "uri does not end with",
         "value": ".jpg"
      }
   ],
   "then": []
}
```

### uri contains

With one parameter:
 - term (.env.,..)

Example:
```
{
   "when": [
      {
         "trigger": "uri contains",
         "value": ".env."
      }
   ],
   "then": []
}
```

### uri does not contain

With one parameter:
 - term (env,..)

Example:
```
{
   "when": [
      {
         "trigger": "uri does not contain",
         "value": "env"
      }
   ],
   "then": []
}
```

### uri matches regex

With one parameter:
 - regular expression (^curie:[0-9]+.jpg$,..)

Example:
```
{
   "when": [
      {
         "trigger": "uri matches regex",
         "value": "^curie:[0-9]+.jpg$"
      }
   ],
   "then": []
}
```

### uri does not match regex

With one parameter:
 - regular expression (^curie:[0-9]+.jpg$,..)

Example:
```
{
   "when": [
      {
         "trigger": "uri does not match regex",
         "value": "^curie:[0-9]+.jpg$"
      }
   ],
   "then": []
}
```

### uri has params

With 0 parameters:

Example:
```
{
   "when": [
      {
         "trigger": "uri has params",
         "value": ""
      }
   ],
   "then": []
}
```

### uri does not have params

With 0 parameters:

Example:
```
{
   "when": [
      {
         "trigger": "uri does not have params",
         "value": ""
      }
   ],
   "then": []
}
```

### tag is

With one parameter:
 - tag name (YAML,..)

Example:
```
{
   "when": [
      {
         "trigger": "tag is",
         "value": "YAML"
      }
   ],
   "then": []
}
```

### tag is not

With one parameter:
 - tag name (Beautify,..)

Example:
```
{
   "when": [
      {
         "trigger": "tag is not",
         "value": "Beautify"
      }
   ],
   "then": []
}
```

## Actions

### set authorization

With 2 parameters:
 - user
 - password

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set authorization",
         "values": [
            "my user",
            "my password"
         ]
      }
   ]
}
```

### set authorization send immediately

With one parameter:
 - boolean (true/false,yes/no)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set authorization send immediately",
         "values": [
            "yes"
         ]
      }
   ]
}
```

### set authorization bearer

With one parameter:
 - bearer token

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set authorization bearer",
         "values": [
            "my bearer token"
         ]
      }
   ]
}
```

### set OAuth

With 4 parameters:
 - consumer key
 - consumer secret
 - token
 - token secret

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set OAuth",
         "values": [
            "my consumer key",
            "my consumer secret",
            "my token",
            "my token secret"
         ]
      }
   ]
}
```

### set OAuth HMAC-SHA1

With 4 parameters:
 - consumer key
 - private key
 - token
 - token secret

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set OAuth HMAC-SHA1",
         "values": [
            "my consumer key",
            "my private key",
            "my token",
            "my token secret"
         ]
      }
   ]
}
```

### set OAuth body hash

With one parameter:
 - boolean (true/false,yes/no)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set OAuth body hash",
         "values": [
            "yes"
         ]
      }
   ]
}
```

### set OAuth transport method

With one parameter:
 - transport method (query, body, header)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set OAuth transport method",
         "values": [
            "query"
         ]
      }
   ]
}
```

### set SSL client

With 3 parameters:
 - cert path (/etc/pki/client.crt,..)
 - key path (/etc/pki/client.key,..)
 - passphrase

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set SSL client",
         "values": [
            "/etc/pki/client.crt",
            "/etc/pki/client.key",
            "my passphrase"
         ]
      }
   ]
}
```

### set SSL client PFX

With 2 parameters:
 - PFX path (/etc/pki/client.pfx,..)
 - passphrase

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set SSL client PFX",
         "values": [
            "/etc/pki/client.pfx",
            "my passphrase"
         ]
      }
   ]
}
```

### set SSL Certificate Authority

With one parameter:
 - CA path (/etc/pki/ca.pem,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set SSL Certificate Authority",
         "values": [
            "/etc/pki/ca.pem"
         ]
      }
   ]
}
```

### set SSL security options

With one parameter:
 - SSL option (SSL_OP_NO_SSLv3,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set SSL security options",
         "values": [
            "SSL_OP_NO_SSLv3"
         ]
      }
   ]
}
```

### set SSL secure protocol

With one parameter:
 - SSL protocol (SSLv3_method,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set SSL secure protocol",
         "values": [
            "SSLv3_method"
         ]
      }
   ]
}
```

### set AWS

With 2 parameters:
 - access key
 - secret

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set AWS",
         "values": [
            "my access key",
            "my secret"
         ]
      }
   ]
}
```

### set AWS bucket

With one parameter:
 - bucket name

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set AWS bucket",
         "values": [
            "my bucket name"
         ]
      }
   ]
}
```

### set request parameter

With 2 parameters:
 - parameter name
 - value

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set request parameter",
         "values": [
            "my parameter name",
            "my value"
         ]
      }
   ]
}
```

### set request parameter as integer

With 2 parameters:
 - parameter name
 - integer value (12,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set request parameter as integer",
         "values": [
            "my parameter name",
            "12"
         ]
      }
   ]
}
```

### set request parameter as past date time

With 4 parameters:
 - parameter name
 - number (8,..)
 - unit (hours,minutes, seconds,...)
 - time format (h:mm:ss,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set request parameter as past date time",
         "values": [
            "my parameter name",
            "8",
            "hours",
            "h:mm:ss"
         ]
      }
   ]
}
```

### set request parameter as date time starting of

With 3 parameters:
 - parameter name
 - unit (hours,minutes, seconds,...)
 - time format (h:mm:ss,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set request parameter as date time starting of",
         "values": [
            "my parameter name",
            "hours",
            "h:mm:ss"
         ]
      }
   ]
}
```

### set header parameter

With 2 parameters:
 - header name
 - value

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set header parameter",
         "values": [
            "my header name",
            "my value"
         ]
      }
   ]
}
```

### set header parameter as integer

With 2 parameters:
 - header name
 - integer value (15,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set header parameter as integer",
         "values": [
            "my header name",
            "15"
         ]
      }
   ]
}
```

### set header parameter as past date time

With 4 parameters:
 - header name
 - number (7,..)
 - unit (hours,minutes, seconds,...)
 - time format (h:mm:ss,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set header parameter as past date time",
         "values": [
            "my header name",
            "7",
            "hours",
            "h:mm:ss"
         ]
      }
   ]
}
```

### set header parameter as date time starting of

With 3 parameters:
 - header name
 - unit (hours,minutes, seconds,...)
 - time format (h:mm:ss,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set header parameter as date time starting of",
         "values": [
            "my header name",
            "hours",
            "h:mm:ss"
         ]
      }
   ]
}
```

### set proxy

With one parameter:
 - http proxy (http://localproxy.com,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set proxy",
         "values": [
            "http://localproxy.com"
         ]
      }
   ]
}
```

### set encoding

With one parameter:
 - character encoding (utf8,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set encoding",
         "values": [
            "utf8"
         ]
      }
   ]
}
```

### set method

With one parameter:
 - HTTP method (GET,PUT,POST,DELETE, HEAD,PATCH)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set method",
         "values": [
            "GET"
         ]
      }
   ]
}
```

### set JSON

With one parameter:
 - boolean (true/false,yes/no)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set JSON",
         "values": [
            "yes"
         ]
      }
   ]
}
```

### set follow redirect

With one parameter:
 - boolean (true/false,yes/no)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set follow redirect",
         "values": [
            "yes"
         ]
      }
   ]
}
```

### set GZIP

With one parameter:
 - boolean (true/false,yes/no)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set GZIP",
         "values": [
            "yes"
         ]
      }
   ]
}
```

### set jar

With one parameter:
 - boolean (true/false,yes/no)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set jar",
         "values": [
            "yes"
         ]
      }
   ]
}
```

### set strict SSL

With one parameter:
 - boolean (true/false,yes/no)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set strict SSL",
         "values": [
            "yes"
         ]
      }
   ]
}
```

### set time

With one parameter:
 - boolean (true/false,yes/no)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set time",
         "values": [
            "yes"
         ]
      }
   ]
}
```

### set timeout in ms

With one parameter:
 - time in milliseconds (10000,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set timeout in ms",
         "values": [
            "10000"
         ]
      }
   ]
}
```

### replace start

With 2 parameters:
 - search term at start of the uri (wikipedia:,news:,gist:,..)
 - replacement term (http://wikipedia.org/,)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "replace start",
         "values": [
            "wikipedia:",
            "http://wikipedia.org/"
         ]
      }
   ]
}
```

### replace all

With 2 parameters:
 - search term (env,..)
 - replacement term (stage,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "replace all",
         "values": [
            "env",
            "stage"
         ]
      }
   ]
}
```

### set custom

With 2 parameters:
 - key (yaml,..)
 - value (beautify,..)

Example:
```
{
   "when": [],
   "then": [
      {
         "action": "set custom",
         "values": [
            "yaml",
            "beautify"
         ]
      }
   ]
}
```

