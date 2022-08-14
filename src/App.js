import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";
import Game from "./pages/Game";
import History from "./pages/History";
import "./styles/App.scss";

const App = () => {
    const [user, setUser] = useState('robouser');
    const [balance, setBalance] = useState(0);
    const [betHistory, setBetHistory] = useState(null);

    useEffect(() => {
        let isMounted = true;
        axios.get(`http://localhost:3000/get-user/${user}`)
            .then(response => {
                if (isMounted) {
                    setBalance(response.data.balance);
                    setBetHistory(response.data.betHistory);
                    setUser(response.data.username);

                    if (!localStorage.getItem('start-balance')) {
                        localStorage.setItem('start-balance', response.data.balance);
                    }
                }
            });

        return () => {isMounted = false}
    }, [balance, betHistory]);

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={"/"}>
                    <Game balance={balance} username={user} />
                </Route>
                <Route path={"/history"}>
                    <History balance={balance}  username={user} betHistory={betHistory} />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App;
