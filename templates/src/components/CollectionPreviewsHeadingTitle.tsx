import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function CollectionPreviewsHeadingTitle({
            title
        }: {
            title: string;
        }) {
            return (
                <div className={"collection-previews-heading collection-previews-heading--title"}>
                    <div data-v-b0ffb60a={""} className={"heading heading-3 design-system"}>
                        {title}
                    </div>
                </div>
            );
        }
    

export default CollectionPreviewsHeadingTitle
