# backend/tts.py
import sys
from gtts import gTTS

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python tts.py 'text' output.mp3")
        sys.exit(1)

    text = sys.argv[1]
    out_file = sys.argv[2]

    try:
        tts = gTTS(text=text, lang="en")
        tts.save(out_file)
    except Exception as e:
        print("TTS error:", str(e))
        sys.exit(1)
