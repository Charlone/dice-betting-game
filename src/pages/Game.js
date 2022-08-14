import React, { useState } from "react";
import Button from "../components/common/Button";
import Header from "../components/common/Header";
import axios from "axios";
import logo from "../assets/dice-logo.svg";
import minus from "../assets/minus.svg";
import plus from "../assets/plus.svg";

const Game = ({username, balance}) => {
    const [dice, setDice] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [selected, setSelected] = useState("");
    const [betAmount, setBetAmount] = useState(1);

    const RenderDice = () => {
        let diceFaces = [];

        for (let i = 1; i <= 6; i++) {
            let diceObject = {
                key: i,
                image: `dice${i}.svg`
            }

            diceFaces.push(diceObject);
        }

        const diceArray = diceFaces.map(diceFace => (
            <img
                key={diceFace.key}
                className={selected === "" ? "dice-start-color" : (selected === diceFace.key) ? "selected" : "not-selected"}
                src={require(`../assets/${diceFace.image}`)}
                alt={`Dice Face ${diceFace.key}`}
                onClick={handleDiceSetting.bind(this, diceFace.key)}
            />
        ));

        return diceArray;
    }

    function handleDiceSetting(diceChosen) {
        if (selected !== diceChosen) {
            setSelected(diceChosen);
            console.log("selected", diceChosen);
        }
    }

    function handleIncrementBet() {
        if (balance >= (betAmount + 1)) {
            console.log('Increment bet');
            setBetAmount(betAmount + 1);
        }
    }

    function handleDecrementBet() {
        if (betAmount > 1 && balance >= betAmount) {
            console.log('Decrement bet');
            setBetAmount(betAmount - 1)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { diceFace, bet } = e.target;
        const data = {
            username,
            sideSelected: +diceFace.value,
            betAmount: +bet.value,
        }

        try {
            await axios.post("http://localhost:3000/roll-dice/", data)
                .then(function (response) {
                    console.log(response);
                    setDice(response.data.result === 'LOST' ? response.data.sideGenerated : diceFace.value);
                    setIsWin(response.data.result === "WON");
                })
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <main className={"app-container"}>
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
                                // style={isWin ? {fill: '#46FFBA'} : {fill: '#000'}}
                            />
                            {isWin && <h1 className={"win-amount"}>{(betAmount * 5)}</h1>}
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