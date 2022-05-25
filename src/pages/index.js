import styles from "../styles/Home.module.css";
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet/connectors";
import TokenListRinkeby from "../assets/token-list-rinkeby.json";
import TokenListMainnet from "../assets/token-list-mainnet.json";
import { useState } from "react";
import useBalance from "../actions/useBalance";
import { InjectedConnector } from "@web3-react/injected-connector";
import React, { useEffect } from "react";
import axios from "axios";
import { web3BNToFloatString } from "../utils";

const tokenList = TokenListMainnet;

const ConnectWallet = () => {
  const api_key = "ckey_0dded0cb1b2846d3a97de858c14";
  const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 137, 4002],
  });
  const { chainId, account, activate, active, library } = useWeb3React();
  const onClick = () => {
    activate(injectedConnector);
  };

  useEffect(() => {
    console.log(chainId, account, active);
  });

  const [inputAccount, setInputAccount] = useState("");
  const [inputAddress, setInputAddress] = useState("");

  const [apiBalance, setApiBalanc] = useState([]);

  const getAllBalances = async () => {
    const promises = [];
    const chainIds = [1, 42, 137, 4002];

    chainIds.forEach((chainId) => {
      const address = account ? account : inputAddress;
      if (!address) {
        return;
      }
      const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${api_key}`;
      promises.push(axios.get(url));
    });
    let tempBalances = [];

    console.log("Here are the promises", promises);
    Promise.all(promises).then((balances) => {
      console.log("This is a balances", balances);
      balances.forEach((res) => {
        const response = res.data;
        console.log("This is the response", { response });
        const temp = response.data.items.map((item, idx) => {
          const balanceObj = {};
          const decimals = item.contract_decimals;
          const pow = new BigNumber("10").pow(new BigNumber(decimals));

          balanceObj["balance"] = web3BNToFloatString(
            item.balance,
            pow,
            4,
            BigNumber.ROUND_DOWN
          );
          balanceObj["name"] = item.contract_name;
          balanceObj["decimals"] = item.contract_decimals;
          balanceObj["symbol"] = item.contract_ticker_symbol;
          balanceObj["chain"] = chainIds[idx];

          console.log(balanceObj);
          return balanceObj;
        });
        tempBalances = [...tempBalances, ...temp];
      });

      console.log("Look at temp balances here", tempBalances);
      setApiBalanc(tempBalances);
    });
  };

  useEffect(() => {
    getAllBalances();
  }, [account, inputAccount]);

  const handleInputAccount = () => {
    setInputAccount(inputAddress);
  };

  return (
    <div>
      <div>
        <span className="fw-bold">ChainId:</span>{" "}
        <span className="details">{chainId}</span>
      </div>
      <div>
        <span className="fw-bold">Account:</span>{" "}
        <span className="details">{account}</span>
      </div>

      <div>
        <input
          onChange={(e) => setInputAddress(e.target.value)}
          className="input-field"
          placeholder="Enter address"
        />
        <button className="btn" type="button" onClick={handleInputAccount}>
          Fetch Balance
        </button>
      </div>

      <bold>OR</bold>
      {active ? (
        <div className="connected">Wallet Connected successfully :)</div>
      ) : (
        <button className="btn" type="button" onClick={onClick}>
          Connect Wallet
        </button>
      )}

      {apiBalance.map((balance) => {
        return (
          <div key={balance.name} className="balance">
            {balance.name} ({balance.chain}) balance{" "}
            <span className="value">{balance.balance}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
  const [selectedToken, setSelectedToken] = useState(tokenList[0]);

  const { activate, account, active } = useWeb3React();
  const [balances, setBalances] = useState([]);

  return (
    <div className="home">
      <ConnectWallet />

      {/*
      
      <select onChange={(e) => setSelectedToken(tokenList[e.target.value])}>
        {tokenList.map((token, index) => (
          <option value={index} key={token.address}>
            {token.name}
          </option>
        ))}
      </select>

      {balances.map((balance) => {
        return (
          <span key={balance.address} className="balance">
            {balance.name} balance{" "}
            <span className="value">{balance.balance}</span>
          </span>
        );
      })}

      <span className="balance">
        balance <span className="value">{balance}</span>
      </span>
    </div>
      */}
    </div>
  );
}
