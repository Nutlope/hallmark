#!/usr/bin/env python3
"""serve.py: local static server for the eval gallery.

Serves the eval/ directory on http://127.0.0.1:4201 (loopback only).
PORT env var overrides the port.
"""

import functools
import http.server
import os
import socketserver
from pathlib import Path

port = int(os.environ.get("PORT", "4201"))
root = str(Path(__file__).resolve().parent)
Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
socketserver.ThreadingTCPServer.allow_reuse_address = True
socketserver.ThreadingTCPServer.daemon_threads = True

if __name__ == "__main__":
    with socketserver.ThreadingTCPServer(("127.0.0.1", port), Handler) as httpd:
        print(f"serving {root} on http://127.0.0.1:{port}", flush=True)
        httpd.serve_forever()
