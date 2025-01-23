import React from 'react';
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

interface ChartImageProps {
  temperatureData: {
    hot: number[];
    cold: number[];
  };
}

function RealTimeChart({ temperatureData }: ChartImageProps) {
  const setPoint = 25;
  const upperThres = 35;
  const bottomThres = 30;

  const chartData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Hot Temperature",
        borderColor: "rgba(255, 99, 132, 0.8)", // Softened hot color
        borderWidth: 2,
        data: temperatureData.hot,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(255, 99, 132, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 99, 132, 0.3)');
          return gradient;
        },
        tension: 0.4
      },
      {
        label: "Cold Temperature",
        borderColor: "rgba(54, 162, 235, 0.8)", // Softened cold color
        borderWidth: 2,
        data: temperatureData.cold,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(54, 162, 235, 0.1)');
          gradient.addColorStop(1, 'rgba(54, 162, 235, 0.3)');
          return gradient;
        },
        tension: 0.4
      },
      {
        label: "Upper Threshold",
        borderColor: "rgba(255, 255, 255, 0.5)", // Softer white threshold
        borderWidth: 2,
        borderDash: [10, 5],
        data: Array(5).fill(upperThres),
        fill: false,
        pointRadius: 0
      },
      {
        label: "Bottom Threshold",
        borderColor: "rgba(255, 255, 255, 0.5)", // Softer white threshold
        borderWidth: 2,
        borderDash: [10, 5],
        data: Array(5).fill(bottomThres),
        fill: false,
        pointRadius: 0,
        backgroundColor: 'transparent'
      },
      {
        label: "Set-point",
        borderColor: "rgba(255, 255, 255, 0.7)", // Slightly more visible set-point
        borderWidth: 2,
        data: Array(5).fill(setPoint),
        fill: false,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Real-Time Temperature History',
        color: 'rgba(255, 255, 255, 0.8)',
        font: {
          size: 12,
          weight: 'bold',
          responsiveSize: true
        }
      },
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 8,
            responsiveSize: true
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleColor: 'white',
        bodyColor: 'rgba(255, 255, 255, 0.8)'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 10,
            responsiveSize: true
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 10,
            responsiveSize: true
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full bg-black bg-opacity-5 backdrop-blur-md rounded-lg">
      <Line
        options={chartOptions}
        data={chartData}
        className="w-full h-full"
      />
    </div>
  );
}

export default RealTimeChart;