import React from 'react';
import {pickWinner} from "../ethers";

export default function ListingList() {

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const giveawayID = formData.get("giveawayID");

        try {
            await pickWinner(giveawayID);
        } catch (e) {
            console.log("createNFT", e);
        }
    };

    return (
        <section className="section create-form-wrapper">
            <h2>Pick a winner</h2>
            <div>
                <form className="create-form" onSubmit={handleSubmit}>
                    <label htmlFor="giveawayID">GiveawayID:</label>
                    <input type="text" name="giveawayID" required/>
                    <button className="button button-main" type="submit">Pick winner</button>
                </form>
            </div>
        </section>
    );
}
