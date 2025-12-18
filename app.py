from flask import Flask, render_template, send_file
import os

app = Flask(__name__)


@app.route('/')
def index():
    """Главная страница с поздравительной открыткой"""
    return render_template('index.html')


@app.route('/heart')
def get_heart_image():
    """Маршрут для получения изображения сердечка"""
    heart_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
        <path fill="red" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>'''
    return heart_svg, 200, {'Content-Type': 'image/svg+xml'}


@app.route('/health')
def health_check():
    """Маршрут для health check (нужен Render)"""
    return {'status': 'healthy'}, 200


if __name__ == '__main__':
    # Создаем папки, если они не существуют
    os.makedirs('static', exist_ok=True)
    os.makedirs('templates', exist_ok=True)

    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)