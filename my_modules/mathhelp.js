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
    let yearlyOwnershipExpense = {};
    let standardDeduction = 14600; // The standard deduction for a single taxpayer in the US (2024)

    // determine mortgage payments
    let periodicRate = mortgageRate / 12; // Most mortgage loans use a fixed rate
    let annualmortgage = propertyValue <= downPayment ? 0 : ((periodicRate * (propertyValue - downPayment)) / (1 - Math.pow(1 + periodicRate, mortgageTerm * -12))) * 12;

    // determine selling cost
    let finalHomeValue = propertyValue + Math.pow((1 + homeGrowthRate), mortgageTerm);
    let annualSellingCost = (finalHomeValue * sellingCostsRate) / mortgageTerm;

    // apply by year: property tax / maintenance costs / mortgage payment / hoa fee / home insurance / renovation costs / projected selling costs
    let currentPropertyValue = propertyValue;
    for (let i = 0; i < mortgageTerm; i++) {
        currentPropertyValue = propertyValue * Math.pow((1 + homeGrowthRate), i);
        yearlyOwnershipExpense[i + 1] = (currentPropertyValue * propertyTaxRate) + (currentPropertyValue * maintenanceCostsRate) + annualmortgage + (hoaFee * 12) + (homeInsurance * 12) + renovationCost + annualSellingCost;

        // if property taxes and interest paid in a given year are more than the standard deduction, then the excess above standard deduction is reduced by the marginal tax rate and returned to homeowner
        let taxDeductions = (currentPropertyValue * propertyTaxRate) + (mortgageRate * propertyValue)
        if (taxDeductions > standardDeduction) {
            yearlyOwnershipExpense[i + 1] -= (taxDeductions - standardDeduction) * marginalTaxRate;
        }
    }
    yearlyOwnershipExpense[1] += propertyValue * purchaseCostsRate;
    /*
    let tempDict = {};
    for (let i = 0; i < mortgageTerm; i++) {
        tempDict[i + 1] = yearlyOwnershipExpense[i + 1]
        for (let j = 0; j < i; j++) {
            tempDict[i + 1] += yearlyOwnershipExpense[j + 1];
        }
    }
    console.log(yearlyOwnershipExpense);
    console.log(tempDict);
    */
    return yearlyOwnershipExpense;
};

// Time Value of Money
// periodicRate = ((1 + annualRate)^(1/12)) - 1
// futureValue = presentValue * (1 + periodicRate)^periods
// payment = (periodicRate * presentValue) / (1 - ((1 + periodicRate)^(-periods)))