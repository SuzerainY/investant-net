export const isWholeNumber = (value) => {
    const regex = /^[1-9]\d{0,19}$/;
    return regex.test(value);
};

export const isDecimal = (value) => {
    const regex = /^(0|[1-9]\d{0,19})(\.\d{0,20})?$/;
    return regex.test(value);
};

export const investantSavingsCalculatorContributions = (monthlyContribution, time, timePeriod) => {
    if (timePeriod === 'Year') {
        return Math.round(monthlyContribution * 12 * time);
    } else if (timePeriod === 'Month') {
        return Math.round(monthlyContribution * time);
    }
};

export const investantSavingsCalculatorInterest = (initialDeposit, monthlyContribution, time, timePeriod, annualRate) => {
    if (annualRate === 0) {return 0;}

    // Determine monthly rate and months
    let periodicRate = Math.pow( ( 1 + annualRate ), ( 1 / 12 ) ) - 1;
    let months = timePeriod === 'Year' ? time * 12 : time;

    // Future value of initial deposit
    const futureValueDeposit = initialDeposit * ( Math.pow( (1 + periodicRate), months ) );
    const initialDepositInterest = futureValueDeposit - initialDeposit;

    // Future value of monthly contributions
    const futureValueContributions = monthlyContribution * ( ( Math.pow( (1 + periodicRate), months ) - 1 ) / periodicRate );
    const monthlyContributionsInterest = futureValueContributions - (monthlyContribution * months);

    return initialDepositInterest + monthlyContributionsInterest;
};

export const formatNumberWithCommas = (value) => {
    const parts = value.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

export const investantRentVsBuyRentalExpensePerYear = (livingYears, mortgageTerm, monthlyRent, rentGrowthRate, monthlyUtilities, monthlyRentInsurance, rentBrokerFee) => {
    let targetYears = livingYears < mortgageTerm ? mortgageTerm : livingYears;
    if (targetYears < 1) {
        return {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
            11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
            21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0
        };
    }
    let yearlyRentExpense = {};
    for (let i = 0; i < targetYears; i++) {
        yearlyRentExpense[i + 1] = (12 * (monthlyRent + monthlyUtilities + monthlyRentInsurance)) * Math.pow((1 + rentGrowthRate), i);
    }
    yearlyRentExpense[1] += rentBrokerFee;
    return yearlyRentExpense;
};

export const investantRentVsBuyOwnershipExpensePerYear = (
    livingYears, mortgageTerm, propertyValue, downPayment, mortgageRate, homeGrowthRate, hoaFee, propertyTaxRate,
    maintenanceCostsRate, purchaseCostsRate, sellingCostsRate, homeInsurance, marginalTaxRate, renovationCost
) => {

    let targetYears = livingYears < mortgageTerm ? mortgageTerm : livingYears;
    if (targetYears < 1) {
        return {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
            11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
            21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0
        };
    }
    const futureHomeValue = propertyValue * Math.pow(1 + homeGrowthRate, targetYears);
    const annualSellingCost = (futureHomeValue * sellingCostsRate) / targetYears; // Calculate selling costs (based on future value)
    let iYearlyOwnershipExpense = {};
    let iYearlyEquityGained = {};

    const standardDeduction = 14600; // The standard deduction for a single taxpayer in the US (2024)
    const pmiRate = 0.008 / 12; // If the down payment is less than 20% of the home value, we will apply an assumed PMI cost of 0.8% until 20% equity is reached
    let pmiTotal = 0;
    let pmiMonths = 0;

    // Monthly mortgage calculation
    const periodicRate = mortgageRate / 12; // Most mortgage loans use fixed annual interest rate
    const loanAmount = propertyValue - downPayment;
    const monthlyMortgage = loanAmount <= 0 ? 0 : (periodicRate * loanAmount) / (1 - Math.pow(1 + periodicRate, -mortgageTerm * 12));
    const annualMortgage = monthlyMortgage * 12;
    let remainingPrincipal = loanAmount;
    let equityOwned = 0;
    let tempEquity = 0;

    for (let year = 1; year <= targetYears; year++) {
        const currentHomeValue = propertyValue * Math.pow(1 + homeGrowthRate, year - 1);
        
        // Calculate mortgage interest and principal for the year
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;
        let yearlyPMI = 0;
        for (let month = 0; month < 12; month++) {
            if (remainingPrincipal <= 0) {break;}
            const monthlyInterest = remainingPrincipal * periodicRate;
            const monthlyPrincipal = monthlyMortgage - monthlyInterest;
            yearlyInterest += monthlyInterest;
            yearlyPrincipal += monthlyPrincipal;
            remainingPrincipal -= monthlyPrincipal;
            if (remainingPrincipal > (0.8 * propertyValue)) {yearlyPMI += (loanAmount * pmiRate); pmiMonths += 1;} // If we haven't reached 20% equity, we continue paying PMI
        }
        pmiTotal += yearlyPMI;
        tempEquity = equityOwned;
        equityOwned = currentHomeValue - remainingPrincipal;
        iYearlyEquityGained[year] = equityOwned - tempEquity;
        
        // Calculate maintenance, property tax, and tax deductions
        const maintenance = currentHomeValue * maintenanceCostsRate;
        const propertyTax = currentHomeValue * propertyTaxRate;
        const totalDeductions = yearlyInterest + propertyTax;
        const taxSavings = totalDeductions > standardDeduction ? (totalDeductions - standardDeduction) * marginalTaxRate : 0;
        
        // Sum all costs for the year | morgage, hoa fees, insurance, property tax, pmi, maintenance, renovation, amortized selling costs, tax benefits
        iYearlyOwnershipExpense[year] = (year <= mortgageTerm ? annualMortgage : 0) + (hoaFee * 12) + (homeInsurance * 12) + propertyTax + yearlyPMI + maintenance + renovationCost + annualSellingCost - taxSavings;
    }
    iYearlyOwnershipExpense[1] += (propertyValue * purchaseCostsRate) + downPayment;
    return { iYearlyOwnershipExpense, iYearlyEquityGained };
};

export const investantRentVsBuyInvestmentOpportunityCostPerYear = (yearlyRentExpense, yearlyOwnershipExpense, investmentReturn) => {
    const totalRentYears = Object.keys(yearlyRentExpense).length;
    const totalOwnershipYears = Object.keys(yearlyOwnershipExpense).length;

    if (totalRentYears !== totalOwnershipYears) {
        return {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
            11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
            21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0
        };
    }

    let totalInvestmentValue = 0;
    let rentalInvestmentsEarned = {};

    let tempInvestment = 0;
    for (let year = 1; year <= totalRentYears; year++) {
        const rentExpense = yearlyRentExpense[year] || 0;
        const ownershipExpense = yearlyOwnershipExpense[year] || 0;

        tempInvestment = rentExpense < ownershipExpense ? ownershipExpense - rentExpense : 0;

        totalInvestmentValue += tempInvestment;
        totalInvestmentValue = totalInvestmentValue * (1 + investmentReturn);
        rentalInvestmentsEarned[year] = totalInvestmentValue;
    }
    return rentalInvestmentsEarned;
};

// Time Value of Money
// periodicRate = ((1 + annualRate)^(1/12)) - 1
// futureValue = presentValue * (1 + periodicRate)^periods
// payment = (periodicRate * presentValue) / (1 - ((1 + periodicRate)^(-periods)))