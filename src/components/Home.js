import {useState, useEffect} from "react";
import {
    init,
    connectWallet,
    fetchBalance,
    accountAddress,
    network,
    handleAccountsChanged,
    getContractName, getContractAdmin, getAllGiveaways
} from "../ethers";
import CreateForm from "./CreateForm";
import ListingList from "./ListingList";
import OwnedList from "./OwnedList";
import GiveawayTable from "./GiveawayTable";
import MintNFT from "./MintNFT";

function Home() {
    const [connected, setConnected] = useState(false);
    const [contractName, setContractName] = useState(false);
    const [balance, setBalance] = useState(null);
    const [currentAccount, setCurrentAccount] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const [giveawayList, setGiveawayList] = useState([]);

    const [listLoading, setListLoading] = useState(true)


    useEffect(() => {
        // Fetch data here
        handleFetchGiveaways().then(() => {
            setListLoading(false);
        });
    }, [])

    useEffect(() => {
        init().then(() => {
            handleGetContractName();
        })

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                handleAccountsChanged(accounts);
            });

            window.ethereum.on("chainChanged", (_chainId) => window.location.reload());
        }
    }, []);


    async function handleConnectWallet() {
        try {
            let t = await connectWallet();
            setConnected(true);
            setCurrentAccount(t);

            let t1 = await getContractAdmin();
            setIsAdmin(t === t1);


        } catch (error) {
            console.log("handleConnectWallet", error);
        }

    }

    function handleDisconnectWallet() {
        window.location.reload();
    }

    async function handleFetchGiveaways() {
        try {
            let list = await getAllGiveaways();

            setGiveawayList(list);
        } catch (e) {
            console.log(e)
        }
    }

    async function handleFetchBalance() {
        if (connected) {
            const balance = await fetchBalance();
            setBalance(balance);
        }
    }

    async function handleGetContractName() {
        if (network.name === 'goerli') {

            const name = await getContractName();
            setContractName(name);
        }
    }

    return (
        <div>
            <section className="nav">
                <h1>{contractName}</h1>
                {!connected &&
                    <button className="button button-main" onClick={handleConnectWallet}>Connect Wallet</button>}
                {connected &&
                    <>
                        <div className="right">
                            <span>{network.name}</span>
                            <span>{isAdmin && "Hello admin!"}</span>
                            <span>{!isAdmin && currentAccount}</span>
                            <span>{}</span>

                            <button className="button button-alt" onClick={handleDisconnectWallet}>Disconnect Wallet
                            </button>
                        </div>
                    </>
                }
            </section>

            {connected && !listLoading && <GiveawayTable data={giveawayList}/>}
            {connected && (
                <>
                    <OwnedList/>
                </>
            )}

            {connected && isAdmin && <CreateForm/>}
            {connected && isAdmin && <ListingList/>}
            {connected && isAdmin && <MintNFT/>}


            {/* {connected && (
        <>
          <span>Network: {network.name}</span>
          {network.name === "goerli" ? (
            <>
              <span>Congrats! That's the right nework</span>
              <button onClick={handleFetchBalance}>Fetch Balance</button>
            </>
          ) : (
            <span>You must switch to Goerli</span>
          )}
          <button onClick={handleDisconnectWallet}>Disconnect Wallet</button>
        </>
      )} */}
        </div>
    );
}

export default Home;
