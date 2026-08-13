\# Intelligent Audio Event Detection System



\## Project Overview



The Intelligent Audio Event Detection System is a real-time audio monitoring application that detects and classifies acoustic events using machine learning.



The system captures live audio through a microphone, processes the audio signal, and uses the YAMNet pre-trained audio classification model to identify the most likely audio event. The detected event and confidence score are displayed through a web-based dashboard.



\## Key Features



\- Real-time audio event detection

\- Live microphone audio processing

\- Automatic audio classification using YAMNet

\- Confidence score for detected events

\- Web-based monitoring dashboard

\- Real-time status updates

\- Flask-based backend

\- HTML, CSS and JavaScript frontend



\## Technologies Used



\- Python 3.9

\- Flask

\- TensorFlow

\- TensorFlow Hub

\- YAMNet

\- NumPy

\- PyAudio

\- HTML

\- CSS

\- JavaScript



\## System Architecture



The system follows this workflow:



Microphone

&#x20;  ↓

Audio Capture

&#x20;  ↓

Audio Preprocessing

&#x20;  ↓

YAMNet Model

&#x20;  ↓

Audio Event Classification

&#x20;  ↓

Confidence Score

&#x20;  ↓

Flask Web Dashboard



\## How It Works



1\. The application starts a Flask web server.

2\. The microphone captures audio continuously.

3\. Audio is sampled at 16 kHz.

4\. The captured audio is converted into a numerical waveform.

5\. The waveform is passed to the YAMNet model.

6\. YAMNet analyzes the audio and produces classification scores.

7\. The system selects the event with the highest average confidence.

8\. The detected event, confidence percentage, and timestamp are sent to the web dashboard.

9\. The dashboard updates the detected audio event in real time.



\## Project Structure



```text

Intelligent-Audio-Event-Detection-System/

│

├── app.py

├── yamnet\_helper.py

├── requirements.txt

├── .gitignore

│

├── static/

│   ├── css/

│   │   └── style.css

│   └── js/

│       └── main.js

│

└── templates/

&#x20;   └── index.html

