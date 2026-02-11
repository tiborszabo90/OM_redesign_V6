import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function FeedbackRadioInput({
            name,
            value,
            id
        }: {
            name: string;
            value: string;
            id: string;
        }) {
            return (
                <input
                    className={"om-feedback-button"}
                    type={"radio"}
                    name={name}
                    value={value}
                    id={id}
                >
                </input>
            )
        }
    

export default FeedbackRadioInput
