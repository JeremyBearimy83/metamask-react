import styles from "../styles/Home.module.css";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet/connectors";
import TokenListRinkeby from "../assets/token-list-rinkeby.json";
import { useState } from "react";
import useBalance from "../actions/useBalance";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import React, { useEffect } from "react";

export default function Home() {
  const [selectedToken, setSelectedToken] = useState(TokenListRinkeby[0]);

  const { activate, account, active } = useWeb3React();

  const [balance] = useBalance(selectedToken.address, selectedToken.decimals);

  const ConnectWallet = () => {
    const injectedConnector = new InjectedConnector({
      supportedChainIds: [1, 3, 4, 5, 42, 137],
    });
    const { chainId, account, activate, active, library } = useWeb3React();
    const onClick = () => {
      activate(injectedConnector);
    };

    useEffect(() => {
      console.log(chainId, account, active);
    });

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
        {active ? (
          <div className="connected">Wallet Connected successfully :)</div>
        ) : (
          <button className="btn" type="button" onClick={onClick}>
            Connect Wallet
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <ConnectWallet />
      <select
        onChange={(e) => setSelectedToken(TokenListRinkeby[e.target.value])}
      >
        {TokenListRinkeby.map((token, index) => (
          <option value={index} key={token.address}>
            {token.name}
          </option>
        ))}
      </select>
      <span className="balance">
        {selectedToken.name} balance <span className="value">{balance}</span>
      </span>
    </div>
  );
}
