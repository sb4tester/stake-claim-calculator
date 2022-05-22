export function rewardsToWithdrawAt(stakedBal: number, fee: number) {
  const withdrawAt = 2/3 * (fee + Math.sqrt(fee * ((4 * stakedBal) + fee)));
  // console.log(withdrawAt);
  return withdrawAt;
}
