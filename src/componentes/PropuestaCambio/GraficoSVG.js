import React from 'react'


function GraficoSVG () {
    return (
        <svg width="26px" height="24px" viewBox="0 0 26 24">
            <g>
                <line x1="4" y1="4" x2="7" y2="19" style={{stroke:'black', strokeWidth:'1'}} />
                <line x1="7" y1="19" x2="19" y2="4" style={{stroke:'black', strokeWidth:'1'}} />
                <line x1="7" y1="19" x2="21" y2="16" style={{stroke:'black', strokeWidth:'1'}} />
                
                <circle cx="4" cy="4" r="3" fill="white" stroke="black" stroke-width="1px"/>
                <circle cx="7" cy="19" r="4" fill="white" stroke="black" stroke-width="1px"/>
                <circle cx="19" cy="4" r="3" fill="white" stroke="black" stroke-width="1px"/>
                <circle cx="21" cy="16" r="3" fill="white" stroke="black" stroke-width="1px"/>
            </g>
        </svg>
    );
}

export default GraficoSVG;