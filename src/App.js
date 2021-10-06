import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'; 
import './App.css';

// local contract address
// const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

// Ropstep contract address
const contractAddress = '0x0b317624A645f99F88b2748a9dA30eC1f9130aFc';

function App() {
  const [inputVal, setInputVal] = useState('');


  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  async function fetchGreeting() {
    if (typeof window.ethereum === 'undefined') return;

    // Q: What is the provider?
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, Greeter.abi, provider);

    try {
      const greeting = await contract.greet();
      console.log('greeting: ', greeting);

    } catch(err) {
      console.log('error fetching greeting ==>', err);
    }
  }



  async function updateGreeting() {
    if (!inputVal) return;
    if (typeof window.ethereum === 'undefined') return;
    
    await requestAccount();

    // Q: What is the provider?
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Q: What is this doing?
    const signer = provider.getSigner();

    // Q: What is this doing?
    const contract = new ethers.Contract(contractAddress, Greeter.abi, signer);

    try {
      // Initiating transaction on Greeter contract
      const transaction = await contract.setGreeting(inputVal);
      await transaction.wait(); // takes many seconds
    } catch(err) {
      console.log('error updating greeting ==>', err);
    }

    fetchGreeting();
  }


  return (
    <div className="App">
      <h1>Greeter App</h1>

      <input 
        type="button" 
        value="Fetch Greeting" 
        onClick={fetchGreeting}
      />

      <input 
        type="button" 
        value="Update Greeting" 
        onClick={updateGreeting}
      />

      <br/>
      <input 
        type="text" 
        placeholder="type a greeting..." 
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
    </div>
  );
}

export default App;
