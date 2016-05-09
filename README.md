wstcp Server
============

WebSocket TCP forwarding server.

Install
-------

    npm install

### Windows

To install as a Windows service:

    npm install -g node-windows
    npm run winservice_install

Uninstall
---------

### Windows

To uninstall the Windows service:

    npm run winservice_uninstall

Usage
-----

Run from console:

    npm start [config]

where `config` is config file (default: `config.json`).

Configuration
-------------

Example:

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

Options:

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
