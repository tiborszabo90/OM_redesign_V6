import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Play_button_circle from './icons/Play_button_circle.tsx'
import Rounded_book_cover from './icons/Rounded_book_cover.tsx'
import Play_button_circle1 from './icons/Play_button_circle1.tsx'


        type MediaActionButtonData = {
            label: string;
            icon: JSX.Element;
            buttonExtraClass?: string;
        }
    
// Component

        function MediaActionButton({
            dataId
        }: {
            dataId: string;
        }) {
            const {
                label,
                icon,
                buttonExtraClass
            }: MediaActionButtonData = getMediaActionButtonData(dataId);

            return (
                <button
                    data-v-54b206f2={""}
                    type={"button"}
                    className={`${buttonExtraClass ? buttonExtraClass + " " : ""}btn btn-sm btn-add-icon design-system`}
                >
                    <span
                        data-v-54b206f2={""}
                        className={"d-inline-flex justify-content-center align-items-center btn-add-icon-wrap mr-1"}
                    >
                        {icon}
                    </span>
                    <span
                        data-v-54b206f2={""}
                        className={"d-inline-flex justify-content-center align-items-center"}
                    >
                        {label}
                    </span>
                </button>
            );
        }
    


        function getMediaActionButtonData(id: string): MediaActionButtonData {
            const key = String(id);
            switch (key) {
                case "0":
                    return {
                        label: "Cikk olvasása",
                        icon: <Rounded_book_cover />,
                        buttonExtraClass: "mr-2"
                    };
                case "1":
                    return {
                        label: "Videó megtekintése",
                        icon: <Play_button_circle1 />
                    };
                default:
                    return {
                        label: "",
                        icon: <span />
                    };
            }
        }
    

export default MediaActionButton
