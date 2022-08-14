import React from 'react';
import { useLocation } from "react-router-dom";

const Button = ({text, handler, disabled}) => {
    const location = useLocation();
    let buttonClass = 'button-container';

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