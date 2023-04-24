import React, { useEffect, useState } from "react";
import {createGiveaway} from "../ethers";


export default function CreateForm() {

  const [imageHash, setImageHash] = useState(null);
  const [metadataHash, setMetadataHash] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const deadline = formData.get("deadline");
    const desc = formData.get("description");

    try {
        await createGiveaway(deadline, desc);
    } catch(e) {
        console.log("createNFT", e);
    }
  };

  return (
    <section className="section create-form-wrapper">
      <h2>Create Giveaway</h2>
      <div>
        <form className="create-form" onSubmit={handleSubmit}>
            <label htmlFor="deadline">Deadline:</label>
            <input type="text" name="deadline" required />
            <label htmlFor="description">Description:</label>
            <textarea name="description" required />
          <button className="button button-main" type="submit">Create Giveaway</button>
        </form>
      </div>
    </section>
  );
}
