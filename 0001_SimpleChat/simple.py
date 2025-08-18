from flask import Flask, request, render_template_string
import requests
import json

app = Flask(__name__)

# Simple, colorful HTML template (no external CSS needed)
html_page = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Ollama Chatbot</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root {
      --bg1: #0ea5e9;   /* cyan/blue */
      --bg2: #22c55e;   /* green */
      --card: #ffffff;
      --text: #0f172a;  /* slate-900 */
      --muted: #475569; /* slate-600 */
      --primary: #6366f1; /* indigo-500 */
      --primary-700: #4f46e5;
      --accent: #14b8a6; /* teal-500 */
      --bubble-user: #eef2ff;  /* indigo-50 */
      --bubble-ai:   #ecfeff;  /* cyan-50 */
      --shadow: 0 10px 30px rgba(2,6,23,.15);
      --radius: 18px;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
      color: var(--text);
      background: linear-gradient(135deg, var(--bg1), var(--bg2)) fixed;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
    }
    .shell {
      width: 100%;
      max-width: 900px;
    }
    .card {
      background: var(--card);
      border-radius: 24px;
      box-shadow: var(--shadow);
      overflow: hidden;
      backdrop-filter: saturate(140%) blur(6px);
    }
    .header {
      padding: 24px 28px;
      background: linear-gradient(90deg, rgba(99,102,241,.15), rgba(20,184,166,.15));
      border-bottom: 1px solid rgba(2,6,23,.06);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo {
      width: 42px; height: 42px;
      display: grid; place-items: center;
      border-radius: 12px;
      background: radial-gradient(100% 100% at 20% 0%, #a5b4fc 0%, #22d3ee 100%);
      color: white; font-weight: 800;
      letter-spacing: .5px;
      box-shadow: 0 6px 18px rgba(99,102,241,.35);
    }
    .title { font-size: 20px; font-weight: 800; letter-spacing: .2px; }
    .subtitle { color: var(--muted); font-size: 13px; margin-top: 2px; }

    .content {
      padding: 24px 28px 8px;
    }

    .chat {
      display: grid;
      gap: 14px;
      max-height: 52vh;
      overflow: auto;
      padding-right: 4px;
      scrollbar-width: thin;
    }
    .msg {
      display: grid;
      gap: 6px;
    }
    .who {
      font-size: 12px;
      color: var(--muted);
      letter-spacing: .2px;
    }
    .bubble {
      padding: 14px 16px;
      border-radius: 16px;
      line-height: 1.4;
      border: 1px solid rgba(2,6,23,.06);
    }
    .user .bubble {
      background: var(--bubble-user);
    }
    .ai .bubble {
      background: var(--bubble-ai);
    }

    .form {
      padding: 16px 20px 24px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
    }
    input[type="text"] {
      width: 100%;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid rgba(2,6,23,.1);
      outline: none;
      font-size: 15px;
      transition: box-shadow .15s ease, border-color .15s ease;
    }
    input[type="text"]:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(99,102,241,.15);
    }
    .btn {
      padding: 14px 18px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      font-weight: 700;
      letter-spacing: .3px;
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 18px rgba(20,184,166,.25);
      transition: transform .05s ease, filter .15s ease, box-shadow .15s ease;
    }
    .btn:hover { filter: brightness(1.05); }
    .btn:active { transform: translateY(1px); }

    .footer {
      padding: 10px 18px 18px;
      text-align: center;
      color: var(--muted);
      font-size: 12px;
    }

    @media (max-width: 600px) {
      .content { padding: 18px; }
      .form { grid-template-columns: 1fr; }
      .btn { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <div class="card">
      <div class="header">
        <div class="logo">AI</div>
        <div>
          <div class="title">Ollama Chatbot</div>
          <div class="subtitle">Talk to <code>llama3</code> via your local Ollama server</div>
        </div>
      </div>

      <div class="content">
        {% if user_message %}
          <div class="chat" id="chat">
            <div class="msg user">
              <div class="who">You</div>
              <div class="bubble">{{ user_message }}</div>
            </div>
            <div class="msg ai">
              <div class="who">AI</div>
              <div class="bubble">{{ bot_reply }}</div>
            </div>
          </div>
        {% else %}
          <div class="chat" id="chat">
            <div class="msg ai">
              <div class="who">AI</div>
              <div class="bubble">
                Hi! Ask me anything. Your messages are processed by
                <b>Ollama</b> running locally, so responses stay on your machine.
              </div>
            </div>
          </div>
        {% endif %}
      </div>

      <form class="form" method="POST" autocomplete="off">
        <input type="text" name="message" placeholder="Type your message..." required>
        <button class="btn" type="submit">Send</button>
      </form>

      <div class="footer">
        Powered by <b>Flask</b> · <b>Ollama</b> @ http://localhost:11434
      </div>
    </div>
  </div>
</body>
</html>
"""

def chat_with_ollama(prompt: str) -> str:
    url = "http://localhost:11434/api/generate"
    payload = {"model": "llama3", "prompt": prompt}

    # Stream the response line-by-line
    response = requests.post(url, json=payload, stream=True, timeout=600)
    response.raise_for_status()

    full_reply = []
    for line in response.iter_lines():
        if not line:
            continue
        try:
            data = json.loads(line.decode("utf-8"))
        except json.JSONDecodeError:
            continue
        # Accumulate streamed tokens
        if "response" in data and isinstance(data["response"], str):
            full_reply.append(data["response"])
    return "".join(full_reply).strip()

@app.route("/", methods=["GET", "POST"])
def index():
    user_message = None
    bot_reply = None
    if request.method == "POST":
        user_message = request.form.get("message", "").strip()
        if user_message:
            bot_reply = chat_with_ollama(user_message)
    return render_template_string(html_page, user_message=user_message, bot_reply=bot_reply)

if __name__ == "__main__":
    # Set host="0.0.0.0" if you want to access from your LAN
    app.run(debug=True, port=5000)
