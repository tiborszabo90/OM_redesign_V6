import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function CountdownUnit({
            unitClass,
            display,
            firstDigit,
            secondDigit,
            showSeparator,
            centerFirstDigit
        }: {
            unitClass: string;
            display?: string;
            firstDigit: string;
            secondDigit: string;
            showSeparator?: boolean;
            centerFirstDigit?: boolean;
        }) {
            return (
                <div className={`${unitClass} flex-row-baseline`} style={display !== undefined ? { display } : undefined}>
                    <div className={"om-flex-column"}>
                        <div className={"flex-row-baseline"}>
                            <Digit
                                value={firstDigit}
                                className={
                                    centerFirstDigit
                                        ? "om-number formated-countdown-number justify-content-center"
                                        : "om-number formated-countdown-number d-flex"
                                }
                            />
                            <Digit
                                value={secondDigit}
                                className={"om-number formated-countdown-number d-flex"}
                            />
                        </div>
                    </div>
                    {showSeparator ? (
                        <div className={"om-flex-column"}>
                            <Separator />
                        </div>
                    ) : null}
                </div>
            )
        }
    

// Subcomponents

        function Digit({ value, className }: { value: string; className: string }) {
            return (
                <div className={className}>
                    <span>
                        {value}
                    </span>
                </div>
            )
        }

        function Separator() {
            return (
                <div className={"om-separator formated-countdown-splitter"}>
                    :
                </div>
            )
        }
    

export default CountdownUnit
