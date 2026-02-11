import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import BrandSideNav from './BrandSideNav.tsx'


// Component
function BrandSideNavBottomItem() {
    return <div>
        <div className={"brand-side-nav-bottom-item cursor-pointer"}>
            <Img id="7" />
        </div>
    </div>}


export default BrandSideNavBottomItem
