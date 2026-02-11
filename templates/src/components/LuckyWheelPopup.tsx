import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Wheel_spinner_pointer from './icons/Wheel_spinner_pointer.tsx'
import OptinColumn from './OptinColumn.tsx'


// Component

        function LuckyWheelPopup() {
            return (
                <div className={"om-outer-canvas"} style={{ height: "100%" }}>
                    <div
                        id={"pge_4Q1fvVv-I"}
                        className={"om-canvas om-wheel-canvas"}
                        type={""}
                        data-margin={""}
                        style={{ width: "62em" }}
                    >
                        <div className={"om-global-close-button om-popup-close om-popup-close-v2"}>
                            <span className={"om-popup-close-x"}>
                                X
                            </span>
                        </div>
                        <div className={"om-canvas-content"}>
                            <div className={"grid-noGutter col-12 hover-row om-wheel-row"}>
                                <div
                                    id={"row_oy_UiEn_L"}
                                    className={"canv-row grid-noGutter col-12"}
                                    type={""}
                                    data-margin={""}
                                >
                                    <div
                                        id={"col_SdHj-OMS4"}
                                        className={"col-0 _xs-12 canv-col om-wheel-canv-col"}
                                        type={""}
                                        data-margin={""}
                                    >
                                        <div className={"om-view-content-helper"}>
                                            <div
                                                className={"om-element"}
                                                type={"OmLuckyWheel"}
                                                data-margin={"ele_ma_IFZv0UiYL"}
                                            >
                                                <div id={"omLuckyWheel"} className={"om-lucky-wheel"}>
                                                    <Wheel_spinner_pointer />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <OptinColumn />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

export default LuckyWheelPopup
