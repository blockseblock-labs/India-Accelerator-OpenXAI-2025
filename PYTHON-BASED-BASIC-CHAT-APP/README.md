🧠 BASIC CHAT APP (with Phi-3-mini-4k-instruct GGUF)

This is a Python + Kivy based chatbot application powered by the Phi-3-mini-4k-instruct GGUF model.
It uses a local GGUF file (optimized for llama.cpp) for offline AI inference.

📂 Project Structure
BASIC-CHAT-APP/
│──BASIC-CHAT-APP/
                  │──Phi-folder/
                                │── windows                                                                  # contains llama.cpp
                                │── phi.py                                                                   # main logic + gui
                                │── wallpaperflare.jpg                                                       # background image
                                │── phi-3-mini-4k-instruct GGUF                                              # Place your GGUF model file here
                  │── README.md                                                                              # Setup guide
                  │── Phi-model.txt                                                                          # info about which is used

⚡ Setup Instructions

1. Clone the Repository
git clone https://github.com/<your-username>/India-Accelerator-OpenXAI-2025.git
cd India-Accelerator-OpenXAI-2025/BASIC-CHAT-APP

2. Install Dependencies
You need Python 3.10+ and pip. Install:
pip install kivy

3. Download the Phi-3 GGUF Model

Download the GGUF version of Phi-3-mini-4k-instruct from Hugging Face:

👉 https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf

Place the model file (e.g. phi-3-mini-4k-instruct.Q4_K_M.gguf) inside:

India-Accelerator-OpenXAI-2025/BASIC-CHAT-APP/Phi-folder/


Final structure:

BASIC-CHAT-APP/
│──BASIC-CHAT-APP/
                  │──Phi-folder/
                                │── windows                                                                  # contains llama.cpp
                                │── phi.py                                                                   # main logic + gui
                                │── wallpaperflare.jpg                                                       # background image
                                │── phi-3-mini-4k-instruct GGUF                                              # Place your GGUF model file here
                  │── README.md                                                                              # Setup guide
                  │── Phi-model.txt                                                                          # info about which is used

4. Run the App
python phi.py


The Kivy app will load, and your local GGUF Phi model will handle the responses.

✅ Notes

You can swap different quantized GGUF versions (Q4, Q5, Q8, etc.) into Phi-folder/.

Make sure your phi.py is pointing to the correct GGUF file and llama.cpp runner.
