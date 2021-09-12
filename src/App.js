import { useState } from 'react';
import logo from './logo.svg';
import { Button, Modal, notification } from 'antd';
import { useMount } from 'ahooks';
// import Dapp from '@hightall/dapp-lib'
import Dapp from './lib/dapp'
import './App.css';
import {reloadDapp} from "./dapp";
import v2Abi from "./abi/ERC20.json";
import buyAbi from "./abi/Buy.json";

const { confirm } = Modal;

const price = 3000;
function App() {
  const onDappEnabled = (account) => {
    console.log('account', account)
    localStorage.setItem('account-address', account.address);
  }
  useMount(() => {
    reloadDapp(onDappEnabled);
  })
  const connectWallet = async (connectMethod) => {
    const dapp = new Dapp(connectMethod);
    dapp.onEnabled((account: any) => onDappEnabled(account));
    try {
      await dapp.enableBrowserExtension(window.networkEnv);
    } catch (e) {
      console.log(e);
    }
    if (dapp.currentAccount && dapp.currentAccount.address) {
      window.dapp = dapp;
      localStorage.setItem('connect-method', connectMethod);
      const balance = await dapp.getBalance(dapp.currentAccount.address, window.racaAddress, v2Abi, 18);
      localStorage.setItem('balance', balance)
      window.location.reload();
    }
  }
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  }
  const buy = async () => {
    if (window.dapp) {
      const price = 5000;
      const allowance = await window.dapp.getAllowance(window.dapp.currentAccount.address, window.racaAddress, window.buyTokenAddress, v2Abi, 18)
      console.log(allowance);
      if (allowance < price) {
        confirm({
          title: 'Need to Approve',
          content: 'Please approve allowance',
          onOk: async () => {
            await window.dapp.approve(window.racaAddress, v2Abi, window.buyTokenAddress, window.dapp.parseUnits(price.toString()));
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      } else {
        const tx = await window.dapp.executeContract(window.buyTokenAddress, buyAbi, "buy", ['2', '1'])
        notification.open({
          message: 'Ok',
          description: `tx hash ${tx.hash}`
        });
      }
    }
  }
  const address = localStorage.getItem('account-address')
  const balance = localStorage.getItem('balance')
  return (
    <div className="App">
      <header className="App-header">
        {address ? <div>
          <div>
            {address}
          </div>
          <div>
            {balance}
          </div>
          <div>
            <Button onClick={buy}>Buy now</Button>
          </div>
          <div>
            <Button onClick={logout}>logout</Button>
          </div>
          </div> :
          <div>
            <Button onClick={() => connectWallet('MetaMask')}>Metamask</Button>
            <Button onClick={() => connectWallet('WalletConnect')}>Wallnet Connect</Button>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
