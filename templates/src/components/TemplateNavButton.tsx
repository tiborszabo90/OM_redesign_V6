import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Outline_home from './icons/Outline_home.tsx'
import Paint_roller from './icons/Paint_roller.tsx'
import Archive_box from './icons/Archive_box.tsx'
import Resize_handle_squares from './icons/Resize_handle_squares.tsx'
import TemplateNav from './TemplateNav.tsx'


        type TemplateNavButtonData = {
            label: string;
            Icon: React.ComponentType;
            routes?: string[];
        }
    
// Component

        function TemplateNavButton({
            dataId,
            isActive
        }: {
            dataId: string;
            isActive?: boolean;
        }) {
            const {
                label,
                Icon,
                routes
            }: TemplateNavButtonData = getTemplateNavButtonData(dataId)

            const className =
                "btn btn-link btn-block btn-add-icon design-system" +
                (isActive ? " is-active" : "")

            return (
                <button
                    data-v-54b206f2={""}
                    type={"button"}
                    className={className}
                    {...(routes
                        ? {
                              "data-navigate-routes": JSON.stringify(routes)
                          }
                        : {})}
                >
                    <span
                        data-v-54b206f2={""}
                        className={
                            "d-inline-flex justify-content-center align-items-center btn-add-icon-wrap mr-1"
                        }
                    >
                        <Icon />
                    </span>
                    <span
                        data-v-54b206f2={""}
                        className={
                            "d-inline-flex justify-content-center align-items-center"
                        }
                    >
                        {label}
                    </span>
                </button>
            )
        }
    


        function getTemplateNavButtonData(id: string): TemplateNavButtonData {
            const key = String(id)
            switch (key) {
                case "home":
                    return {
                        label: "Főoldal",
                        Icon: Outline_home,
                        routes: ["/60/templates?step=2"]
                    }
                case "themes":
                    return {
                        label: "Témák",
                        Icon: Paint_roller,
                        routes: ["/60/templates/themes"]
                    }
                case "usecases":
                    return {
                        label: "Taktikák",
                        Icon: Archive_box,
                        routes: ["/60/templates/use-cases"]
                    }
                case "blank":
                    return {
                        label: "Üres létrehozása",
                        Icon: Resize_handle_squares
                    }
                default:
                    return {
                        label: "",
                        Icon: Outline_home
                    }
            }
        }
    

export default TemplateNavButton
