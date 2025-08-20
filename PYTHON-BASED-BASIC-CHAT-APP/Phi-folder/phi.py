from kivy.app import App
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.core.window import Window
import subprocess
import re

# we have set the window responsive here 
Window.clearcolor = (0, 0, 0, 1)

class ChatScreen(FloatLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # here we set the logic to show background image
        with self.canvas.before:
            from kivy.graphics import Rectangle
            self.bg = Rectangle(source='wallpaperflare.com_wallpaper (1).jpg', pos=self.pos, size=Window.size)
            self.bind(size=self._update_bg, pos=self._update_bg)

        # here we make the chat display and viweable only 
        self.chat_display = TextInput(
            text="Phi: Hello! How can I help you today?\nTo exit, type x",
            size_hint=(1, 0.8),
            pos_hint={'x': 0, 'y': 0.2},
            readonly=True,
            background_color=(0,0,0,0.7),
            foreground_color=(1,1,1,1),
            font_size='16sp'
        )
        self.add_widget(self.chat_display)

        # this is how we take user input
        self.entry = TextInput(
            size_hint=(0.8, 0.1),
            pos_hint={'x': 0, 'y': 0.05},
            multiline=False,
            font_size='16sp'
        )
        self.entry.bind(on_text_validate=self.send_message)
        self.add_widget(self.entry)

        # send button
        self.send_btn = Button(
            text='Send',
            size_hint=(0.2, 0.1),
            pos_hint={'x': 0.8, 'y': 0.05},
            background_color=(0.5,0,0.5,1),
            font_size='16sp'
        )
        self.send_btn.bind(on_release=self.send_message)
        self.add_widget(self.send_btn)

    def _update_bg(self, *args):
        self.bg.pos = self.pos
        self.bg.size = Window.size

    def send_message(self, instance):
        user_input = self.entry.text.strip()
        if not user_input:
            return
        if user_input.lower() in ('x', 'q', 'quit', 'exit'): # logic to exit
            App.get_running_app().stop()
            return

        # append user message to display field
        self.chat_display.text += f"\nMe: {user_input}" 
        self.entry.text = ''

        # here we set subprocess for Phi model
        commond = [
            './India-Accelerator-OpenXAI-2025/BASIC-CHAT-APP/Phi-folder/windows/llama-run.exe',
            '--context-size', '4096',
            '--threads', '6',
            model,
            user_input
        ]
        try:
            output = subprocess.run(commond, capture_output=True, text=True)
            clean = re.sub(r'\x1b\[[0-9;]*m', '', output.stdout)
            response = clean.strip()
        except Exception as e:
            response = f"[Error] {e}"

        # append Phi response to chat display
        self.chat_display.text += f"\nPhi: {response}"
        # sroll to end
        self.chat_display.cursor = (0, len(self.chat_display.text))

class ChatApp(App):
    def build(self):
        Window.bind(on_keyboard=self._on_keyboard)
        return ChatScreen()

    def _on_keyboard(self, window, key, *args):
        if key == 27:
            self.stop()
            return True
        return False

if __name__ == '__main__':
    model = 'India-Accelerator-OpenXAI-2025/BASIC-CHAT-APP/Phi-folder/Phi-3-mini-4k-instruct-q4.gguf'
    ChatApp().run()
