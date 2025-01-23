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
topic_hot = "sensor/temperature_hot"
topic_cold = "sensor/temperature_cold"
topic_fan = "fan"


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
    temperature_hot = 0
    temperature_cold = 0
    fan = False

    while True:
        
        # temperature_hot = round(random.uniform(25.0, 30.0), 2)


        if(time.time() - sensor_time > 1): # 1 detik sekali:
            # renew the sensor time
            sensor_time = time.time()

            # Random temperature_hot for dummy data
            # temperature_hot = round(random.uniform(25.0, 30.0), 2)
            # get the real temperature_hot using OMRON FINS protocol
            temperature_hot = int(plc.read_parameter("panas"), 16)
            temperature_cold = int(plc.read_parameter("dingin"), 16)
            fan = (int(plc.read_parameter("fan"), 16) == 1)
            
            # Simpan data ke InfluxDB
            point = Point("temperature_hot") \
                .tag("sensor", "PLC_1") \
                .field("value", temperature_hot)
            write_api.write(bucket=influxdb_bucket, org=influxdb_org, record=point)
            print(f"Data Temperature Hot written to InfluxDB: {temperature_hot} °C")

            # Simpan data ke InfluxDB
            point = Point("temperature_cold") \
                .tag("sensor", "PLC_1") \
                .field("value", temperature_cold)
            write_api.write(bucket=influxdb_bucket, org=influxdb_org, record=point)
            print(f"Data Temperature Cold written to InfluxDB: {temperature_cold} °C")

        
        if(time.time() - publish_time > 5): # 5 detik sekali ke mqtt
             # renew the publish time
            publish_time = time.time()

            # Publish data ke MQTT
            client.publish(topic_hot, f"{temperature_hot} °C")
            client.publish(topic_cold, f"{temperature_cold} °C")
            client.publish(topic_fan, f"{fan}")

        
if __name__ == "__main__":
    _main()
