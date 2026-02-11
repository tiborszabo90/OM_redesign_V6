import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import TemplateNavButton from './TemplateNavButton.tsx'
import Submenu from './Submenu.tsx'


    
// Component

        function TemplateNav({
            submenuActiveLabel
        }: {
            submenuActiveLabel?: string | null;
        }) {
            const location = useLocation()
            const current = location.pathname + location.search + location.hash

            return (
                <ul className={"unstyled-list"}>
                    <li>
                        {(() => {
                            switch (current) {
                                case "/60/templates":
                                case "/60/templates?step=2":
                                    return <TemplateNavButton dataId="home" isActive={true} />
                                case "/60/templates/themes":
                                case "/60/templates/use-cases":
                                case "/60/templates/themes/Essential-65d4e58e54c6bc5ba00a94e5":
                                    return <TemplateNavButton dataId="home" />
                                default:
                                    return null
                            }
                        })()}
                    </li>
                    <li>
                        <span>
                            <TemplateNavButton dataId="themes" />
                            {submenuActiveLabel !== undefined ? (
                                submenuActiveLabel === null ? (
                                    <Submenu />
                                ) : (
                                    <Submenu activeLabel={submenuActiveLabel} />
                                )
                            ) : null}
                        </span>
                    </li>
                    <li>
                        <span>
                            {(() => {
                                switch (current) {
                                    case "/60/templates":
                                    case "/60/templates/themes":
                                    case "/60/templates?step=2":
                                    case "/60/templates/themes/Essential-65d4e58e54c6bc5ba00a94e5":
                                        return <TemplateNavButton dataId="usecases" />
                                    case "/60/templates/use-cases":
                                        return <TemplateNavButton dataId="usecases" isActive={true} />
                                    default:
                                        return null
                                }
                            })()}
                        </span>
                    </li>
                    <li>
                        <div className={"from-scratch-button"}>
                            <TemplateNavButton dataId="blank" />
                        </div>
                    </li>
                </ul>
            )
        }
    

export default TemplateNav
