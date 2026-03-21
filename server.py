import http.server
import json
import os
import subprocess
import sys
import threading
import webbrowser

PORT = 8765
X2CNET_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "x2cnet")


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        if self.path.endswith('.bat'):
            self.send_header('Content-Type', 'application/octet-stream')
            self.send_header('Content-Disposition',
                             f'attachment; filename="{os.path.basename(self.path)}"')
        super().end_headers()

    def do_POST(self):
        if self.path == "/launch":
            threading.Thread(target=self._run_demo, daemon=True).start()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "launched"}).encode())
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _run_demo(self):
        subprocess.run(["git", "checkout", "interactive"], cwd=X2CNET_DIR)
        script = os.path.join(X2CNET_DIR, "realtime_mimicry.py")
        subprocess.Popen(
            f'cmd /k "cd /d {X2CNET_DIR} && python realtime_mimicry.py"',
            creationflags=subprocess.CREATE_NEW_CONSOLE,
        )

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.HTTPServer(("", PORT), Handler)
    print(f"Server running at http://localhost:{PORT}")
    server.serve_forever()
