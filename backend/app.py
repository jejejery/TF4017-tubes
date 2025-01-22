import paho.mqtt.client as mqtt
import time
import random
from PLCHandler import PLCHandler
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

# Konfigurasi InfluxDB
influxdb_url = "http://influxdb:8086"
influxdb_token = "HRkvmLl7y_UJ8zaHAy_WkFlaiT7F4uveI6WWcXGcab3vjd-g2iV9-J__5Z0y9wUOtGYejJQB1CaFHiNnZpkPhw=="
influxdb_org = "citaitb"
influxdb_bucket = "sensordata"
# Konfigurasi broker MQTT
broker = "mqtt-broker"  # Sesuai dengan nama service di docker-compose.yml
port = 1884
topic = "sensor/temperature"  # Ganti topik sesuai kebutuhan

def _main():
    """Inisiasi"""
    print(f"Trying to connect to MQTT broker at {broker}:{port}")
    client = mqtt.Client()
    client.connect(broker, port)
    print(f"Connected to MQTT broker at {broker}:{port}")
    plc = PLCHandler(host="192.168.250.1", port=9600)

    # Koneksi ke PLC
    plc.connect()

    # Koneksi ke InfluxDB
    print(f"Token:{influxdb_token}")
    influx_client = InfluxDBClient(url=influxdb_url, token=influxdb_token)
    
    write_api = influx_client.write_api(write_options=SYNCHRONOUS)

    # Time config

    sensor_time = time.time()
    publish_time = time.time()

    # global variable config
    temperature = 0
    message = f"{temperature} °C"

    while True:
        
        # temperature = round(random.uniform(25.0, 30.0), 2)


        if(time.time() - sensor_time > 1): # 1 detik sekali:
            # renew the sensor time
            sensor_time = time.time()

            # Random temperature for dummy data
            temperature = round(random.uniform(25.0, 30.0), 2)
            # get the real temperature using OMRON FINS protocol
            # temperature = int(plc.read_parameter("panas"), 16)
            
            # Simpan data ke InfluxDB
            point = Point("temperature") \
                .tag("sensor", "PLC_1") \
                .field("value", temperature)
            write_api.write(bucket=influxdb_bucket, org=influxdb_org, record=point)
            print(f"Data written to InfluxDB: {temperature} °C")

        
        if(time.time() - publish_time > 5): # 5 detik sekali ke mqtt
             # renew the publish time
            publish_time = time.time()
            #message
            message = f"{temperature} °C"

            # Publish data ke MQTT
            client.publish(topic, message)
            print(f"Published: {message} to topic {topic}")

        
if __name__ == "__main__":
    _main()
