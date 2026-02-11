import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import Chevron_down_bold from './icons/Chevron_down_bold.tsx'


// Component
function IntercomLauncher() {
    return <div className={"intercom-lightweight-app-launcher intercom-launcher"} role={"button"} tabIndex={"0"}>
        <div className={"intercom-lightweight-app-launcher-icon intercom-lightweight-app-launcher-icon-open"}>
            <Img id="95" />
        </div>
        <div className={"intercom-lightweight-app-launcher-icon intercom-lightweight-app-launcher-icon-minimize"}>
            <Chevron_down_bold />
        </div>
    </div>}


export default IntercomLauncher
