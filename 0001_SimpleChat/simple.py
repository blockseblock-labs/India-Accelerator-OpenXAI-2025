from flask import Flask, request, render_template_string
import requests
import json

app = Flask(__name__)

# Simple HTML template
html_page = """
<!doctype html>
<html>
<head>
    <title>Ollama Chatbot</title>
</head>
<body>
    <h2>Chat with Ollama</h2>
    <form method="POST">
        <input type="text" name="message" placeholder="Type your message" style="width:300px;">
        <input type="submit" value="Send">
    </form>
    {% if user_message %}
        <p><b>You:</b> {{ user_message }}</p>
        <p><b>AI:</b> {{ bot_reply }}</p>
    {% endif %}
</body>
</html>
"""

def chat_with_ollama(prompt):
    url = "http://localhost:11434/api/generate"
    payload = {"model": "llama3", "prompt": prompt}

    # Request with stream
    response = requests.post(url, json=payload, stream=True)

    full_reply = ""
    for line in response.iter_lines():
        if line:
            try:
                data = json.loads(line.decode("utf-8"))
                if "response" in data:
                    full_reply += data["response"]
            except:
                continue
    return full_reply.strip()

@app.route("/", methods=["GET", "POST"])
def index():
    user_message = None
    bot_reply = None
    if request.method == "POST":
        user_message = request.form["message"]
        bot_reply = chat_with_ollama(user_message)
    return render_template_string(html_page, user_message=user_message, bot_reply=bot_reply)

if __name__ == "__main__":
    app.run(debug=True)
