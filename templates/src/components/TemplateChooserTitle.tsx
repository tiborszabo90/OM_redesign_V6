import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function TemplateChooserTitle({
            title
        }: {
            title: string;
        }) {
            return (
                <div className={"template-chooser-title"}>
                    <span>
                        {title}
                    </span>
                </div>
            )
        }
    

export default TemplateChooserTitle
