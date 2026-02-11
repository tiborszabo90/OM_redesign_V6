import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import ProfilePopper from './ProfilePopper.tsx'


    
// Component

        function ProfilePopperItem({
            label,
            idAttr
        }: {
            label: string;
            idAttr?: string;
        }) {
            return (
                <a
                    className={"brand-side-nav-profile-popper-item"}
                    id={idAttr}
                >
                    {label}
                </a>
            );
        }
    

export default ProfilePopperItem
