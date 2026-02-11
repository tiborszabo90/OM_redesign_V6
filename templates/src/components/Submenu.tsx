import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import NavigationButton from './NavigationButton.tsx'


    
// Component

        function Submenu({
            activeLabel
        }: {
            activeLabel?: string;
        }) {
            return (
                <ul className={"unstyled-list submenu"}>
                    <NavItem label="Beépített témák" isActive={activeLabel === "Beépített témák"} />
                    <NavItem label="Szezonális sablonok" isActive={activeLabel === "Szezonális sablonok"} />
                    <NavItem label="Saját témák" isActive={activeLabel === "Saját témák"} />
                </ul>
            )
        }
    

// Subcomponents

        function NavItem({
            label,
            isActive
        }: {
            label: string;
            isActive?: boolean;
        }) {
            return (
                <li>
                    <NavigationButton label={label} isActive={isActive} />
                </li>
            )
        }
    

export default Submenu
