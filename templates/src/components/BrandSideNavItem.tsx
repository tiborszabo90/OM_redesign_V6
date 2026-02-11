import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import BrandSideNav from './BrandSideNav.tsx'


// Component
function BrandSideNavItem() {
    return <div className={"brand-side-nav-item cursor-pointer d-flex flex-column"}>
        <Img id="5" />
        <span className={"item-title"}>
            Több
        </span>
    </div>}


export default BrandSideNavItem
