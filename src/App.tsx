import { useState, useEffect } from 'react'
import './App.css'

import { Space, Select, Title, NumberInput, Paper } from '@mantine/core';

import { rewardsToWithdrawAt } from './calculateRewards';

function App() {
  const [chain, setChain] = useState("Custom");
  const [claimFee, setClaimFee] = useState(0);
  const [stakeFee, setStakeFee] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [claimAt, setClaimAt] = useState(0);

  useEffect(() => {
    switch(chain) {
      case "Custom":
        break;
      case "Cosmos":
        setClaimFee(0.0014);
        setStakeFee(0.0025);
        break;
      case "Sentinel":
        setClaimFee(0.014);
        setStakeFee(0.025);
        break;
    }
    const totalFee = claimFee + stakeFee;
    if (totalFee > 0 && totalStaked > 0) {
      const num = rewardsToWithdrawAt(totalStaked, totalFee);
      // round to 6 decimal places
      const rounded = Math.round(num * 1000000) / 1000000;
      setClaimAt(rounded);
      console.log(claimAt);
    }
  })
  

  return (
    <Paper shadow="xs" p="md" className="App" >
      <Select 
        label="Blockchain Fees"
        value={chain}
        onChange={(val: string) => setChain(val)}
        data={["Custom","Cosmos", "Sentinel", "Terra"]}
      />

      <NumberInput
        label="Claim Fee"
        precision={6}
        required
        value={claimFee}
        onChange={(val: number) => setClaimFee(val)}
      />

      <NumberInput
        label="Stake Fee"
        precision={6}
        required
        value={stakeFee}
        onChange={(val: number) => setStakeFee(val)}
      />

      <NumberInput
        label="Total Staked"
        precision={6}
        required
        value={totalStaked}
        onChange={(val: number) => setTotalStaked(val)}
      />

      <Space h={20} />

      <Title order={4}>{"Claim At"}</Title>
      <Title order={1}>{claimAt}</Title>
      
      {/* <button type="button" onClick={() => setCount((count) => count + 1)}>
        count is: {count}
      </button> */}
    </Paper>
  )
}

export default App;
