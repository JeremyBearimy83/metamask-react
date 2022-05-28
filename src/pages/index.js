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
import Loader from "../../public/loader";
import VaultGrid from "../components/Table";

const tokenList = TokenListMainnet;

const chainList = [
  { name: "All", chainId: 0 },
  { name: "Polygon Mainnet", chainId: 137 },
  { name: "Ethereum Mainnet", chainId: 1 },
  { name: "Fantom Tesetnet", chainId: 4002 },
  { name: "42", chainId: 42 },
];

const ConnectWallet = () => {
  const api_key = "ckey_0dded0cb1b2846d3a97de858c14";
  const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 137, 4002],
  });
  const { chainId, account, activate, active, library } = useWeb3React();
  const onClick = () => {
    activate(injectedConnector);
    setInputAccount(account);
  };

  useEffect(() => {
    console.log(chainId, account, active);
  });

  const [inputAccount, setInputAccount] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // aggregatedBalances
  const [aggBalance, setAggBalance] = useState({
    totBalance: 0,
    numAssets: 0,
    numNetworks: 0,
  });
  const [apiBalance, setApiBalanc] = useState([]);

  const getAllBalances = async () => {
    setLoading(true);
    const promises = [];
    const chainIds = [1, 42, 137, 4002];

    chainIds.forEach((chainId) => {
      const address = inputAccount;
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

      let tempTotBalance = 0;
      let tempNumAssets = 0;
      let tempNumNetworks = 0;
      balances.forEach((res) => {
        const response = res.data;
        console.log("This is the response", { response });
        const commonChainId = response.data.chain_id;
        const temp = response.data.items.map((item, idx) => {
          if (idx == 0) tempNumNetworks++;
          tempNumAssets++;
          const balanceObj = {};
          const decimals = item.contract_decimals;
          const pow = new BigNumber("10").pow(new BigNumber(decimals));
          tempTotBalance = tempTotBalance + item.quote;

          balanceObj["balance"] = web3BNToFloatString(
            item.balance,
            pow,
            4,
            BigNumber.ROUND_DOWN
          );
          balanceObj["name"] = item.contract_name;
          balanceObj["decimals"] = item.contract_decimals;
          balanceObj["symbol"] = item.contract_ticker_symbol;
          balanceObj["chain"] = commonChainId;
          balanceObj["address"] = item.contract_address;
          balanceObj["assetId"] = `${commonChainId}-${item.contract_address}`;
          console.log(balanceObj);
          return balanceObj;
        });
        tempBalances = [...tempBalances, ...temp];
      });

      console.log("Look at temp balances here", tempBalances);
      setLoading(false);
      setApiBalanc(tempBalances);
      setAggBalance({
        totBalance: tempTotBalance,
        numAssets: tempNumAssets,
        numNetworks: tempNumNetworks,
      });
    });
  };

  useEffect(() => {
    console.log("Does this run", inputAccount);
    getAllBalances();
  }, [inputAccount]);

  useEffect(() => {
    console.log("When does this run?");
    if (account) {
      setInputAccount(account);
    }
  }, [account]);

  const handleInputAccount = () => {
    setInputAccount(inputAddress);
  };

  const [chainIdFilter, setChainIdFilter] = useState(0);

  const filterBalances = (balances) => {
    console.log("When is thiis function called", chainIdFilter, balances);
    if (chainIdFilter == 0) return balances;

    const filteredBalances = balances.filter((b) => {
      console.log(
        "Inside the filter",
        b.chain,
        chainIdFilter,
        b.chain == chainIdFilter
      );
      return b.chain == chainIdFilter;
    });
    console.log("Filtered balances", filteredBalances);
    return filteredBalances;
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
      <div className="fw-bold agg-balance-text">
        You have
        <span className="gradient-text">
          $ {aggBalance.totBalance.toFixed(2)}
        </span>
        in <span className="gradient-text">{aggBalance.numAssets}</span> assets
        across <span className="gradient-text">{aggBalance.numNetworks}</span>
        networks available to stake
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
      {active && (
        <div className="connected">Wallet Connected successfully :)</div>
      )}
      <button className="btn" type="button" onClick={onClick}>
        Connect Wallet
      </button>
      <div>
        <select onChange={(e) => setChainIdFilter(e.target.value)}>
          {chainList.map((chain) => (
            <option value={chain.chainId} key={chain.chainId}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>

      <div className="loader">{loading && <Loader />}</div>

      {filterBalances(apiBalance).map((balance) => {
        return (
          <div key={balance.assetId} className="balance">
            {balance.name} ({balance.chain}):
            <span className="value">{balance.balance}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
  return (
    <div className="home flex bg-orange-900">
      <div className="p-5 bg-red-500">hueue</div>
      <ConnectWallet />
      <VaultGrid />
    </div>
  );
}
