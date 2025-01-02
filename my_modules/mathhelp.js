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

export const investantRentVsBuyRentalExpensePerYear = (mortgageTerm, monthlyRent, rentGrowthRate, monthlyUtilities, monthlyRentInsurance, rentBrokerFee) => {
    if (mortgageTerm < 1) {return -1;}
    let yearlyRentExpense = {};
    for (let i = 0; i < mortgageTerm; i++) {
        yearlyRent[i + 1] = (12 * (monthlyRent + monthlyUtilities + monthlyRentInsurance)) * Math.pow((1 + rentGrowthRate), i);
    }
    yearlyRent[1] += rentBrokerFee;
    return yearlyRentExpense;
};

export const investantRentVsBuyOwnershipExpensePerYear = (
    mortgageTerm, propertyValue, downPayment, mortgageRate, homeGrowthRate, hoaFee, propertyTaxRate,
    maintenanceCostsRate, purchaseCostsRate, sellingCostsRate, homeInsurance, marginalTaxRate, renovationCost
) => {
    if (mortgageTerm < 1) {return -1;}
    const futureHomeValue = propertyValue * Math.pow(1 + homeGrowthRate, mortgageTerm);
    let yearlyOwnershipExpense = {};
    let standardDeduction = 14600; // The standard deduction for a single taxpayer in the US (2024)

    // Monthly mortgage calculation
    const periodicRate = mortgageRate / 12; // Most mortgage loans use fixed annual interest rate
    const loanAmount = propertyValue - downPayment;
    const monthlyMortgage = loanAmount <= 0 ? 0 : (periodicRate * loanAmount) / (1 - Math.pow(1 + periodicRate, -mortgageTerm * 12));
    const annualMortgage = monthlyMortgage * 12;
    let remainingPrincipal = loanAmount;
    
    for (let year = 1; year <= mortgageTerm; year++) {
        const currentHomeValue = propertyValue * Math.pow(1 + homeGrowthRate, year - 1);
        
        // Calculate mortgage interest and principal for the year
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;
        for (let month = 0; month < 12; month++) {
            const monthlyInterest = remainingPrincipal * periodicRate;
            const monthlyPrincipal = monthlyMortgage - monthlyInterest;
            yearlyInterest += monthlyInterest;
            yearlyPrincipal += monthlyPrincipal;
            remainingPrincipal -= monthlyPrincipal;
        }
        
        // Calculate property tax
        const propertyTax = currentHomeValue * propertyTaxRate;
        const maintenance = currentHomeValue * maintenanceCostsRate;
        const annualSellingCost = (futureHomeValue * sellingCostsRate) / mortgageTerm; // Calculate selling costs (based on future value)
        
        // Calculate tax deductions
        const totalDeductions = yearlyInterest + propertyTax;
        const taxSavings = totalDeductions > standardDeduction ? (totalDeductions - standardDeduction) * marginalTaxRate : 0;
        
        // Sum all costs for the year | morgage, hoa fees, insurance, property tax, maintenance, renovation, amortized selling costs, tax benefits
        yearlyOwnershipExpense[year] = annualMortgage + (hoaFee * 12) + (homeInsurance * 12) + propertyTax + maintenance + renovationCost + annualSellingCost - taxSavings;
    }
    yearlyOwnershipExpense[1] += propertyValue * purchaseCostsRate;

    // Just want to view the aggregate cost over each year
    let tempDict = {};
    for (let i = 0; i < mortgageTerm; i++) {
        tempDict[i + 1] = yearlyOwnershipExpense[i + 1]
        for (let j = 0; j < i; j++) {
            tempDict[i + 1] += yearlyOwnershipExpense[j + 1];
        }
    }
    console.log(yearlyOwnershipExpense);
    console.log(tempDict);
    console.log(tempDict[30]);

    return yearlyOwnershipExpense;
};

// Time Value of Money
// periodicRate = ((1 + annualRate)^(1/12)) - 1
// futureValue = presentValue * (1 + periodicRate)^periods
// payment = (periodicRate * presentValue) / (1 - ((1 + periodicRate)^(-periods)))