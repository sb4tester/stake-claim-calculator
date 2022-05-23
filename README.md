<h1 align="center">
  stake claim calculator
</h1>



<h3 align="center">
  ✨ <a href="https://nogira.github.io/stake-claim-calculator/">click here to calculate</a> ✨
</h3>

<br>

<h2 align="center">
  formula for when to claim rewards
</h2>

$$
balance_\mathrm{rewards} \ = 
  \ \cfrac
    {2 \ \times \ \left(
      fee \ + 
        \ \sqrt{
          fee \ \times \ ( (4 \ \times \ balance_\mathrm{staked}) \ + \ fee ) 
        } 
    \right) }
    {3}
$$

<br>

<p>
  we want to find the rewards balance at the point of the first compound (the next claim) that gives the highest long-term return. we will first find the rewards balance as a percentage of the total staked balance. This is because the measurement of percentage interest acts as a measurement of time to which we can compare different numbers of compound cycles. for instance, if you were to compare 1 compound vs 2 compounds over a period of 2 days, and over those 2 days you have 1% staking interest, 1 compound would get 1% staking rewards of the initial balance, while 2 compounds would get 0.5% staking rewards of the initial balance plus 0.5% staking rewards of the staking balance after the first compound.
</p>
<br>

- **constants**:
  - `stakedBal`:  the balance staked
  - `fee`: the total fees paid to both claim rewards and stake those rewards
- **variables**:
  - `percentage`: the optimal rewards balance at which to claim, measured as a percentage of `stakedBal`
<br>

formula if **1** compound occured:
```js
finalBal = stakedBal * (1 + percentage) - fee
```
formula if **2** compounds occured:
```js
finalBal = (stakedBal * (1 + (percentage / 2)) - fee) * (1 + (percentage / 2)) - fee
```

<p>
  we are trying to maximize the compounding of interest by picking the perfect rewards balance to claim at, keeping in mind that fees will be taken from the rewards balance. if the fees are large compared to the rewards, it will take away most of the rewards, leaving little to compound. if the rewards are too large compared to the fees, you don't get enough compounding cycles.

  when 2 compounds has higher returns than 1 compound, it means the percentage claimed at 1 compound is too high, as we were able to benefit from additional compounding by claiming at a smaller percentage. when 2 compounds is lower than 1 compound it can be good, as it indicates the claimed amount isn't too high, but intuitively, there is diminishing returns, as if you claim at too small an amount, the fees will remove all your profit. a good inbetween point, at least for now, is when the formula for 1 compound equals the formula for 2 compounds:
</p>

```js
stakedBal * (1 + percentage) - fee = (stakedBal * (1 + (percentage / 2)) - fee) * (1 + (percentage / 2)) - fee
// simplified by adding `fee` to both sides
stakedBal * (1 + percentage) = (stakedBal * (1 + (percentage / 2)) - fee) * (1 + (percentage / 2))
```

<br>

<a href="https://www.wolframalpha.com/input?i=x+*+%281+%2B+z%29+%3D+%28x+*+%281+%2B+%28z+%2F+2%29%29+-+y%29+*+%281+%2B+%28z+%2F+2%29%29%2C+rearrange+for+z">plug this into wolfram alpha</a> to solve for `percentage`:
```
x * (1 + z) = (x * (1 + (z / 2)) - y) * (1 + (z / 2)), rearrange for z
```
result:
```
z = (y ± sqrt(y(4x + y))) / x, x ≠ 0
```

<br>

this gives us:
```js
percentage = (fee ± sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal, stakedBal ≠ 0

// console.log((fee + Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal)
// console.log((fee - Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal)

// As stakedBal should never equal 0, and the negative version of ± gives a
// negative percentage, which is not possible, the final equation is:
percentage = (fee + Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal
```

<p>
  the formula above gives a reasonably optimal percentage to claim rewards at, but we can take it a bit further

  if we plug in the optimal percentage, as calculated above, into both the 1 compound formula and 2 compound formula from much earlier (equating time by using `percentage` for 1 compound, and `percentage / 2` for 2 compounds), they both give the same `finalBal` as expected (and thus returns over time).
  
  however, if we do a test run of **1)** 2 cycles at `percentage` per cycle, **2)** 3 cycles at `2/3 * percentage` per cycle, and **3)** 4 cycles at `percentage / 2` per cycle (all 3 tests equating time by adding up to a time of `2 * percentage`), you find that while 1) and 3) are roughly the same (having more cycles skews the results a bit from them being exactly the same, because ideally you should be calculating a new `%` for each cycle), 2) gives _EXTREMELY_ slightly higher returns. because the better returns are so minute, there is no need to further optimize, especially considering the increase in error as we try more and more cycles of the same percentage in a row (in the same vein as done above) in order to test optimizations.
</p>


thus, we shall change our optimal percentage formula slightly by adding `2/3 *` to the start:
```js
percentage = 2/3 * (fee + Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal
```

<br>

we would then use this percentage to calculate the balance to withdrawl at:
```js
percentage = 2/3 * (fee + Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal;
withdrawAt = stakedBal * percentage;
```

however, we see when we combine the two calculations, we get the following:
```js
withdrawAt = stakedBal * 2/3 * (fee + Math.sqrt(fee * ((4 * stakedBal) + fee))) / stakedBal;
```

it is both multiplied by and divided by `stakedBal`, so instead we can remove these to give are absolute **FINAL** formula of:
```js
withdrawAt = 2/3 * (fee + Math.sqrt(fee * ((4 * stakedBal) + fee)));
```
