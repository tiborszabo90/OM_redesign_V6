import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import CenteredText from './CenteredText.tsx'
import OmInput from './OmInput.tsx'


// Component
function SignupColumn() {
    return <div id={"col_SdHj-OMS4"} className={"col-6 _xs-12 canv-col"} type={""} data-margin={""}>
        <div className={"om-view-content-helper"}>
            <div className={"om-element"} type={"OmImage"} data-margin={"ele_ma_0felbKWLJ"}>
                <div className={"om-image"} id={"ele_0felbKWLJ_align"}>
                    <picture>
                        <Img id="87" />
                    </picture>
                </div>
            </div>
            <div className={"om-element"} type={"OmText"} data-margin={"ele_ma_xOhJxedLr"}>
                <div id={"ele_xOhJxedLr_wrapper"} className={"om-full"}>
                    <div id={"ele_xOhJxedLr"} className={"om-text"}>
                        
                                <CenteredText dataId="22" />
                            
                        
                                <CenteredText dataId="23" />
                            
                    </div>
                </div>
            </div>
            <div className={"om-element xs-hidden"} type={"OmDivider"} data-margin={"ele_ma_VlrjV4Xr9"}>
                <div className={"flex"}>
                    <div className={"om-divider om-full"} id={"ele_VlrjV4Xr9"}>
                    </div>
                </div>
            </div>
            <div className={"om-element"} type={"OmText"} data-margin={"ele_ma_aY8sNiCUc"}>
                <div id={"ele_aY8sNiCUc_wrapper"} className={"om-full"}>
                    <div id={"ele_aY8sNiCUc"} className={"om-text"}>
                        
                                <CenteredText dataId="24" />
                            
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
                        
                                <CenteredText dataId="25" />
                            
                    </div>
                </div>
            </div>
        </div>
    </div>}


export default SignupColumn
