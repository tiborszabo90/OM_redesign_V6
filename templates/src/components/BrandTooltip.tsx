import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Chemical_flask from './icons/Chemical_flask.tsx'


// Component

        function BrandTooltip() {
            return (
                <div className={"popper brand-tooltip-light brand-tooltip-right ml-n1"}>
                    <div className={"more-menu-content"}>
                        <div className={"brand-link-element brand-link-element-secondary brand-link-element-icon-left design-system"}>
                            <div className={"brand-link-element-icon"}>
                                <Chemical_flask />
                            </div>
                            <span className={"title"}>
                                A/B teszt center
                            </span>
                        </div>
                    </div>
                </div>
            )
        }
    

export default BrandTooltip
