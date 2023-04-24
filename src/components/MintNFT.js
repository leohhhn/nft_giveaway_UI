import React from 'react';
import {mintNFTForWinner} from "../ethers";

export default function MintNFT() {

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const giveawayID = formData.get("giveawayID");

        try {
            await mintNFTForWinner(giveawayID);
        } catch (e) {
            console.log("createNFT", e);
        }
    };

    return (
        <section className="section create-form-wrapper">
            <h2>Mint NFT for Winner</h2>
            <div>
                <form className="create-form" onSubmit={handleSubmit}>
                    <label htmlFor="giveawayID">GiveawayID:</label>
                    <input type="text" name="giveawayID" required/>
                    <button className="button button-main" type="submit">Mint NFT</button>
                </form>
            </div>
        </section>
    );
}
