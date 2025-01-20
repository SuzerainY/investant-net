import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import InvestantRentVsBuyChart from '@/components/Charts/InvestantRentVsBuyChart';
import { investantRentVsBuyRentalExpensePerYear, investantRentVsBuyOwnershipExpensePerYear, investantRentVsBuyInvestmentOpportunityCostPerYear, formatNumberWithCommas, isWholeNumber, isDecimal } from '@/my_modules/mathhelp';

export default function InvestantSavingsCalculator() {

    // Inputs
    const [mortgageTerm, setMortgageTerm] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [mortgageRate, setMortgageRate] = useState('');
    const [homeGrowthRate, setHomeGrowthRate] = useState('');
    const [hoaFee, setHoaFee] = useState('');
    const [propertyTaxRate, setPropertyTaxRate] = useState('');
    const [maintenanceCostsRate, setMaintenanceCostsRate] = useState('');
    const [purchaseCostsRate, setPurchaseCostsRate] = useState('');
    const [sellingCostsRate, setSellingCostsRate] = useState('');
    const [homeInsurance, setHomeInsurance] = useState('');
    const [marginalTaxRate, setMarginalTaxRate] = useState('');
    const [renovationCost, setRenovationCost] = useState('');
    const [monthlyRent, setMonthlyRent] = useState('');
    const [rentGrowthRate, setRentGrowthRate] = useState('');
    const [monthlyUtilities, setMonthlyUtilities] = useState('');
    const [monthlyRentInsurance, setMonthlyRentInsurance] = useState('');
    const [rentBrokerFee, setRentBrokerFee] = useState('');
    const [investmentReturn, setInvestmentReturn] = useState('');

    const [livingYears, setLivingYears] = useState('');

    // Outputs
    const [yearlyOwnershipExpense, setYearlyOwnershipExpense] = useState({
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
        11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
        21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0
    });
    const [yearlyEquityGained, setYearlyEquityGained] = useState({
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
        11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
        21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0
    });
    const [yearlyRentExpense, setYearlyRentExpense] = useState({
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
        11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
        21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0
    });
    const [rentalInvestmentsEarned, setRentalInvestmentsEarned] = useState({
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
        11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
        21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0
    });

    useEffect(() => {
        const iMortgageTerm = mortgageTerm === '' ? 30 : parseFloat(mortgageTerm);
        const iPropertyValue = propertyValue === '' ? 400000 : parseFloat(propertyValue);
        const iDownPayment = downPayment === '' ? 80000 : parseFloat(downPayment);
        const iMortgageRate = mortgageRate === '' ? 0.07 : parseFloat(mortgageRate) / 100;
        const iHomeGrowthRate = homeGrowthRate === '' ? 0.04 : parseFloat(homeGrowthRate) / 100;
        const iHoaFee = hoaFee === '' ? 20 : parseFloat(hoaFee);
        const iPropertyTaxRate = propertyTaxRate === '' ? 0.01 : parseFloat(propertyTaxRate) / 100;
        const iMaintenanceCostsRate = maintenanceCostsRate === '' ? 0.01 : parseFloat(maintenanceCostsRate) / 100;
        const iPurchaseCostsRate = purchaseCostsRate === '' ? 0.02 : parseFloat(purchaseCostsRate) / 100;
        const iSellingCostsRate = sellingCostsRate === '' ? 0.06 : parseFloat(sellingCostsRate) / 100;
        const iHomeInsurance = homeInsurance === '' ? 200 : parseFloat(homeInsurance);
        const iMarginalTaxRate = marginalTaxRate === '' ? 0.25 : parseFloat(marginalTaxRate) / 100;
        const iRenovationCost = renovationCost === '' ? 2000 : parseFloat(renovationCost);
        const iMonthlyRent = monthlyRent === '' ? 2400 : parseFloat(monthlyRent);
        const iRentGrowthRate = rentGrowthRate === '' ? 0.025 : parseFloat(rentGrowthRate) / 100;
        const iMonthlyUtilities = monthlyUtilities === '' ? 200 : parseFloat(monthlyUtilities);
        const iMonthlyRentInsurance = monthlyRentInsurance === '' ? 50 : parseFloat(monthlyRentInsurance);
        const iRentBrokerFee = rentBrokerFee === '' ? 0 : parseFloat(rentBrokerFee);
        const iInvestmentReturn = investmentReturn === '' ? 0.05 : parseFloat(investmentReturn) / 100;

        let { iYearlyOwnershipExpense, iYearlyEquityGained } = investantRentVsBuyOwnershipExpensePerYear(
            iMortgageTerm, iPropertyValue, iDownPayment, iMortgageRate, iHomeGrowthRate, iHoaFee, iPropertyTaxRate,
            iMaintenanceCostsRate, iPurchaseCostsRate, iSellingCostsRate, iHomeInsurance, iMarginalTaxRate, iRenovationCost
        );
    
        let iYearlyRentExpense = investantRentVsBuyRentalExpensePerYear(iMortgageTerm, iMonthlyRent, iRentGrowthRate, iMonthlyUtilities, iMonthlyRentInsurance, iRentBrokerFee);
        let iRentalInvestmentsEarned = investantRentVsBuyInvestmentOpportunityCostPerYear(iYearlyRentExpense, iYearlyOwnershipExpense, iInvestmentReturn);

        setYearlyOwnershipExpense(iYearlyOwnershipExpense);
        setYearlyEquityGained(iYearlyEquityGained);
        setYearlyRentExpense(iYearlyRentExpense);
        setRentalInvestmentsEarned(iRentalInvestmentsEarned);
    }, [
        mortgageTerm, propertyValue, downPayment, mortgageRate, homeGrowthRate, hoaFee,
        propertyTaxRate, maintenanceCostsRate, purchaseCostsRate, sellingCostsRate, homeInsurance,
        marginalTaxRate, renovationCost, monthlyRent, rentGrowthRate, monthlyUtilities,
        monthlyRentInsurance, rentBrokerFee, investmentReturn
    ]);

    const sumExpense = (years, expenseObject) => {
        let totalCost = 0
        for (let i = 1; i <= years; i++) {
            totalCost += expenseObject[i];
        } return totalCost;
    };

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
                                            placeholder="400,000"
                                            value={formatNumberWithCommas(propertyValue)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setPropertyValue(e.target.value.replace(/,/g, '')) : {}}}
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
                                            placeholder="80,000"
                                            value={formatNumberWithCommas(downPayment)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setDownPayment(e.target.value.replace(/,/g, '')) : {}}}
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
                                        value={formatNumberWithCommas(livingYears)}
                                        onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setLivingYears(e.target.value.replace(/,/g, '')) : {}}}
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
                                            placeholder="2,400"
                                            value={formatNumberWithCommas(monthlyRent)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setMonthlyRent(e.target.value.replace(/,/g, '')) : {}}}
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
                                        placeholder="4.0"
                                        value={formatNumberWithCommas(homeGrowthRate)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setHomeGrowthRate(e.target.value.replace(/,/g, '')) : {}}}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="rent-growth-rate">Annual Rent Growth Rate (%)</label>
                                    <input
                                        type="text"
                                        id="rent-growth-rate"
                                        name="rent-growth-rate"
                                        placeholder="2.5"
                                        value={formatNumberWithCommas(rentGrowthRate)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setRentGrowthRate(e.target.value.replace(/,/g, '')) : {}}}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="investment-return">Annual Investment Return (%)</label>
                                    <input
                                        type="text"
                                        id="investment-return"
                                        name="investment-return"
                                        placeholder="5.0"
                                        value={formatNumberWithCommas(investmentReturn)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setInvestmentReturn(e.target.value.replace(/,/g, '')) : {}}}
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
                                            value={formatNumberWithCommas(monthlyUtilities)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setMonthlyUtilities(e.target.value.replace(/,/g, '')) : {}}}
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
                                            value={formatNumberWithCommas(rentBrokerFee)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setRentBrokerFee(e.target.value.replace(/,/g, '')) : {}}}
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
                                            value={formatNumberWithCommas(monthlyRentInsurance)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setMonthlyRentInsurance(e.target.value.replace(/,/g, '')) : {}}}
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
                                        value={formatNumberWithCommas(mortgageRate)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setMortgageRate(e.target.value.replace(/,/g, '')) : {}}}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="mortgage-term">Mortgage Term (Years)</label>
                                    <input
                                        type="text"
                                        id="mortgage-term"
                                        name="mortgage-term"
                                        placeholder="30"
                                        value={formatNumberWithCommas(mortgageTerm)}
                                        onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setMortgageTerm(e.target.value.replace(/,/g, '')) : {}}}
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
                                            placeholder="20"
                                            value={formatNumberWithCommas(hoaFee)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setHoaFee(e.target.value.replace(/,/g, '')) : {}}}
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
                                        value={formatNumberWithCommas(propertyTaxRate)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setPropertyTaxRate(e.target.value.replace(/,/g, '')) : {}}}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="annual-maintenance">Annual Maintenance Rate (%)</label>
                                    <input
                                        type="text"
                                        id="annual-maintenance"
                                        name="mannual-maintenance"
                                        placeholder="1.0"
                                        value={formatNumberWithCommas(maintenanceCostsRate)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setMaintenanceCostsRate(e.target.value.replace(/,/g, '')) : {}}}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="purchase-costs">Purchase Costs (%)</label>
                                    <input
                                        type="text"
                                        id="purchase-costs"
                                        name="purhcase-costs"
                                        placeholder="2.0"
                                        value={formatNumberWithCommas(purchaseCostsRate)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setPurchaseCostsRate(e.target.value.replace(/,/g, '')) : {}}}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="selling-costs">Selling Costs (%)</label>
                                    <input
                                        type="text"
                                        id="selling-costs"
                                        name="selling-costs"
                                        placeholder="6.0"
                                        value={formatNumberWithCommas(sellingCostsRate)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setSellingCostsRate(e.target.value.replace(/,/g, '')) : {}}}
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
                                            placeholder="200"
                                            value={formatNumberWithCommas(homeInsurance)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setHomeInsurance(e.target.value.replace(/,/g, '')) : {}}}
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
                                        value={formatNumberWithCommas(marginalTaxRate)}
                                        onChange={(e) => {(isDecimal(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setMarginalTaxRate(e.target.value.replace(/,/g, '')) : {}}}
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
                                            value={formatNumberWithCommas(renovationCost)}
                                            onChange={(e) => {(isWholeNumber(e.target.value.replace(/,/g, '')) === true || e.target.value === '') ? setRenovationCost(e.target.value.replace(/,/g, '')) : {}}}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='investant-rent-vs-buy-results-wrapper'>
                            <div className="investant-rent-vs-buy-insight-wrapper">
                                <div>
                                    <div style={{position: 'relative', width: '100%'}}>
                                        <h2>Your Financial Decision</h2>
                                        <div className="calculator-results" style={{marginBottom: '0px'}}>
                                            <h4>If you stay for <span style={{color: '#E81CFF'}}>{livingYears ? livingYears : 10}</span> years, <span className="result-amount">{yearlyOwnershipExpense[parseFloat(livingYears ? livingYears : 10)] <= yearlyRentExpense[parseFloat(livingYears ? livingYears : 10)] ? "Buying" : "Renting"}</span> is cheaper!</h4>
                                        </div>
                                        <InvestantRentVsBuyChart
                                            yearlyRentExpense={yearlyRentExpense}
                                            yearlyOwnershipExpense={yearlyOwnershipExpense}
                                            mortgageTerm={mortgageTerm}
                                        />
                                        <div className="calculator-results" style={{paddingTop: '10px'}}>
                                            <h4>After <span style={{color: '#E81CFF'}}>{livingYears ? livingYears : 10}</span> years...</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="calculator-insights">
                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <div className="insight-item" style={{width: '49%'}}>
                                            <h4>Total Cost of Renting</h4>
                                            <p><span className="insight-item-span">$ {formatNumberWithCommas((sumExpense((livingYears ? livingYears : 10), yearlyRentExpense)).toFixed(0))}</span></p>
                                        </div>
                                        <div className="insight-item" style={{width: '49%'}}>
                                            <h4>Total Cost of Buying</h4>
                                            <p><span className="insight-item-span">$ {formatNumberWithCommas((sumExpense((livingYears ? livingYears : 10), yearlyOwnershipExpense)).toFixed(0))}</span></p>
                                        </div>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <div className="insight-item" style={{width: '49%'}}>
                                            <h4>Investments Earned (Renting)</h4>
                                            <p><span className="insight-item-span">$ {formatNumberWithCommas(rentalInvestmentsEarned[livingYears ? livingYears : 10].toFixed(0))}</span></p>
                                        </div>
                                        <div className="insight-item" style={{width: '49%'}}>
                                            <h4>Equity Earned (Buying)</h4>
                                            <p><span className="insight-item-span">$ {formatNumberWithCommas((sumExpense((livingYears ? livingYears : 10), yearlyEquityGained)).toFixed(0))}</span></p>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};