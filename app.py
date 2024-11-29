import os
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, World!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Port ustawiony przez Render
    app.run(host='0.0.0.0', port=port)  # Uruchomienie aplikacji na odpowiednim porcie
