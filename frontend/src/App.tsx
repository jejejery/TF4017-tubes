import './App.css';
import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import Thermometer from 'react-thermometer-component';

import FanAnimation from './fan';
import ThermoAnimation from './thermometer';
import ChartImage from './chart';

function App() {
  const [temperature, setTemperature] = useState(18);
  const [isFanOn, setIsFanOn] = useState(false);
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');

  // MQTT Configuration
  const MQTT_BROKER = 'ws://localhost:9001/mqtt';
  const MQTT_TOPIC = 'sensor/temperature';
  
  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER, {
      clientId: `react_client_${Math.random().toString(16).slice(2)}`,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      
      // Add explicit WebSocket options
      protocol: 'ws',
      path: '/mqtt',  // Many brokers use a specific path for WebSocket
    });
    
    // MQTT Event Handlers
    client.on('connect', () => {
      setConnectionStatus('Connecting');
      console.log('MQTT Connected');
      setConnectionStatus('Connected');
      
      // Subscribe to temperature topic
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        }
      });
    });
    
    client.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC) {
        try {
          const temp = parseFloat(message.toString());
          if (!isNaN(temp)) {
            setTemperature(temp);
          }
        } catch (error) {
          console.error('Error parsing temperature:', error);
        }
      }
    });
    
    // More detailed error logging
    client.on('error', (err) => {
      console.error('Full MQTT Connection Error:', err);
      console.error('Error Details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setConnectionStatus('Error');
    });
    
    // client.on('disconnect', () => {
    //   setConnectionStatus('Disconnected');
    // });
    
    setMqttClient(client as mqtt.MqttClient);

    // Cleanup on component unmount
    return () => {
      if (client) {
        client.unsubscribe(MQTT_TOPIC);
        client.end();
      }
    };
  }, []);

  const toggleFan = () => {
    setIsFanOn(!isFanOn);
  };

  return (
    <div className="bg-gray-700 text-white p-2 sm:p-4 flex flex-col items-center w-full min-h-screen">
      {/* TITLE */}
      <div className="pb-4 sm:pb-8 flex flex-row gap-x-2 sm:gap-x-4 items-center">
        <p className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold">Temperature Monitoring System</p>
        <ThermoAnimation />
      </div>

      {/* Main Container */}
      <div className="w-full flex flex-col gap-1">
        {/* Status Bar */}
        <div className="flex flex-col md:flex-row justify-between px-1 sm:px-2 md:px-14 text-xs sm:text-sm md:text-lg font-semibold">
          <div>
            Current Temperature: <span className="text-blue-400">{temperature}°C</span>
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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-between px-2 sm:px-4 lg:px-8 gap-4 sm:gap-8 lg:gap-0">
          {/* Temperature Monitoring Section */}
          <div className="w-full lg:w-2/3 bg-gray-800 rounded-lg p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-center">Temperature Monitoring</h2>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-x-4">
              <div className="flex flex-col items-center mb-4 sm:mb-8 lg:mb-0">
                <Thermometer
                  theme="dark"
                  value={temperature}
                  max="100"
                  steps="3"
                  format="°C"
                  size="large"
                  height="300"
                />
              </div>
              <div className="w-full lg:w-[45vw] h-[30vh] sm:h-[40vh] lg:h-[50vh]">
                <ChartImage />
              </div>
            </div>
          </div>

          {/* Fan Controller Section */}
          <div className="w-full lg:w-1/3 bg-gray-800 rounded-lg p-4 sm:p-8 lg:ml-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-center">Fan Controller</h2>
            <div className="flex flex-col items-center">
              <div className="mb-4 sm:mb-8">
                <FanAnimation />
              </div>
              {/* <button
                onClick={toggleFan}
                className={`${
                  isFanOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } text-white px-6 sm:px-12 py-2 sm:py-3 rounded-lg font-bold transition duration-300 ease-in-out text-sm sm:text-base`}
              >
                {isFanOn ? 'Turn Off' : 'Turn On'}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;