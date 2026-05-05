import os
import mimetypes
from flask import Flask, send_from_directory, jsonify, Response
from flask_cors import CORS
from .config import Config
from .database import init_db

# Force correct MIME types (some environments don't have these)
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('image/svg+xml', '.svg')
mimetypes.add_type('application/json', '.json')
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('font/woff', '.woff')

# Explicit MIME map for Vite build assets
MIME_MAP = {
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
}


def create_app():
    app = Flask(__name__, static_folder=Config.STATIC_FOLDER, static_url_path='')
    CORS(app)
    init_db(app)

    from .routes.api import api_bp
    from .routes.auth import auth_bp

    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # Serve uploaded project images
    @app.route('/imgs/<filename>')
    def serve_project_image(filename):
        return send_from_directory(Config.UPLOAD_FOLDER, filename)

    # Root route — serve index.html
    @app.route('/')
    def serve_index():
        static = app.static_folder
        if not static or not os.path.exists(static):
            return jsonify({'error': 'Frontend not built'}), 404
        return send_from_directory(static, 'index.html')

    # Serve Vite build assets (JS, CSS, images, fonts, etc.)
    @app.route('/assets/<path:filename>')
    def serve_assets(filename):
        static = app.static_folder
        if not static:
            return jsonify({'error': 'Frontend not built'}), 404
        ext = os.path.splitext(filename)[1].lower()
        mime_type = MIME_MAP.get(ext)
        file_path = os.path.join(static, 'assets', filename)
        if mime_type and os.path.isfile(file_path):
            with open(file_path, 'rb') as f:
                return Response(f.read(), mimetype=mime_type)
        return send_from_directory(os.path.join(static, 'assets'), filename)

    # SPA fallback: any non-API, non-file route → index.html
    @app.errorhandler(404)
    def spa_fallback(e):
        # Don't intercept API 404s
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Not found'}), 404
        static = app.static_folder
        if not static or not os.path.exists(static):
            return jsonify({'error': 'Frontend not built'}), 404
        return send_from_directory(static, 'index.html')

    from flask import request

    return app
