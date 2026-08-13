import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import csv

class AudioEventDetector:
    def __init__(self):
        print("--- Loading YAMNet Model... ---")
        self.model = hub.load('https://tfhub.dev/google/yamnet/1')
        self.class_names = self.load_class_names()
        print("--- Model Loaded Successfully ---")

    def load_class_names(self):
        class_map_path = self.model.class_map_path().numpy()
        class_names = []
        with tf.io.gfile.GFile(class_map_path) as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                class_names.append(row['display_name'])
        return class_names

    def predict(self, audio_data):
        # Normalize to -1.0 to 1.0 (YAMNet Requirement)
        waveform = audio_data / 32768.0
        
        # Run Inference
        scores, embeddings, spectrogram = self.model(waveform)
        scores_np = scores.numpy()
        
        # Average prediction across the 1-second clip
        mean_scores = np.mean(scores_np, axis=0)
        top_class_index = mean_scores.argmax()
        
        return self.class_names[top_class_index], float(mean_scores[top_class_index])