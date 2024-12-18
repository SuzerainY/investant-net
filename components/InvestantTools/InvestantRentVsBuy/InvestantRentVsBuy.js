import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import InvestantSavingsCalculatorChart from '../../Charts/InvestantSavingsCalculatorChart';

export default function InvestantSavingsCalculator() {

    return (
        <>
            <div className='investant-rent-vs-buy-calculator'>
                <div className="investant-rent-vs-buy-calculator-section">
                    <div className="investant-rent-vs-buy-calculator-container">
                        <div className="investant-rent-vs-buy-calculator-wrapper">
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <h2>Rent or Buy</h2>
                                <Image
                                    src={"/images/icons/investant-house-paint-icon.png"}
                                    alt="Investant Painted House Icon"
                                    width={45}
                                    height={45}
                                    placeholder="blur"
                                    blurDataURL={"/images/icons/investant-house-paint-icon.png"}
                                />
                            </div>
                            <form className="calculator-form">
                                <div className="input-group">
                                    <label htmlFor="property-value">Property Value</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="property-value"
                                            name="property-value"
                                            placeholder="500,000"
                                            // value={formatNumberWithCommas(propertyValue)}
                                            // onChange={(e) => handlePropertyValueChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="down-payment">Down Payment</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="down-payment"
                                            name="down-payment"
                                            placeholder="50,000"
                                            // value={formatNumberWithCommas(timePeriod)}
                                            // onChange={(e) => handleTimePeriodChange(e)}
                                        />
                                    </div>
                                </div>     
                                <div className="input-group">
                                    <label htmlFor="living-years">How Long Will You Live Here? (Years)</label>
                                    <input
                                        type="text"
                                        id="living-years"
                                        name="living-years"
                                        placeholder="10"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>                                                           
                                <div className="input-group">
                                    <label htmlFor="monthly-rent">Monthly Rent</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="monthly-rent"
                                            name="monthly-rent"
                                            placeholder="2,000"
                                            // value={formatNumberWithCommas(monthlyRent)}
                                            // onChange={(e) => handleMonthlyRentChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="home-growth-rate">Annual Home Growth Rate (%)</label>
                                    <input
                                        type="text"
                                        id="home-growth-rate"
                                        name="home-growth-rate"
                                        placeholder="5.0"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="rent-growth-rate">Annual Rent Growth Rate (%)</label>
                                    <input
                                        type="text"
                                        id="rent-growth-rate"
                                        name="rent-growth-rate"
                                        placeholder="2.5"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="investments-return">Annual Investments Return (%)</label>
                                    <input
                                        type="text"
                                        id="investments-return"
                                        name="investments-return"
                                        placeholder="5.0"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className='investant-rent-vs-buy-results-wrapper'>
                            <div className="investant-rent-vs-buy-insight-wrapper">
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <div style={{margin: '0 auto 0 0'}}>
                                        <h2>Your Financial Decision</h2>
                                        <div className="calculator-results">
                                            <h4>Recommended Option: <span className="result-amount">Buy</span></h4>
                                        </div>
                                        <div className="calculator-results">
                                            <h4>
                                                If you plan to stay in the home for <span style={{color: '#E81CFF'}}>10</span> years or more, then it is better to <span style={{color: '#E81CFF'}}>buy</span>. However, if you would not live in the home for greater than <span style={{color: '#E81CFF'}}>10</span> years, then we recommend you <span style={{color: '#E81CFF'}}>rent</span>.
                                                <br/><br/>
                                                After <span style={{color: '#E81CFF'}}>8</span> years, the total cost of renting will be <span style={{color: '#E81CFF'}}>$ 120,000</span>, as opposed to total costs of buying the home after <span style={{color: '#E81CFF'}}>8</span> years of <span style={{color: '#E81CFF'}}>$ 100,000</span>.
                                                After <span style={{color: '#E81CFF'}}>8</span> years, the investments you could earn by NOT buying the home would amount to <span style={{color: '#E81CFF'}}>$ 50,000</span>, as opposed to the total equity you could earn in the home after <span style={{color: '#E81CFF'}}>8</span> years of <span style={{color: '#E81CFF'}}>$ 75,000</span>.
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="calculator-insights">
                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <div className="insight-item" style={{width: '49%'}}>
                                            <h4>Total Cost of Renting</h4>
                                            <p><span className="insight-item-span">$ 120,000</span></p>
                                        </div>
                                        <div className="insight-item" style={{width: '49%'}}>
                                            <h4>Total Cost of Buying</h4>
                                            <p><span className="insight-item-span">$ 100,000</span></p>
                                        </div>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <div className="insight-item" style={{width: '49%'}}>
                                            <h4>Investments Earned</h4>
                                            <p><span className="insight-item-span">$ 50,000</span></p>
                                        </div>
                                        <div className="insight-item" style={{width: '49%'}}>
                                            <h4>Equity Earned</h4>
                                            <p><span className="insight-item-span">$ 75,000</span></p>
                                        </div>
                                    </div>                                    
                                    <Link href={'https://investant.net/blog/RentVsBuyGuide'}>
                                        <div className="insight-item">
                                            <h4><span style={{fontWeight: 'bold'}}>Blog: </span>Rent vs Buy Guide</h4>
                                            <p>Learn how to use this tool and make the smartest financial decision of your life!</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {/*
                            <div className='rent-vs-buy-graph-wrapper'>
                                <InvestantSavingsCalculatorChart
                                    // propertyValue={parseFloat(propertyValue.replace(/,/g, ''))}
                                    // monthlyRent={parseFloat(monthlyRent.replace(/,/g, ''))}
                                    // timePeriod={parseFloat(timePeriod)}
                                    // valuesNotSet={false}
                                />
                            </div> 
                            */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};