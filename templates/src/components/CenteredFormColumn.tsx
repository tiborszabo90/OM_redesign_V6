import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import CenteredText from './CenteredText.tsx'
import OmInput from './OmInput.tsx'


// Component

        function CenteredFormColumn() {
            return (
                <div id={"col_SdHj-OMS4"} className={"col-0 _xs-12 canv-col"} type={""} data-margin={""}>
                    <div className={"om-view-content-helper"}>
                        <div className={"om-element"} type={"OmText"} data-margin={"ele_ma_aY8sNiCUc"}>
                            <div id={"ele_aY8sNiCUc_wrapper"} className={"om-full"}>
                                <div id={"ele_aY8sNiCUc"} className={"om-text"}>
                                    <CenteredText dataId="3" />
                                </div>
                            </div>
                        </div>
                        <div className={"om-element"} type={"OmText"} data-margin={"ele_ma_xOhJxedLr"}>
                            <div id={"ele_xOhJxedLr_wrapper"} className={"om-full"}>
                                <div id={"ele_xOhJxedLr"} className={"om-text"}>
                                    <CenteredText dataId="4" />
                                </div>
                            </div>
                        </div>
                        <div className={"om-element xs-hidden"} type={"OmDivider"} data-margin={"ele_ma_VlrjV4Xr9"}>
                            <div className={"flex"}>
                                <div className={"om-divider om-full"} id={"ele_VlrjV4Xr9"}>
                                </div>
                            </div>
                        </div>
                        <div className={"om-element"} type={"OmInput"} data-margin={"ele_ma_rzPsMAZve"}>
                            <div id={"ele_rzPsMAZve_wrapper"}>
                                <div className={"om-inputs-wrapper"}>
                                    <OmInput
                                        id={"ele_rzPsMAZve"}
                                        name={"visitor[email]"}
                                        placeholder={"Email cím"}
                                        type={"email"}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"om-element"} type={"OmButton"} data-margin={"ele_ma_r_bQwh5nz"}>
                            <div id={"ele_r_bQwh5nz_wrapper"} className={"om-full"}>
                                <div id={"ele_r_bQwh5nz"} className={"om-button"}>
                                    <CenteredText dataId="5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

export default CenteredFormColumn
