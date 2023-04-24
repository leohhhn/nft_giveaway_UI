import {BigNumber, ethers} from "ethers";
import GiveawayABI from "./contract/GiveawayABI.json";
import LinkERC20 from "./contract/LinkERC20.json";
import USDTERC20 from "./contract/USDTERC20.json";
import USDCERC20 from "./contract/USDCERC20.json";
import CollectionABI from "./contract/CollectionABI.json";

import {
    BRONZE_COLLECTION, GIVEAWAY_ADDRESS,
    GOLD_COLLECTION,
    LINK_ADDRESS,
    SILVER_COLLECTION,
    USDC_ADDRESS,
    USDT_ADDRESS
} from "./helpers/constants";

const contractAbi = GiveawayABI; // the ABI of your contract

let provider = null;
let signer = null;
let contract = null;
let contractAddress = GIVEAWAY_ADDRESS;
let accountAddress = null;
let network = {};

let link, usdt, usdc;

let gold, silver, bronze;

async function init() {
    // create a new provider object
    provider = new ethers.providers.Web3Provider(window.ethereum, "any"); // if we want to allow any network
    // provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`);

    // create a new contract object
    contract = new ethers.Contract(contractAddress, contractAbi, provider);
    gold = new ethers.Contract(GOLD_COLLECTION, CollectionABI, provider);
    silver = new ethers.Contract(SILVER_COLLECTION, CollectionABI, provider);
    bronze = new ethers.Contract(BRONZE_COLLECTION, CollectionABI, provider);


    // get network info
    await getNetwork();
}

async function connectWallet() {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        // request access to the user's accounts
        await window.ethereum.enable();

        // create a new signer object
        signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

        link = new ethers.Contract(LINK_ADDRESS, LinkERC20, signer);
        usdc = new ethers.Contract(USDC_ADDRESS, USDCERC20, signer);
        usdt = new ethers.Contract(USDT_ADDRESS, USDTERC20, signer);
        contract = new ethers.Contract(contractAddress, contractAbi, signer);

        // fetch signer address
        return await getAddress();
    } else {
        alert("Please install Metamask to use this feature!");
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        window.location.reload();
        // or reset all relevant state
    } else if (accounts[0] !== accountAddress) {
        accountAddress = accounts[0];
    }
}

async function getNetwork() {
    if (provider) {
        network = await provider.getNetwork();
    }
}

async function getAddress() {
    if (signer) {
        accountAddress = await getContract().signer.getAddress();
        return accountAddress;
    }
}

async function getContractAdmin() {
    return await contract.owner();
}

async function mintNFTForWinner(giveawayID) {
    await getContract().mintNFTForWinner(giveawayID);
}


async function getAllGiveaways() {
    let list = await contract.getAllGiveaways();
    let formattedList = [];

    for (let i = 0; i < list.length; i++) {

        const timestamp = (list[i]['deadline']).toNumber(); // Replace with your Unix timestamp in seconds
        const now = Math.floor(Date.now() / 1000); // Get the current Unix timestamp in seconds
        let minutesLeft = Math.floor((timestamp - now) / 60); // Calculate the number of minutes left
        console.log(`${minutesLeft} minutes left`);
        if (minutesLeft <= 0)
            minutesLeft = 0;

        formattedList[i] = {
            id: i,
            deadline: minutesLeft,
            description: ethers.utils.parseBytes32String(list[i]['description']),
            treasurySize: (list[i]['treasurySize']).toNumber(),
            winner: list[i]['winner']
        }
    }

    console.log(formattedList)
    return formattedList;

}

function getContract() {
    return contract.connect(signer);
}

async function getContractName() {
    return "Giveaway";
}

async function nftBalanceOf(address, collection) {
    switch (collection) {
        case 0:
            return await gold.balanceOf(address);
        case 1:
            return await silver.balanceOf(address);
        case 2:
            return await bronze.balanceOf(address);
        default:
            return 0;
    }
}

async function getOwnedNfts(address) {
    return await contract.getOwnedNfts(address);
}

async function approveERC20(token) {
    let t;
    switch (token) {
        case 0:
            t = await link.approve(contractAddress, ethers.utils.parseEther('1'));
            t.wait(3);
            break;
        case 1:
            t = await usdc.approve(contractAddress, ethers.utils.parseUnits('1', 6));
            t.wait(3);
            break;
        case 2:
            t = await usdt.approve(contractAddress, ethers.utils.parseUnits('1', 6));
            t.wait(3);
            break;
    }
}

async function participateInGiveaway(giveawayID, token) {
    let tokenAddress;

    switch (token) {
        case 0:
            tokenAddress = LINK_ADDRESS;
            break;
        case 1:
            tokenAddress = USDC_ADDRESS;
            break;
        case 2:
            tokenAddress = USDT_ADDRESS;
            break;
        default:
            tokenAddress = LINK_ADDRESS;
    }

    console.log("Participating with: ", tokenAddress);

    if (signer) {
        try {
            await getContract().participate(tokenAddress, BigNumber.from(giveawayID));
            return true;
        } catch (e) {
            console.log("create", e);
            return false;
        }
    }
}

async function pickWinner(giveawayID) {
    await getContract().pickWinner(giveawayID);
}

async function fetchBalance() {
    if (accountAddress !== null && network.name === "goerli") {
        const balance = await getContract().balanceOf(accountAddress);
        return balance.toString();
    }
}

async function createGiveaway(deadline, desc) {

    if (signer) {
        try {
            await getContract().createGiveaway(BigNumber.from(deadline), ethers.utils.formatBytes32String(desc));
            return true;
        } catch (e) {
            console.log("create", e);
            return false;
        }
    }
}

export {
    init,
    signer,
    ethers,
    network,
    pickWinner,
    getContract,
    getOwnedNfts,
    fetchBalance,
    nftBalanceOf,
    approveERC20,
    connectWallet,
    createGiveaway,
    accountAddress,
    getContractName,
    getAllGiveaways,
    getContractAdmin,
    mintNFTForWinner,
    participateInGiveaway,
    handleAccountsChanged,
};
