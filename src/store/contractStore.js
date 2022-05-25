import ERC20ABI from "../assets/abi-erc20.json";

export function getERC20Contract(tokenAddress, web3) {
  const provider =
    "https://ethereum.api.watchdata.io/node/jsonrpc?api_key=2c8fb1a8-7eb8-4a8d-9872-82600864c4d1";
  // const web3Client = new web3(new web3.providers.HttpProvider(provider));
  console.log("Hi do i come here");
  return web3
    ? new web3.eth.Contract(ERC20ABI, tokenAddress, {
        from: web3Client.eth.defaultAccount,
      })
    : null;
}
