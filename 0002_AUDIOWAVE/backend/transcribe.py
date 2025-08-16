import sys
import speech_recognition as sr

audio_path = sys.argv[1]

r = sr.Recognizer()
with sr.AudioFile(audio_path) as source:
    audio = r.record(source)
    try:
        text = r.recognize_google(audio)
        print(text)
    except Exception as e:
        print("Error:", e)
        sys.exit(1)
