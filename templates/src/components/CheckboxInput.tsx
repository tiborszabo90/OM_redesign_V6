import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function CheckboxInput({
            name,
            withMarginTop
        }: {
            name: string;
            withMarginTop?: boolean;
        }) {
            return (
                <input
                    id={name}
                    type={"checkbox"}
                    value={name}
                    style={withMarginTop ? { marginTop: "0.125rem" } : undefined}
                >
                </input>
            )
        }
    

export default CheckboxInput
