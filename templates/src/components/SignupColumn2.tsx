import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import CenteredText from './CenteredText.tsx'
import OmInput from './OmInput.tsx'
import SignupColumn from './SignupColumn.tsx'


// Component

        function SignupColumn2() {
            return (
                <div id={"col_SdHj-OMS4"} className={"col-0 _xs-12 canv-col"} type={""} data-margin={""}>
                    <div className={"om-view-content-helper"}>
                        <div className={"om-element"} type={"OmImage"} data-margin={"ele_ma_fDEDShMOO"}>
                            <div className={"om-image"} id={"ele_fDEDShMOO_align"}>
                                <picture>
                                    <Img id="82" />
                                </picture>
                            </div>
                        </div>

                        <OmTextBlock
                            margin={"ele_ma_xOhJxedLr"}
                            wrapperId={"ele_xOhJxedLr_wrapper"}
                            textId={"ele_xOhJxedLr"}
                            dataId={"6"}
                        />

                        <OmTextBlock
                            margin={"ele_ma_qfvEMzZTg"}
                            wrapperId={"ele_qfvEMzZTg_wrapper"}
                            textId={"ele_qfvEMzZTg"}
                            dataId={"7"}
                        />

                        <OmTextBlock
                            margin={"ele_ma_aY8sNiCUc"}
                            wrapperId={"ele_aY8sNiCUc_wrapper"}
                            textId={"ele_aY8sNiCUc"}
                            dataId={"8"}
                        />

                        <div className={"om-element"} type={"OmInput"} data-margin={"ele_ma_6hSV2ghpC"}>
                            <div id={"ele_6hSV2ghpC_wrapper"}>
                                <div className={"om-inputs-wrapper"}>
                                    <OmInput
                                        id={"ele_6hSV2ghpC"}
                                        name={"visitor[email]"}
                                        placeholder={"Email"}
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
    

// Subcomponents

        function OmTextBlock({
            margin,
            wrapperId,
            textId,
            dataId
        }: {
            margin: string
            wrapperId: string
            textId: string
            dataId: string
        }) {
            return (
                <div className={"om-element"} type={"OmText"} data-margin={margin}>
                    <div id={wrapperId} className={"om-full"}>
                        <div id={textId} className={"om-text"}>
                            <CenteredText dataId={dataId} />
                        </div>
                    </div>
                </div>
            )
        }
    

export default SignupColumn2
