/*
we are trying to find the percentage at 0 compound that gives the highest 
long-term return

constant: stakedBal, fee
variable: percentage

0 compound:
  finalBal = stakedBal * (1 + percentage) - fee
1 compound:
  finalBal = (stakedBal * (1 + (percentage / 2)) - fee) * (1 + (percentage / 2)) - fee

when they equal each other, it means the 0 compound is close to optimal, as
1 compound offers no benefit over 0 compound

stakedBal * (1 + percentage) - fee = (stakedBal * (1 + (percentage / 2)) - fee) * (1 + (percentage / 2)) - fee
stakedBal * (1 + percentage) = (stakedBal * (1 + (percentage / 2)) - fee) * (1 + (percentage / 2))
https://www.wolframalpha.com/input?i=x+*+%281+%2B+z%29+%3D+%28x+*+%281+%2B+%28z+%2F+2%29%29+-+y%29+*+%281+%2B+%28z+%2F+2%29%29%2C+rearrange+for+z
  x * (1 + z) = (x * (1 + (z / 2)) - y) * (1 + (z / 2)), rearrange for z
  => z = (y ± sqrt(y(4x + y))) / x, x ≠ 0
  => percentage = (fee ± sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal, stakedBal ≠ 0
*/
// console.log((fee + Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal)
// console.log((fee - Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal)
/*
negative percentage doesnt make sense, so final equation is:
  percentage = (fee + Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal

testing the percentages of both 0 and 1 compound (percentage and percentage/2),
they both give the same returns over time, as expected, however, when you test 
the percentage in between (percentage * 3/4), it gives slightly better returns, 
though EXTREMELY minimal improvement over 0 compound. thus instead of 0 compound
percentage, we use percentage * 3/4

*/

export function rewardsToWithdrawAt(stakedBal: number, fee: number) {
    const percentage = 3/4 * (fee + Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal;
    // console.log(percentage);
    const withdrawAt = stakedBal * percentage
    // console.log(withdrawAt);
    return withdrawAt;
}
