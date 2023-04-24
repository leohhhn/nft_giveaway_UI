import React, {useEffect, useState} from 'react';
import {accountAddress, nftBalanceOf} from "../ethers";

export default function OwnedList() {

    const [goldOwned, setGoldOwned] = useState(0);
    const [silverOwned, setSilverOwned] = useState(0);
    const [bronzeOwned, setBronzeOwned] = useState(0);

    useEffect(() => {
        handleGetOwnedNfts();
    }, []);

    async function handleGetOwnedNfts() {
        setGoldOwned((await nftBalanceOf(accountAddress, 0)).toNumber());
        setSilverOwned((await nftBalanceOf(accountAddress, 1)).toNumber());
        setBronzeOwned((await nftBalanceOf(accountAddress, 2)).toNumber());
    }

    return (
        <section className=''>
            <h2>Number of owned NFTs</h2>
            <div>
                <h3>Gold: {goldOwned}</h3>
                <h3>Silver: {silverOwned}</h3>
                <h3>Bronze: {bronzeOwned}</h3>
            </div>
        </section>
    )
}
