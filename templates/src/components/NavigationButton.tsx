import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function NavigationButton({
            label,
            isActive
        }: {
            label: string;
            isActive?: boolean;
        }) {
            return (
                <button
                    data-v-54b206f2={""}
                    type={"button"}
                    className={
                        "btn btn-link btn-block design-system navigation-v2-btn--max-width" +
                        (isActive ? " is-active" : "")
                    }
                >
                    <span
                        data-v-54b206f2={""}
                        className={"d-inline-flex justify-content-center align-items-center"}
                    >
                        {label}
                    </span>
                </button>
            )
        }
    

export default NavigationButton
