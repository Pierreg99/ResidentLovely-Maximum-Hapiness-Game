#!/usr/bin/env python3
"""
Resident Lovely v4.0.0 — Persistent Game Server
Port: 8081 | Root: ~/projects/resident-lovely-game
"""
import http.server, socketserver, os

GAME_DIR = os.path.expanduser('~/projects/resident-lovely-game')
PORT = 8081

class GameHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=GAME_DIR, **kwargs)
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    def log_message(self, fmt, *args):
        print(f'[GAME:{PORT}] {self.address_string()} {fmt % args}', flush=True)

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

print(f'[RESIDENT LOVELY v4.0.0] http://localhost:{PORT}', flush=True)
with ReusableTCPServer(('', PORT), GameHandler) as httpd:
    httpd.serve_forever()
