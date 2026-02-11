import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import DigitColumn from './DigitColumn.tsx'
import CountdownSeparatorColumn from './CountdownSeparatorColumn.tsx'


// Component

        function CountdownColumn() {
            return (
                <div id={"col_L5oSoQDIq"} className={"col-0 _xs-12 canv-col om-justify-center"} type={""} data-margin={""}>
                    <div className={"om-element"} type={"OmCountdown"} data-margin={"ele_ma_PQcyDX0bw"}>
                        <div className={"om-countdown-container"}>
                            <div className={"om-countdown flex-row-baseline"} id={"ele_PQcyDX0bw"}>
                                <div className={"countdown-days flex-row-baseline"} style={{ display: "none" }}>
                                    <DigitColumn firstDigit="0" secondDigit="0" />
                                    <CountdownSeparatorColumn />
                                </div>
                                <div className={"countdown-hours flex-row-baseline"} style={{ display: "" }}>
                                    <DigitColumn firstDigit="2" secondDigit="3" />
                                    <CountdownSeparatorColumn />
                                </div>
                                <div className={"countdown-minutes flex-row-baseline"} style={{ display: "" }}>
                                    <DigitColumn firstDigit="1" secondDigit="5" />
                                    <CountdownSeparatorColumn />
                                </div>
                                <div className={"countdown-seconds flex-row-baseline"}>
                                    <DigitColumn firstDigit="1" secondDigit="5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

export default CountdownColumn
