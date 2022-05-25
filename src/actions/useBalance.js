import { useState, useEffect } from "react";
import { ZERO_ADDRESS, web3BNToFloatString } from "../utils";
import { getERC20Contract } from "../store/contractStore";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import { useWeb3React, useAccounts, useProvider } from "@web3-react/core";

import TokenListRinkeby from "../assets/token-list-rinkeby.json";
import TokenListMainnet from "../assets/token-list-mainnet.json";

const tokenList = TokenListMainnet;

export default function useBalance(
  tokenAddress,
  decimals,
  balances,
  setBalances
) {
  const [balance, setBalance] = useState("0");
  // const [balances, setBalances] = useState([]);
  const rpcURL = "https://ropsten.infura.io/v3/xxxx";

  const balancesExample = [
    {
      chainID: 1,
      assets: [
        { name: "eth", balance: 6.777 },
        { name: "mattic", balance: 6.88 },
      ],
    },
  ];

  const { account, library } = useWeb3React();

  useEffect(() => {
    let isCancelled = false;

    function getBalance() {
      return new Promise((resolve) => {
        if (!library || !tokenAddress) {
          resolve(new BN("0"));
          return;
        }

        try {
          if (tokenAddress === ZERO_ADDRESS) {
            library.eth
              .getBalance(account)
              .then((value) => {
                resolve(new BN(value));
              })
              .catch((error) => {
                console.log(error);
                resolve(new BN("0"));
              });
          } else {
            console.log({ account, tokenAddress, library });
            const contract = getERC20Contract(tokenAddress, library);
            console.log({ contract });
            console.log("so I dont come here");
            contract?.methods
              .balanceOf(account)
              .call()
              .then((value) => {
                console.log("So it works, what is the value, ", { value });
                resolve(new BN(value));
              })
              .catch((error) => {
                console.log("This is not working only na");
                console.log(error);
                resolve(new BN("0"));
              });
          }
        } catch (error) {
          resolve(new BN("0"));
        }
      });
    }

    // token address is passed as parameter in this case
    function getBalanceGivenTa(givenTokenAddress) {
      return new Promise((resolve) => {
        if (!library || !givenTokenAddress) {
          resolve(new BN("0"));
          return;
        }
        try {
          if (givenTokenAddress === ZERO_ADDRESS) {
            library.eth
              .getBalance(account)
              .then((value) => {
                resolve(new BN(value));
              })
              .catch((error) => {
                console.log(error);
                resolve(new BN("0"));
              });
          } else {
            const contract = getERC20Contract(givenTokenAddress, library);
            contract?.methods
              .balanceOf(account)
              .call()
              .then((value) => {
                resolve(new BN(value));
              })
              .catch((error) => {
                console.log(error);
                resolve(new BN("0"));
              });
          }
        } catch (error) {
          resolve(new BN("0"));
        }
      });
    }

    async function run() {
      let result = [];
      let promises = [];
      tokenList.forEach(async (token) => {
        promises.push(getBalanceGivenTa(token.address));
      });

      Promise.all(promises).then((balances) => {
        tokenList.forEach((token, idx) => {
          if (!isCancelled) {
            const pow = new BigNumber("10").pow(new BigNumber(token.decimals));
            // setBalance(web3BNToFloatString(bn, pow, 4, BigNumber.ROUND_DOWN));

            return result.push({
              ...token,
              balance: web3BNToFloatString(
                balances[idx],
                pow,
                4,
                BigNumber.ROUND_DOWN
              ),
            });
          }

          return result.push({ ...token, balance: 0 });
        });
      });
      console.log({ result });

      setTimeout(() => {
        setBalances(result);
      }, 3000);

      // const bn = await getBalance();
      // if (!isCancelled) {
      //   const pow = new BigNumber("10").pow(new BigNumber(decimals));
      //   setBalance(web3BNToFloatString(bn, pow, 4, BigNumber.ROUND_DOWN));
      // }
    }

    run();

    return () => {
      isCancelled = true;
    };
  }, [tokenAddress, library, decimals, account]);

  return [balance];
}
