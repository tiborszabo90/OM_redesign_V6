import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


        type ProgressItemData = {
            headerRowClass: string;
            labelText: string;
            valueText: string;
            valueClass: string;
            progressWrapperClass: string;
            progressWrapperStyle?: React.CSSProperties;
            progressWrapperAttrs?: {
                [key: string]: string;
            };
            barClass: string;
            barStyle: React.CSSProperties;
            barAttrs?: {
                [key: string]: string;
            };
        }
    
// Component

        function ProgressItem({
            dataId
        }: {
            dataId: string;
        }) {
            const {
                headerRowClass,
                labelText,
                valueText,
                valueClass,
                progressWrapperClass,
                progressWrapperStyle,
                progressWrapperAttrs,
                barClass,
                barStyle,
                barAttrs
            } = getProgressItemData(dataId);

            return (
                <div className={"brand-side-nav-profile-popper-content-body-right-item-progress"}>
                    <div className={headerRowClass}>
                        <div className={"font-size-0--75 brand-side-nav-profile-popper-gray"}>
                            {labelText}
                        </div>
                        <div className={valueClass}>
                            {valueText}
                        </div>
                    </div>
                    <div
                        {...(progressWrapperAttrs || {})}
                        className={progressWrapperClass}
                        style={progressWrapperStyle}
                    >
                        <div
                            {...(barAttrs || {})}
                            role={"progressbar"}
                            className={barClass}
                            style={barStyle}
                        >
                        </div>
                    </div>
                </div>
            );
        }
    


        function getProgressItemData(id: string): ProgressItemData {
            const key = String(id);

            if (key === "0") {
                return {
                    headerRowClass: "d-flex justify-content-center",
                    labelText: "Egyedi látogatók",
                    valueText: "15 680 / 1 000 000",
                    valueClass: "ml-auto font-size-0--75 brand-side-nav-profile-popper-black text-right",
                    progressWrapperClass: "progress",
                    progressWrapperStyle: { height: "0.375rem" },
                    progressWrapperAttrs: {
                        "data-v-afff6e7a": ""
                    },
                    barClass: "current progress-bar",
                    barStyle: { width: "1.4066%", backgroundColor: "rgb(109,154,231)" },
                    barAttrs: {
                        "data-v-afff6e7a": ""
                    }
                };
            }

            return {
                headerRowClass: "d-flex",
                labelText: "Aktív domainek",
                valueText: "8 / 100",
                valueClass: "ml-auto font-size-0--75 brand-side-nav-profile-popper-black",
                progressWrapperClass: "progress",
                progressWrapperStyle: undefined,
                progressWrapperAttrs: undefined,
                barClass: "progress-bar",
                barStyle: { width: "8%", backgroundColor: "rgb(109,154,231)" },
                barAttrs: undefined
            };
        }
    

export default ProgressItem
