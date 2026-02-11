import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function OmInput({
            id,
            name,
            placeholder,
            type
        }: {
            id: string;
            name: string;
            placeholder: string;
            type?: string;
        }) {
            return (
                <input
                    className={"om-inputs"}
                    id={id}
                    name={name}
                    autoComplete={"on"}
                    placeholder={placeholder}
                    type={type}
                    value={""}
                >
                </input>
            )
        }
    

export default OmInput
