import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { investantRentVsBuyRentalExpensePerYear, investantRentVsBuyOwnershipExpensePerYear, investantRentVsBuyInvestmentOpportunityCostPerYear } from '@/my_modules/mathhelp';

export default function InvestantSavingsCalculator() {

    const mortgageTerm = 30;
    const propertyValue = 400000;
    const downPayment = 40000;
    const mortgageRate = 0.06649;
    const homeGrowthRate = 0.03;
    const hoaFee = 50;
    const propertyTaxRate = 0.0275;
    const maintenanceCostsRate = 0.018;
    const purchaseCostsRate = 0.03;
    const sellingCostsRate = 0.08;
    const homeInsurance = 200;
    const marginalTaxRate = 0.25;
    const renovationCost = 1888;
    const monthlyRent = 2000;
    const rentGrowthRate = 0.025;
    const monthlyUtilities = 200;
    const monthlyRentInsurance = 50;
    const rentBrokerFee = 0;
    const investmentReturn = 0.05;

    let { yearlyOwnershipExpense, yearlyEquityGained } = investantRentVsBuyOwnershipExpensePerYear(
        mortgageTerm, propertyValue, downPayment, mortgageRate, homeGrowthRate, hoaFee, propertyTaxRate,
        maintenanceCostsRate, purchaseCostsRate, sellingCostsRate, homeInsurance, marginalTaxRate, renovationCost
    );

    let yearlyRentExpense = investantRentVsBuyRentalExpensePerYear(mortgageTerm, monthlyRent, rentGrowthRate, monthlyUtilities, monthlyRentInsurance, rentBrokerFee);
    let { rentalOpportunityCost, purchaseOpportunityCost } = investantRentVsBuyInvestmentOpportunityCostPerYear(yearlyRentExpense, yearlyOwnershipExpense, investmentReturn);

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
                                <div className="input-group"><label style={{fontWeight: 'bold'}}>Decision Inputs</label></div>
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
                                <div className="input-group"><label style={{fontWeight: 'bold'}}>Optional | Growth Rates</label></div>
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
                                    <label htmlFor="investment-return">Annual Investment Return (%)</label>
                                    <input
                                        type="text"
                                        id="investment-return"
                                        name="investment-return"
                                        placeholder="5.0"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group"><label style={{fontWeight: 'bold'}}>Optional | Rental Expenses</label></div>
                                <div className="input-group">
                                    <label htmlFor="rent-utility">Monthly Utility</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="rent-utility"
                                            name="rent-utility"
                                            placeholder="200"
                                            // value={formatNumberWithCommas(monthlyRent)}
                                            // onChange={(e) => handleMonthlyRentChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="rent-broker-fee">Rent Broker Fee</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="rent-broker-fee"
                                            name="rent-broker-fee"
                                            placeholder="0"
                                            // value={formatNumberWithCommas(monthlyRent)}
                                            // onChange={(e) => handleMonthlyRentChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="rent-insurance">Monthly Rent Insurance</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="rent-insurance"
                                            name="rent-insurance"
                                            placeholder="50"
                                            // value={formatNumberWithCommas(monthlyRent)}
                                            // onChange={(e) => handleMonthlyRentChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group"><label style={{fontWeight: 'bold'}}>Optional | Buying Expenses</label></div>
                                <div className="input-group">
                                    <label htmlFor="mortgage-rate">Mortgage Rate (%)</label>
                                    <input
                                        type="text"
                                        id="mortgage-rate"
                                        name="mortgage-rate"
                                        placeholder="7.0"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="mortgage-term">Mortgage Term (Years)</label>
                                    <input
                                        type="text"
                                        id="mortgage-term"
                                        name="mortgage-term"
                                        placeholder="30"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="monthly-hoa-fee">Monthly HOA Fee</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="monthly-hoa-fee"
                                            name="monthly-hoa-fee"
                                            placeholder="50"
                                            // value={formatNumberWithCommas(monthlyRent)}
                                            // onChange={(e) => handleMonthlyRentChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="annual-property-tax">Annual Property Tax Rate (%)</label>
                                    <input
                                        type="text"
                                        id="annual-property-tax"
                                        name="annual-property-tax"
                                        placeholder="1.0"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="annual-maintenance">Annual Maintenance Rate (%)</label>
                                    <input
                                        type="text"
                                        id="annual-maintenance"
                                        name="mannual-maintenance"
                                        placeholder="1.5"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="purchase-costs">Purchase Costs (%)</label>
                                    <input
                                        type="text"
                                        id="purchase-costs"
                                        name="purhcase-costs"
                                        placeholder="3.0"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="selling-costs">Selling Costs (%)</label>
                                    <input
                                        type="text"
                                        id="selling-costs"
                                        name="selling-costs"
                                        placeholder="8.0"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="homeowners-insurance">Monthly Homeowner{`'`}s Insurance</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="homeowners-insurance"
                                            name="homeowners-insurance"
                                            placeholder="2000"
                                            // value={formatNumberWithCommas(monthlyRent)}
                                            // onChange={(e) => handleMonthlyRentChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="marginal-tax-rate">Marginal Tax Rate (%)</label>
                                    <input
                                        type="text"
                                        id="marginal-tax-rate"
                                        name="marginal-tax-rate"
                                        placeholder="25.0"
                                        // value={formatNumberWithCommas(monthlyRent)}
                                        // onChange={(e) => handleMonthlyRentChange(e)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="annual-renovation">Annual Renovation</label>
                                    <div className="input-wrapper">
                                        <span className="dollar-sign">$</span>
                                        <input
                                            type="text"
                                            id="annual-renovation"
                                            name="annual-renovation"
                                            placeholder="2000"
                                            // value={formatNumberWithCommas(monthlyRent)}
                                            // onChange={(e) => handleMonthlyRentChange(e)}
                                        />
                                    </div>
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
                                                With a <span style={{color: '#E81CFF'}}>10</span> year living arrangement, it is best to <span style={{color: '#E81CFF'}}>buy</span> the home!
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