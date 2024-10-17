"use client";
import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function InvestantSavingsCalculatorChart() {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }
        }

        const context = chartRef.current.getContext("2d");

        const newChart = new Chart(context, {
            type: 'doughnut',
            data: {
              //labels: ['Initial Deposit', 'Contributions', 'Interest'],
              datasets: [{
                data: [2000, 5000, 1000],
                backgroundColor: [
                    'rgb(64, 201, 255)',
                    'rgb(27, 0, 83)',
                    'rgb(232, 28, 255)'
                ]
              }],

            },
            options: {
                animation: {
                    animateRotate: true
                }
            }
        });

        chartRef.current.chart = newChart;
    }, [])


    return (
        <>
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <canvas ref={chartRef}></canvas>
            </div>
        </>
    );
};