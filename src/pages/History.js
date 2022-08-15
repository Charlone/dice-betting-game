import React, { useEffect, useState } from 'react';
import Button from "../components/common/Button";
import axios from "axios";
import Header from "../components/common/Header";

const History = ({balance, username}) => {
    // state vars needed by the component
    // state variable holding the bet history of the player
    const [betHistory, setBetHistory] = useState([]);
    // set the start balance to reconstruct the balances at each play
    const userStartBalance = localStorage.getItem('start-balance');
    // the var to do the sum for the balance at each round
    let balanceChange = 0;

    // get the data from server
    useEffect(() => {
        axios.get(`http://localhost:3000/get-user/${username}`)
            .then(response => {
                // add balance to response data with workings on how much was the balance at each round
                response.data.betHistory.forEach((row, index) => {
                    // if user lost reduce stake amount from his balance,
                    // however if player won we add win amount less the stake to the balance
                    // since we are doing (userStartBalance - balanceChange) we need to invert
                    // as - - makes + and - + makes -
                    // we also do the calculation after the first setup so as not to affect the first balance started with
                    (row.result === 'LOST')
                        ? balanceChange += row.stake
                        : balanceChange -= (row.amountWon - row.stake);

                    row['balance'] = (userStartBalance - balanceChange);
                })

                // sorting the data so that the latest bets are presented first
                let sortedHistoryData = response.data.betHistory.sort((x, y) => {
                    if (x.dateTime > y.dateTime) {
                        return -1;
                    }
                });

                // storing the data to the var
                setBetHistory(sortedHistoryData);
            });
    }, []);

    // helper function to convert timestamp into human readable string
    const dateFormatter = (date) => {
        const dateToFormat = new Date(date);

        return dateToFormat.toISOString().replace('T', ' ').replace('Z', '').substring(0, 19);
    }

    // the component that renders the transaction rows of each bet played
    const HistoryDataTable = ({betHistory}) => {
        let data = [];

        // looping over the bet data and setting html to be injected in component
        betHistory.forEach((row, index) => {
            data.push(
                <tr className={"table-row"} key={index}>
                    <td>
                        <img className={"generated-dice"} alt={'dice'} src={require(`../assets/dice${row.sideGenerated}.svg`)}/>
                    </td>
                    <td>
                        <div className="row-wrapped">
                            {row.result}
                            <p>{dateFormatter(row.dateTime)}</p>
                        </div>
                    </td>
                    <td>
                        <img className={'dice-selected'} alt={'dice'} src={require(`../assets/dice${row.sideSelected}.svg`)}/>
                    </td>
                    <td className={row.result === "WON" ? "outcome win" : "outcome"}>{row.result === 'LOST' ? `-${row.stake}` : `+${row.amountWon - row.stake}`}</td>
                    <td className={"balance"}>{row.balance}</td>
                </tr>
            )
        })

        // return the component data
        return data;
    }

    return (
        <main className={"history-container"}>
            <Header balance={balance} />
            <section className={"history-section"}>
                <h1 className={"balance"}>{balance}</h1>
                <Button
                    text={"TOP UP THE ACCOUNT"}
                    disabled={false}
                />
            </section>
            <section className={"history-details"}>
                <h1 className={"history-title"}>History</h1>
                <table className={"table"}>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <HistoryDataTable betHistory={betHistory} />
                    </tbody>
                </table>
            </section>
        </main>
    )
}

export default History;