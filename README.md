wstcp-server
============

WebSocket TCP forwarding command-line server.

[wstcp](https://github.com/peterkuma/wstcp)
is a client and server implementation of TCP forwarding over WebSocket.
wstcp supports local and remote port forwarding, similar to OpenSSH.

Also see [wstcp-client](https://github.com/peterkuma/wstcp-client).

![Diagram](https://raw.githubusercontent.com/peterkuma/wstcp/master/diagram.png)

Install
-------

    npm install wstcp-server

`wstcp-server` program will be installed in the bin directory.

### Windows

Install as a Windows service:

    npm install -g node-windows
    npm run winservice_install

Uninstall
---------

### Windows

Uninstall the Windows service:

    npm run winservice_uninstall

Usage
-----

Run from console:

    wstcp-server config.json

where `config.json` is a config file (see below).

Example
-------

    {
      "port": 10000,
      "log": "wstcp-server.log",
      "clients": {
        "client-1": {
          "key": "1234",
          "port": 10001,
          "remote": "true"
        },
        "client-2": {
          "key": "1234",
          "port": 10002,
          "remote": "true"
        }
      }
    }

will start listening on port 10000 for WebSocket connections from clients,
authenticated as `client-1` or `client-2` with key `1234`.
Incoming TCP connections on port 10001 will be forwarded to `client-1`,
and incoming TCP connections on port 10002 will be forwarded to `client-2`.

Configuration
-------------

- `port`: WebSocket port to listen on.
- `hostname`: WebSocket hostname to listen on (default: `::`).
- `log`: Log file path (default: *none*).
    Relative paths are resolved relative to the config file.
- `client`: List of clients.
    - *key*: Client name.
    - *value*:
        - `key`: Client authentication key.
        - `port`: TCP forwarding port.
        - `remote`: Remote TCP forwarding (default: `false`).

Remote forwarding (`remote: true`) means wstcp-client listens for incoming
TCP connections and forwards them to wstcp-server. Local forwarding
(`remote: false`) means incoming TCP connections are forwarded from wstcp-server
to wstcp-client.

SSL
---

wstcp-server does not support SSL (wss), but one can use nginx as a HTTPS
proxy. For example, this nginx configuration will pass `wss://` requests
to a local wstcp-server instance at `ws://localhost:10000`.

```
location / {
	proxy_pass http://localhost:10000;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "upgrade";
}
```

Changelog
---------

### 1.0.1 (2024-03-31)

- Require latest version of wstcp.

### 1.0.0 (2021-07-10)

- Initial release.

License
-------

[MIT](LICENSE.md)
