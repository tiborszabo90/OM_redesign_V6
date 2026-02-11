import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import BrandSideNavItem from './BrandSideNavItem.tsx'
import BrandSideNav from './BrandSideNav.tsx'


    
// Component

        function BrandSideNavItem1({
            className,
            imgId,
            title,
            navigateRoutes
        }: {
            className: string;
            imgId: number;
            title: string;
            navigateRoutes?: string;
        }) {
            return (
                <a
                    className={className}
                    {...(navigateRoutes ? { "data-navigate-routes": navigateRoutes } : {})}
                >
                    <Img id={imgId} />
                    <span className={"item-title"}>
                        {title}
                    </span>
                </a>
            );
        }
    

export default BrandSideNavItem1
