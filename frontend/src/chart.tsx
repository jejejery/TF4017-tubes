import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function RealTimeChart() {
  const setPoint = 40;
  const upperThres = 45;
  const bottomThres = 35;

  const [chartData, setChartData] = useState({
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Sensor 1",
        borderColor: "rgba(255, 0, 255, 1)",
        borderWidth: 2,
        data: [45, 30, 66, 39, 60],
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(255, 0, 255, 0)');
          gradient.addColorStop(1, 'rgba(255, 0, 255, 0.5)');
          return gradient;
        },
        tension: 0.4
      },
      {
        label: "Sensor 2",
        borderColor: "rgb(34,197,94, 1)",
        borderWidth: 2,
        data: [20, 49, 30, 55, 12],
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0)');
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0.5)');
          return gradient;
        },
        tension: 0.4
      },
      {
        label: "Upper Threshold",
        borderColor: "rgba(244, 67, 54, 1)",
        borderWidth: 2,
        borderDash: [10, 5],
        data: Array(5).fill(upperThres),
        fill: false,
        pointRadius: 0
      },
      {
        label: "Bottom Threshold",
        borderColor: "rgba(244, 67, 54, 1)",
        borderWidth: 2,
        borderDash: [10, 5],
        data: Array(5).fill(bottomThres),
        fill: false,
        pointRadius: 0,
        backgroundColor: 'transparent'
      },
      {
        label: "Set-point",
        borderColor: "rgba(244, 67, 54, 1)",
        borderWidth: 2,
        data: Array(5).fill(setPoint),
        fill: false,
        pointRadius: 0
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Real-Time Temperature History',
        color: 'white',
        font: {
          size: 12,
          responsiveSize: true
        }
      },
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 8,
            responsiveSize: true
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'white'
        },
        ticks: {
          color: "white",
          font: {
            size: 10,
            responsiveSize: true
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'white'
        },
        ticks: {
          color: "white",
          font: {
            size: 10,
            responsiveSize: true
          }
        }
      }
    }
  };

  // Function to manage data queue
  const pushAndPopData = (dataQueue, newValue, maxLength) => {
    const updatedQueue = [...dataQueue];
    if (updatedQueue.length >= maxLength) {
      updatedQueue.shift(); // Remove first element
    }
    updatedQueue.push(newValue);
    return updatedQueue;
  };

  // Update data every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setChartData(prevData => {
        const newDatasets = prevData.datasets.map(dataset => {
          if (dataset.label.includes("Sensor")) {
            const newValue = Math.floor(Math.random() * (70 - 20 + 1)) + 20; // Random between 20 and 70
            return {
              ...dataset,
              data: pushAndPopData(dataset.data, newValue, 5)
            };
          }
          return dataset;
        });

        return {
          ...prevData,
          datasets: newDatasets
        };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full h-full">
      <Line
        options={chartOptions}
        data={chartData}
        className="w-full h-full"
      />
    </div>
  );
}

export default RealTimeChart;
