# Update app.py
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os
from openai import OpenAI

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
db = SQLAlchemy(app)

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

@app.route("/")
def index():
    completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "What is service design?",
                }
            ],
            model="gpt-3.5-turbo",
        )
    content = completion.choices[0].message.content
    return render_template("index.html", content=content)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)


@app.route('/completions', methods=['POST'])
def completions():
    data = request.get_json()
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({'error': 'Missing prompt'}), 400
    
    try:
       completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Say this is a test",
                }
            ],
            model="gpt-3.5-turbo",
        )
       return jsonify({
           'content': completion.choices[0].message.content
       })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0')
