function calculateLoan(){
    loanAmountValue = document.getElementById('loan-amount').value

    interestRateValue = document.getElementById('interest-rate').value
    
    monthsToPayValue = document.getElementById('months-to-pay').value

    interest = (loanAmountValue * (interestRateValue * 0.01)) / monthsToPayValue

    monthlyPayment = (loanAmountValue / monthsToPayValue + interest);

    document.getElementById('payment').innerHTML = `Monhtly Payment: ${monthlyPayment}`;
}