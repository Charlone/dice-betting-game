import React from 'react';
import { useLocation } from "react-router-dom";

// commonly used button component
const Button = ({text, disabled}) => {
    // var for checking if to display different style for history page
    const location = useLocation();
    // setting the class for game page
    let buttonClass = 'button-container';

    // extra setting should the button be in history page
    if (location.pathname === '/history') {
        buttonClass += ' extended'
    }

    return (
        <div className={buttonClass}>
            <button
                name={"submit-button"}
                type={"submit"}
                className={"button"}
                disabled={disabled}
            >{text}</button>
        </div>
    )
}

export default Button;