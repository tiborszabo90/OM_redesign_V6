import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function DigitColumn({
            firstDigit,
            secondDigit
        }: {
            firstDigit: string;
            secondDigit: string;
        }) {
            return (
                <div className={"om-flex-column"}>
                    <div className={"flex-row-baseline"}>
                        <div className={"om-number formated-countdown-number d-flex"}>
                            <span>
                                {firstDigit}
                            </span>
                        </div>
                        <div className={"om-number formated-countdown-number d-flex"}>
                            <span>
                                {secondDigit}
                            </span>
                        </div>
                    </div>
                </div>
            )
        }
    

export default DigitColumn
