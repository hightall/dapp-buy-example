import Dapp from './lib/dapp'
// import Dapp from '@hightall/dapp-lib';
import v2Abi from "./abi/ERC20.json";

export const reloadDapp = async (onEnabled) => {
  if (window.dapp || !localStorage.getItem('account-address')) return;
  // const onDappEnabled = (account) => {
  //   localStorage.setItem('account-address', account.address);
  // }
  const onDappEnabled = onEnabled;
  const connectMethod = localStorage.getItem('connect-method');
  const dapp = new Dapp(connectMethod);
  dapp.onEnabled((account) => onDappEnabled(account));
  try {
    await dapp.enableBrowserExtension(window.networkEnv);
  } catch (e) {
    console.log(e);
  }
  if (dapp.currentAccount && dapp.currentAccount.address) {
    window.dapp = dapp;
    const balance = await dapp.getBalance(dapp.currentAccount.address, window.racaAddress, v2Abi, 18);
    localStorage.setItem('balance', balance)
  }
}
