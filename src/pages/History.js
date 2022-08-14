import React, { useEffect, useState } from 'react';
import Button from "../components/common/Button";
import axios from "axios";
import Header from "../components/common/Header";

const History = ({balance, username}) => {
    const [betHistory, setBetHistory] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/get-user/${username}`)
            .then(response => {
                let sortedHistoryData = response.data.betHistory.sort(function(x, y) {
                    if (x.dateTime > y.dateTime) {
                        return -1;
                    }
                });

                setBetHistory(sortedHistoryData);
            });
    }, []);

    const dateFormatter = (date) => {
        const dateToFormat = new Date(date);

        return dateToFormat.toISOString().replace('T', ' ').replace('Z', '').substring(0, 19);
    }

    const HistoryDataTable = ({betHistory, balance}) => {
        let data = [];
        let balanceToDecrease = 0;

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
                    <td className={row.result === "WON" ? "outcome win" : "outcome"}>{row.result === 'LOST' ? `-${row.stake}` : `+${row.amountWon}`}</td>
                    <td className={"balance"}>{balance - balanceToDecrease}</td>
                </tr>
            )

            // reset balanceToDecrease since balance sum already happened and get ready for next round
            balanceToDecrease = 0;

            if (row.result === 'LOST') {
                balanceToDecrease += row.stake
            } else {
                balanceToDecrease -= row.amountWon
            }
        })

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
                        <HistoryDataTable betHistory={betHistory} balance={balance} />
                    </tbody>
                </table>
            </section>
        </main>
    )
}

export default History;