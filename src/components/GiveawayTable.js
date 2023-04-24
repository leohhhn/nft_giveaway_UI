import {useState} from 'react';
import {ethers} from "ethers";
import {approveERC20, getContract, participateInGiveaway} from "../ethers";


export default function GiveawayTable(props) {

    const [list, setList] = useState(props.data);

    function winnerExists(winner) {
        return winner !== ethers.constants.AddressZero
    }

    async function handleApprove(token) {
        await approveERC20(token);
    }

    async function handleParticipate(index, token) {
        await participateInGiveaway(index, token);
    }


    function stillActive(deadline) {
        return deadline > 0;
    }

    return (
        <table className="table table-striped">
            <thead>
            <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Treasury Size</th>
                <th>Winner</th>
                <th>Minutes left</th>
                <th>Approvals</th>
                <th>Participate</th>
            </tr>
            </thead>
            <tbody>
            {list.map((item, index) => (
                    <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.description}</td>
                        <td>{item.treasurySize}</td>
                        <td>{winnerExists(item.winner) ? item.winner : "No winner yet!"}</td>
                        <td>{item.deadline}</td>
                        <td>
                            {stillActive(item.deadline) && <div>
                                <label>Approve:</label>
                                <button className="btn btn-primary btn-sm" onClick={() => {
                                    handleApprove(0)
                                }}>LINK
                                </button>
                                <button className="btn btn-primary btn-sm" onClick={() => {
                                    handleApprove(1)
                                }}>USDC
                                </button>
                                <button className="btn btn-primary btn-sm" onClick={() => {
                                    handleApprove(2)
                                }}>USDT
                                </button>
                            </div>
                            }
                        </td>
                        <td>{stillActive(item.deadline) &&
                            <div>
                                <label>Participate with: </label>
                                <button className="btn btn-primary btn-sm" onClick={() => {
                                    handleParticipate(index, 0)
                                }}>LINK
                                </button>
                                <button className="btn btn-primary btn-sm" onClick={() => {
                                    handleParticipate(index, 1)
                                }}>USDC
                                </button>
                                <button className="btn btn-primary btn-sm" onClick={() => {
                                    handleParticipate(index, 2)
                                }}>USDT
                                </button>
                            </div>}
                        </td>
                    </tr>
                )
            )}
            </tbody>
        </table>

    )
        ;
}
