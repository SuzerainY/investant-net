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