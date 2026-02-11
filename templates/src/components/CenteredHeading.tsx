import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function CenteredHeading({
            text
        }: {
            text: string;
        }) {
            return (
                <div
                    data-v-b0ffb60a={""}
                    className={"heading mt-1 heading-6 design-system"}
                    style={{ textAlign: "center" }}
                >
                    {text}
                </div>
            );
        }
    

export default CenteredHeading
