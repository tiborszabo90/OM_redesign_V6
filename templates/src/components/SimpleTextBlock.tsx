import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function SimpleTextBlock({
            text
        }: {
            text: string;
        }) {
            return (
                <div>
                    {text}
                </div>
            );
        }
    

export default SimpleTextBlock
