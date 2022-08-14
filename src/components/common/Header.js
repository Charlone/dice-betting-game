import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import leftArrow from  "../../assets/left-arrow.svg";

const Header = ({balance}) => {
    // the location var to use for displaying the back arrow
    const location = useLocation();

    return (
        <header className={"app-header"}>
            <div className={"header-container"}>
                {
                    location.pathname === '/history' ?
                    (<div className={"arrow-left"}>
                        <Link to={"/"}>
                            <img src={leftArrow} alt={"back"}/>
                        </Link>
                    </div> )
                    :
                    (
                        <>
                            <div className={"history-tab"}>
                                <Link to={"/history"} className={"history"}>
                                    HISTORY
                                </Link>
                            </div>

                            <div className={"balance-container"}>
                                <span className={"balance"}>
                                    {balance}
                                    <FontAwesomeIcon className={"icon"} icon={faCaretDown} />
                                </span>
                            </div>
                        </>
                    )
                }
            </div>
        </header>
    );
}

export default Header;