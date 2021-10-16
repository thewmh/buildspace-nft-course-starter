import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import AINFT from './utils/AINFT.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async () => {

        const { ethereum } = window;

        if(!ethereum) {
            console.log('Get Metamask!');
            return;
        } else {
            console.log(`Etherum object: ${ethereum}`);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log(`Found account: ${account}`);
            setCurrentAccount(account);
        } else {
            console.log("No account found");
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if(!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            console.log(`Connected: ${accounts[0]}`);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    }

    const askContractToMintNft = async () => {
        const CONTRACT_ADDRESS = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
            try {
                const { ethereum } = window;

                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, makeAnAINFT.abi, signer);

                    console.log("pop wallet, pay gas");
                    let nftTransaction = await connectedContract.makeAnAINFT();

                    console.log("mining in progress... WAIT!");
                    await nftTransaction.wait();

                    console.log(`mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTransaction.hash}`);
                } else {
                    console.log("No Etherum object.");
                }
            } catch (error) {
                console.log(error);
            }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

  // Render Methods
  const renderNotConnectedContainer = () => (
      currentAccount === "" ? 
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button> : 
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
    Mint NFT
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
