import './App.css';
import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import Thermometer from 'react-thermometer-component';

import FanAnimation from './fan';
import ThermoAnimation from './thermometer';
import ChartImage from './chart';

function App() {
  const [temperatureHot, setTemperatureHot] = useState(0);
  const [temperatureCold, setTemperatureCold] = useState(0);
  const [temperatureData, setTemperatureData] = useState({
    hot: new Array(5).fill(0),
    cold: new Array(5).fill(0)
  });
  const [isFanOn, setIsFanOn] = useState(true);
  const [mqttClient, setMqttClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');

  // MQTT Configuration
  const MQTT_BROKER = 'ws://localhost:9001/mqtt';
  const MQTT_TOPIC_TEMP_HOT = 'sensor/temperature_hot';
  const MQTT_TOPIC_TEMP_COLD = 'sensor/temperature_cold';
  const MQTT_TOPIC_FAN = 'fan';
  
  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER, {
      clientId: `react_client_${Math.random().toString(16).slice(2)}`,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      protocol: 'ws',
      path: '/mqtt',
    });
    
    client.on('connect', () => {
      setConnectionStatus('Connected');
      console.log('MQTT Connected');
      
      client.subscribe(MQTT_TOPIC_TEMP_HOT, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        }
      });
      client.subscribe(MQTT_TOPIC_TEMP_COLD, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        }
      });
      client.subscribe(MQTT_TOPIC_FAN, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        }
      });
    });
    
    client.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC_TEMP_HOT) {
        try {
          const temp = parseFloat(message.toString());
          if (!isNaN(temp)) {
            setTemperatureData(prevData => {
              const newHotTemps = [...prevData.hot];
              if (newHotTemps.length >= 5) {
                newHotTemps.shift();
              }
              newHotTemps.push(temp);
              return { ...prevData, hot: newHotTemps };
            });
            setTemperatureHot(temp);
          }
        } catch (error) {
          console.error('Error parsing temperature:', error);
        }
      }
      else if (topic == MQTT_TOPIC_TEMP_COLD){
        try {
          const temp = parseFloat(message.toString());
          if (!isNaN(temp)) {
            setTemperatureData(prevData => {
              const newColdTemps = [...prevData.cold];
              if (newColdTemps.length >= 5) {
                newColdTemps.shift();
              }
              newColdTemps.push(temp);
              return { ...prevData, cold: newColdTemps };
            });
            setTemperatureCold(temp);
          }
        } catch (error) {
          console.error('Error parsing temperature:', error);
        }
      }      
      else if (topic == MQTT_TOPIC_FAN){
        try{
          const fanState = (message.toString()) == "True"
          setIsFanOn(fanState)
        } catch (error) {
          console.error('Error parsing temperature:', error);
        }
      }
    });
    
    client.on('error', (err) => {
      console.error('Full MQTT Connection Error:', err);
      setConnectionStatus('Error');
    });
    
    setMqttClient(client);

    // Cleanup on component unmount
    return () => {
      if (client) {
        client.unsubscribe(MQTT_TOPIC_TEMP_HOT);
        client.unsubscribe(MQTT_TOPIC_TEMP_COLD);
        client.unsubscribe(MQTT_TOPIC_FAN);
        client.end();
      }
    };
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-2 overflow-hidden">
      <div className="container mx-auto max-w-7xl h-[95%]">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white border-opacity-10 p-2 sm:p-4 h-full flex flex-col">
          {/* TITLE */}
          <div className="flex flex-row items-center justify-center mb-2">
            <p className="text-4xl sm:text-2xl md:text-3xl font-bold text-white text-center">
              Temperature Monitoring System
            </p>
            <ThermoAnimation />
          </div>

          {/* Rest of the code remains the same */}
          {/* Status Bar */}
          <div className="bg-white bg-opacity-5 backdrop-blur-md rounded-lg p-1 sm:p-2 mb-2 border border-white border-opacity-10">
            <div className="flex flex-col md:flex-row justify-between text-xs sm:text-sm font-semibold text-white space-y-1 md:space-y-0">
              <div>
                Hot Temperature: <span className="text-red-400">{temperatureHot}°C</span>
              </div>
              <div>
                Cold Temperature: <span className="text-blue-400">{temperatureCold}°C</span>
              </div>
              <div>
                MQTT Status: {" "}
                <span className={
                  connectionStatus === 'Connected' 
                    ? "text-green-500" 
                    : connectionStatus === 'Error' 
                      ? "text-red-500" 
                      : "text-yellow-500"
                }>
                  {connectionStatus}
                </span>
              </div>
              <div>
                Fan Status: {" "}
                <span className={isFanOn ? "text-green-500" : "text-red-500"}>
                  {isFanOn ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-row justify-between gap-2 h-[calc(100%-120px)]">
            {/* Temperature Monitoring Section */}
            <div className="w-full bg-white bg-opacity-5 backdrop-blur-md rounded-lg p-2 border border-white border-opacity-10 flex flex-col">
              <div className="flex flex-row justify-between items-center h-full">
                <div className="flex flex-col items-center gap-y-4 w-1/6">
                  <Thermometer
                    theme="dark"
                    value={temperatureHot}
                    max="40"
                    steps="3"
                    format="°C"
                    size="large"
                    height="300"
                  />
                  <p className="text-white text-sm font-bold"><i>Hot Thermometer</i></p>
                </div>
                <div className="w-4/6 h-full">
                  <ChartImage temperatureData={temperatureData} />
                </div>
                <div className="flex flex-col items-center gap-y-4 w-1/6">
                  <Thermometer
                    theme="dark"
                    value={temperatureCold}
                    max="40"
                    steps="3"
                    format="°C"
                    size="large"
                    height="300"
                  />
                  <p className="text-white text-sm font-bold"><i>Cold Thermometer</i></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;