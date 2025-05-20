import React from 'react'

function ValidationDot({ valid, error }) {
    return (
        <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle
                cx="4"
                cy="4"
                r="4"
                fill={valid ? "#282A35" : (error ? "#D9212C" : "#165093")}
                fillOpacity={valid ? "0.2" : "1.0"} />
        </svg>
    )
}
export default ValidationDot