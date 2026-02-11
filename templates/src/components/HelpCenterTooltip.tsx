import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Closed_book from './icons/Closed_book.tsx'
import Play_button_circle from './icons/Play_button_circle.tsx'


// Component

        function HelpCenterTooltip() {
            return (
                <div className={"popper brand-tooltip brand-tooltip-light brand-tooltip-right ml-n1"}>
                    <div className={"help-center-content p-2"}>
                        <div className={"help-center-main"}>
                            <div data-v-b0ffb60a={""} className={"heading mb-4 heading-6 design-system"}>
                                Tudástár
                            </div>
                            <HelpCenterLink
                                icon={<Closed_book />}
                                text={"Megnézem a tudásportált"}
                                extraClassName={"mb-3"}
                            />
                            <HelpCenterLink
                                icon={<Play_button_circle />}
                                text={"Megnézem a bevezető videókat"}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    

// Subcomponents

        function HelpCenterLink({
            icon,
            text,
            extraClassName
        }: {
            icon: JSX.Element;
            text: string;
            extraClassName?: string;
        }) {
            return (
                <div
                    className={
                        "brand-link-element brand-link-element-secondary brand-link-element-icon-left design-system" +
                        (extraClassName ? " " + extraClassName : "")
                    }
                >
                    <div className={"brand-link-element-icon"}>
                        {icon}
                    </div>
                    <span>
                        {text}
                    </span>
                </div>
            );
        }
    

export default HelpCenterTooltip
