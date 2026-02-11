import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


    
// Component

        function SwiperNavButton({
            direction,
            suffix,
            disabled
        }: {
            direction: "next" | "prev";
            suffix: string;
            disabled?: boolean;
        }) {
            const className =
                direction === "next"
                    ? "swiper-button-next"
                    : `swiper-button-prev${disabled ? " swiper-button-disabled" : ""}`;

            return (
                <div
                    tabIndex={"0"}
                    role={"button"}
                    id={`swiper-button-${direction}-${suffix}`}
                    className={className}
                >
                </div>
            );
        }
    

export default SwiperNavButton
