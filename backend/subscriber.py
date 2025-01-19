import paho.mqtt.client as mqtt

# Konfigurasi broker MQTT
address = "192.168.14.252"
port = 1884
topic = "sensor/temperature"

# Callback untuk menangani pesan yang diterima
def on_message(client, userdata, message):
    print(f"Temperature received: {message.payload.decode()} from topic {message.topic}")

def subscribe_temperature():
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(address, port)
    client.subscribe(topic)
    print(f"Subscribed to topic {topic}")
    client.loop_forever()

if __name__ == "__main__":
    subscribe_temperature()