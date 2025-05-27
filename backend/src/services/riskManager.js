// Example function to check if risk limits are exceeded
function checkRisk(accountBalance, tradeVolume, maxRiskPercent = 1) {
  const riskAmount = (maxRiskPercent / 100) * accountBalance;
  // Here implement your logic to compare riskAmount vs tradeVolume or potential loss
  // Returning true means safe to trade
  return tradeVolume <= riskAmount;
}

module.exports = { checkRisk };
