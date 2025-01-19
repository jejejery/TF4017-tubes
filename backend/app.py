import paho.mqtt.client as mqtt
import time
import random
from PLCHandler import PLCHandler

# Konfigurasi broker MQTT
broker = "mqtt-broker"  # Sesuai dengan nama service di docker-compose.yml
port = 1884
topic = "sensor/temperature"  # Ganti topik sesuai kebutuhan

def publish_temperature():
    print(f"Trying to connect to MQTT broker at {broker}:{port}")
    client = mqtt.Client()
    client.connect(broker, port)
    print(f"Connected to MQTT broker at {broker}:{port}")
    plc = PLCHandler(host="192.168.250.1", port=9600)

    # Koneksi ke PLC
    plc.connect()


    while True:
        # Random temperature antara 25 dan 30
        # temperature = round(random.uniform(25.0, 30.0), 2)
        temperature = int(plc.read_parameter("panas"), 16)
        # get the real temperature using OMRON FINS protocol
        ...
        message = f"{temperature} °C"
        
        # Publish data ke topik
        client.publish(topic, message)
        print(f"Published: {message} to topic {topic}")
        
        # Tunggu 5 detik sebelum publish berikutnya
        time.sleep(5)

if __name__ == "__main__":
    publish_temperature()
