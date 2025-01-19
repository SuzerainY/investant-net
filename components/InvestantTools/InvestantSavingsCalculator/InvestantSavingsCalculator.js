import { useState, useEffect } from 'react';
import Link from 'next/link';
import InvestantSavingsCalculatorChart from '@/components/Charts/InvestantSavingsCalculatorChart';
import { formatNumberWithCommas, isWholeNumber, isDecimal, investantSavingsCalculatorContributions, investantSavingsCalculatorInterest } from '@/my_modules/mathhelp';

export default function InvestantSavingsCalculator() {
    const [isTimeYears, setIsTimeYears] = useState(true);
    const handleTimeSwitchToggle = (e) => {
        if (e) {e.preventDefault();}
        setIsTimeYears(!isTimeYears);
    };

    const [savingsInitialDeposit, setSavingsInitialDeposit] = useState('');
    const [savingsContribution, setSavingsContribution] = useState('');
    const [savingsTime, setSavingsTime] = useState('');
    const [savingsInterestRate, setSavingsInterestRate] = useState('');
    const [totalContributions, setTotalContributions] = useState('');
    const [totalInterest, setTotalInterest] = useState('');
    const [totalFutureValue, setTotalFutureValue] = useState('');
  
    useEffect(() => {
        const initialAmount = savingsInitialDeposit === '' ? 0 : parseFloat(savingsInitialDeposit);
        const monthlyContribution = savingsContribution === '' ? 0 : parseFloat(savingsContribution);
        const interestRate = savingsInterestRate === '' ? 0 : parseFloat(savingsInterestRate) / 100;
        const time = savingsTime === '' ? 1 : parseFloat(savingsTime);
        const timePeriod = isTimeYears === true ? 'Year' : 'Month';
    
        if (savingsInitialDeposit === '' && savingsContribution === '') {
            setTotalContributions('');
            setTotalInterest('');
            setTotalFutureValue('');
        } else {
            let contributions = investantSavingsCalculatorContributions(monthlyContribution, time, timePeriod);
            let interestEarned = investantSavingsCalculatorInterest(initialAmount, monthlyContribution, time, timePeriod, interestRate);
            setTotalContributions(formatNumberWithCommas(contributions.toFixed(0)));
            setTotalInterest(formatNumberWithCommas(interestEarned.toFixed(2)));
            setTotalFutureValue(formatNumberWithCommas((initialAmount + contributions + interestEarned).toFixed(2)));
        }
    }, [savingsInitialDeposit, savingsContribution, savingsTime, savingsInterestRate, isTimeYears]);

    return (
        <>
            <div className='investant-savings-calculator'>
                <div className="investant-savings-calculator-section">
                    <div className="investant-savings-calculator-container">
                        <div className="investant-savings-calculator-wrapper">
                            <h2>Savings Calculator</h2>
                            <form className="calculator-form">
                                <div className="input-group">
                                    <label htmlFor="initial-deposit">Initial Deposit</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="initial-deposit"
                                            name="initial-deposit"
                                            placeholder="2,000"
                                            value={formatNumberWithCommas(savingsInitialDeposit)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setSavingsInitialDeposit(e.target.value.replace(/,/g, '')) : {}}}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="monthly-contribution">Monthly Contribution</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="monthly-contribution"
                                            name="monthly-contribution"
                                            placeholder="200"
                                            value={formatNumberWithCommas(savingsContribution)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setSavingsContribution(e.target.value.replace(/,/g, '')) : {}}}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <label htmlFor="time-period">Time Period</label>
                                        <div className="toggle-interest-switch-container">
                                            <div className={`toggle-switch ${isTimeYears ? "active" : ""}`} onClick={handleTimeSwitchToggle}>
                                                <span className="toggle-label">Years</span>
                                                <span className="toggle-label">Months</span>
                                                <div className="toggle-slider"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        id="time-period"
                                        name="time-period"
                                        placeholder="2"
                                        value={formatNumberWithCommas(savingsTime)}
                                        onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setSavingsTime(e.target.value.replace(/,/g, '')) : {}}}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="interest-rate">Annual Interest Rate (%)</label>
                                    <input
                                        type="text"
                                        id="interest-rate"
                                        name="interest-rate"
                                        placeholder="2.0"
                                        value={formatNumberWithCommas(savingsInterestRate)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setSavingsInterestRate(e.target.value.replace(/,/g, '')) : {}}}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="investant-savings-calculator-insight-wrapper">
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{margin: '0 auto 0 0'}}>
                                    <h2>Your Time Machine</h2>
                                    <div className="calculator-results">
                                        <h4>Total Savings:<span className="result-amount">$ {totalFutureValue.slice(0, -3)}</span><span className="result-amount-decimal">{totalFutureValue.slice(-3)}</span></h4>
                                    </div>
                                </div>
                            </div>

                            <div className="calculator-insights">
                                <div className="insight-item">
                                    <h4>Total Contributions</h4>
                                    <p><span className="insight-item-span">$ {totalContributions}</span></p>
                                </div>
                                <div className="insight-item">
                                    <h4>Total Interest Earned</h4>
                                    <p><span className="insight-item-span">$ {totalInterest.slice(0, -3)}</span><span className="insight-item-decimal-span">{totalInterest.slice(-3)}</span></p>
                                </div>
                                <Link href={'https://investant.net/blog/TheFinancialTimeMachine'}>
                                    <div className="insight-item">
                                        <h4><span style={{fontWeight: 'bold'}}>Blog: </span>The Financial Time Machine</h4>
                                        <p>Learn how to use this simple savings calculator to help plan your future!</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='savings-graph-wrapper'>
                            <InvestantSavingsCalculatorChart
                                initialDeposit={parseFloat(savingsInitialDeposit.replace(/,/g, '')) > 0 ? parseFloat(savingsInitialDeposit.replace(/,/g, '')) : 0}
                                contributions={parseFloat(totalContributions.replace(/,/g, ''))}
                                interest={parseFloat(totalInterest.replace(/,/g, ''))}
                                valuesNotSet={(savingsInitialDeposit === '' && savingsContribution === '') ? true : false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};