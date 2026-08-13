from flask import Flask, render_template, jsonify
import pyaudio
import numpy as np
import threading
import time
from yamnet_helper import AudioEventDetector

app = Flask(__name__)

# -- Global State --
detector = AudioEventDetector()
current_data = {"event": "Initializing...", "confidence": 0, "timestamp": ""}
running = True

# -- Audio Config --
CHUNK = 16000 * 1  # 1 sec
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

def audio_loop():
    global current_data, running
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
    
    print("--- Microphone is Live ---")
    
    while running:
        try:
            data = stream.read(CHUNK, exception_on_overflow=False)
            audio_np = np.frombuffer(data, dtype=np.int16)
            event, conf = detector.predict(audio_np)
            
            current_data = {
                "event": event,
                "confidence": round(conf * 100, 1),
                "timestamp": time.strftime("%H:%M:%S")
            }
        except Exception as e:
            print(f"Audio Error: {e}")

# Start background thread
t = threading.Thread(target=audio_loop)
t.daemon = True
t.start()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/status')
def status():
    return jsonify(current_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)