import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";
import Game from "./pages/Game";
import History from "./pages/History";
import 'react-toastify/dist/ReactToastify.css';
import "./styles/App.scss";

const App = () => {
    // set state variable needed
    const [user, setUser] = useState('robouser');
    const [balance, setBalance] = useState(0);
    const [betHistory, setBetHistory] = useState(null);

    // get user data needed by the app
    useEffect(() => {
        let isMounted = true;

        // if app is mounted get the data from server using the mock user and data for this project
        if (isMounted) {
            axios.get(`http://localhost:3000/get-user/${user}`)
                .then(response => {
                    setBalance(response.data.balance);
                    setBetHistory(response.data.betHistory);
                    setUser(response.data.username);

                    if (!localStorage.getItem('start-balance')) {
                        localStorage.setItem('start-balance', response.data.balance);
                    }
                });
        }

        // clean up phase to ensure no updates are done while unmounted
        return () => {isMounted = false}
    }, [balance, betHistory]);

    // app react dom router routes
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
    );
}

export default App;
