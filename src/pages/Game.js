import React, { useState } from "react";
import Button from "../components/common/Button";
import Header from "../components/common/Header";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { setToast } from "../components/common/Toast";
import logo from "../assets/dice-logo.svg";
import minus from "../assets/minus.svg";
import plus from "../assets/plus.svg";

const Game = ({username, balance}) => {
    // state vars needed for component
    const [dice, setDice] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [winAmount, setWinAmount] = useState(0);
    const [selected, setSelected] = useState("");
    const [betAmount, setBetAmount] = useState(1);

    // component that renders dice images with events
    const RenderDice = () => {
        let diceFaces = [];

        // dice has 6 faces, loop fetches all the faces values
        for (let i = 1; i <= 6; i++) {
            let diceObject = {
                key: i,
                image: `dice${i}.svg`
            }

            diceFaces.push(diceObject);
        }

        // mapping the values from the loop to array with images to render
        const diceArray = diceFaces.map(diceFace => (
            <img
                key={diceFace.key}
                className={selected === "" ? "dice-start-color" : (selected === diceFace.key) ? "selected" : "not-selected"}
                src={require(`../assets/${diceFace.image}`)}
                alt={`Dice Face ${diceFace.key}`}
                onClick={handleDiceSetting.bind(this, diceFace.key)}
            />
        ));

        // return the images elements to render
        return diceArray;
    }

    // the handler for setting dice chosen by the user on click
    function handleDiceSetting(diceChosen) {
        // if dice is not already chosen set it as selected
        if (selected !== diceChosen) {
            setSelected(diceChosen);
        }
    }

    // the handler for incrementing the amount to bet on arrow click
    function handleIncrementBet() {
        // if there is enough balance add 1 to bet amount
        if (balance >= (betAmount + 1)) {
            setBetAmount(betAmount + 1);
        } else {
            // alert the user
            setToast('error', 'Not enough balance to increment bet');
        }
    }

    // the handler for decrementing the amount to bet on arrow click
    function handleDecrementBet() {
        // bet amount must be greater than 1 as 0 cannot be played and balance must be greater than 0
        if (betAmount > 1 && balance > 0) {
            setBetAmount(betAmount - 1)
        } else {
            // alert the user
            setToast('error', 'Bet amount cannot be less than 1');
        }
    }

    // the handler for the form submit
    async function handleSubmit(e) {
        // prevent form submit
        e.preventDefault();
        // get the data from the form
        const { diceFace, bet } = e.target;
        //set the data object to send
        const data = {
            username,
            sideSelected: +diceFace.value,
            betAmount: +bet.value,
        }

        // post the data and set values from return
        try {
            await axios.post("http://localhost:3000/roll-dice/", data)
                .then(function (response) {
                    // setting the dice to show as the outcome
                    setDice(response.data.result === 'LOST' ? response.data.sideGenerated : diceFace.value);
                    //setting if the player won
                    setIsWin(response.data.result === "WON");
                    // since stake is immediately reduced from balance we are also subtracting it directly
                    setWinAmount(((betAmount * 5) - betAmount));
                })
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <main className={"app-container"}>
            <ToastContainer theme={"colored"} />
            <Header balance={balance} />
            <section className={"game"}>
                <section className={"game-section"}>
                    {dice === false && <img className={"logo"} src={logo} alt={"Dice Toss"} />}
                    {dice !== false && (
                        <>
                            <img
                                id={isWin ? "win" : "loss"}
                                className={"dice"}
                                src={require(`../assets/dice${dice}.svg`)}
                                alt={"Dice Toss"}
                            />
                            {isWin && <h1 className={"win-amount"}>{winAmount}</h1>}
                            <span className={isWin ? "outcome" : "outcome loss"}>{isWin ? "WIN" : "LOSS"}</span>
                        </>
                    )}
                </section>

                <section className={"user-input-section"}>
                    <div className={"game-panel"}>
                        <form className={"game-form"} onSubmit={handleSubmit}>
                            <fieldset>
                                <h6 className={"info-message"}>Tap to change selection</h6>
                                <div className={"dice"}>
                                    <RenderDice />

                                    <input
                                        className={'dice-face'}
                                        type={"number"}
                                        name={"diceFace"}
                                        value={selected}
                                        onChange={() => {setSelected(selected)}}
                                    />
                                </div>

                                <div className="bet-amount-container">
                                    <img
                                        className={"bet-decrement"}
                                        src={minus}
                                        alt={"Minus sign, reduce bet amount"}
                                        onClick={handleDecrementBet.bind(this)}
                                    />

                                    <h1 className={"bet-amount"}>{betAmount}</h1>

                                    <img
                                        className={"bet-increment"}
                                        src={plus}
                                        alt={"Plus sign, increase bet amount"}
                                        onClick={handleIncrementBet.bind(this)}
                                    />

                                    <input
                                        className={"range-input"}
                                        name={"bet"}
                                        type={"range"}
                                        min={"1"}
                                        max={balance}
                                        step={"1"}
                                        value={betAmount}
                                        onChange={() => {}}
                                    />
                                </div>

                                <div className={"form-button-container"}>
                                    <Button
                                        text={"ROLL THE DICE MAN"}
                                        disabled={selected == false || betAmount === 0}
                                    />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </section>
            </section>
        </main>
    )
}

export default Game;