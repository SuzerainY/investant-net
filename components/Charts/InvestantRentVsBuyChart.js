"use client";
import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { formatNumberWithCommas } from "@/my_modules/mathhelp";

Chart.register(...registerables);

export default function InvestantRentVsBuyChart({ yearlyRentExpense, yearlyOwnershipExpense, mortgageTerm }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }
        }

        const pointsCount = 30; // mortgageTerm
        let labels = [];
        for (let i = 1; i <= pointsCount; i++) {labels.push(i);}

        let rentData = [];
        for (let key in yearlyRentExpense) {rentData.push(Math.round(yearlyRentExpense[key] / 12));}

        let buyData = [];
        for (let key in yearlyOwnershipExpense) {buyData.push(Math.round(yearlyOwnershipExpense[key] / 12));}

        const context = chartRef.current.getContext("2d");
        const newChart = new Chart(context, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Rental Expense',
                        data: rentData,
                        borderColor: '#E81CFF',
                        backgroundColor: '#E81CFF',
                        tension: 0.2
                    },
                    {
                        label: 'Ownership Expense',
                        data: buyData,
                        borderColor: '#40C9FF',
                        backgroundColor: '#40C9FF',
                        tension: 0.2
                    }
                ]
            },
            options: {
                responsive: true,
                elements: {
                    point: {
                    radius: 0,
                        hoverRadius: 15,
                        hitRadius: 100
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Years',
                            font: {
                                family: ['Montserrat', 'sans-serif'],
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: true
                        },
                        title: {
                            display: true,
                            text: 'Avg Monthly Expense',
                            font: {
                                family: ['Montserrat', 'sans-serif'],
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: (value, index, values) => {
                                return '$' + formatNumberWithCommas(value)
                            }
                        }
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            color: '#1B0053',
                            font: {
                                family: ['Montserrat', 'sans-serif'],
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    title: {display: false}
                }
            }
        });
        chartRef.current.chart = newChart;
    }, [yearlyRentExpense, yearlyOwnershipExpense, mortgageTerm])


    return (
        <>
            <div style={{position: 'relative', width: '100%', maxHeight: '420px'}}>
                <canvas ref={chartRef}></canvas>
            </div>
        </>
    );
};