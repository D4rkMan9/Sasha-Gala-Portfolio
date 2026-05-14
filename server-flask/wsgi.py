import os
from app import create_app

os.environ.setdefault('DEBUG', 'False')

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('SERVER_PORT', os.getenv('PORT', 5000)))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
