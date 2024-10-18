"use client";
import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function InvestantSavingsCalculatorChart({ initialDeposit, contributions, interest, valuesNotSet }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }
        }

        const context = chartRef.current.getContext("2d");
        if (valuesNotSet === true) {
            initialDeposit = 2000;
            contributions = 5000;
            interest = 1000;
        }

        const newChart = new Chart(context, {
            type: 'doughnut',
            data: {
              labels: ['Initial Deposit', 'Contributions', 'Interest'],
              datasets: [{
                data: [initialDeposit, contributions, interest],
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
    }, [initialDeposit, contributions, interest])


    return (
        <>
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <canvas ref={chartRef}></canvas>
            </div>
        </>
    );
};