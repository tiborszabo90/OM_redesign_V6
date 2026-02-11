import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import CenteredText from './CenteredText.tsx'
import OmInput from './OmInput.tsx'


// Component

        function OptinColumn() {
            return (
                <div id={"col_djZxUbRPw"} className={"col-0 _xs-12 canv-col"} type={""} data-margin={""}>
                    <div className={"om-view-content-helper"}>
                        <div className={"om-element"} type={"OmImage"} data-margin={"ele_ma_2fdlyw6VP"}>
                            <div className={"om-image"} id={"ele_2fdlyw6VP_align"}>
                                <picture>
                                    <Img id="86" />
                                </picture>
                            </div>
                        </div>

                        <TextElement
                            elementId="ele_xOhJxedLr"
                            margin="ele_ma_xOhJxedLr"
                            dataId="19"
                        />

                        <TextElement
                            elementId="ele_aY8sNiCUc"
                            margin="ele_ma_aY8sNiCUc"
                            dataId="20"
                        />

                        <div className={"om-element"} type={"OmInput"} data-margin={"ele_ma_rzPsMAZve"}>
                            <div id={"ele_rzPsMAZve_wrapper"}>
                                <div className={"om-inputs-wrapper"}>
                                    <OmInput
                                        id={"ele_rzPsMAZve"}
                                        name={"visitor[email]"}
                                        placeholder={"Email"}
                                        type={"email"}
                                    />
                                </div>
                            </div>
                        </div>

                        <ButtonElement
                            elementId="ele_r_bQwh5nz"
                            margin="ele_ma_r_bQwh5nz"
                            dataId="21"
                        />

                        <ButtonElement
                            elementId="ele_KJLK8TEhU"
                            margin="ele_ma_KJLK8TEhU"
                            dataId="12"
                        />
                    </div>
                </div>
            )
        }
    

// Subcomponents

        function TextElement({
            elementId,
            margin,
            dataId
        }: {
            elementId: string
            margin: string
            dataId: string
        }) {
            return (
                <div className={"om-element"} type={"OmText"} data-margin={margin}>
                    <div id={`${elementId}_wrapper`} className={"om-full"}>
                        <div id={elementId} className={"om-text"}>
                            <CenteredText dataId={dataId} />
                        </div>
                    </div>
                </div>
            )
        }

        function ButtonElement({
            elementId,
            margin,
            dataId
        }: {
            elementId: string
            margin: string
            dataId: string
        }) {
            return (
                <div className={"om-element"} type={"OmButton"} data-margin={margin}>
                    <div id={`${elementId}_wrapper`} className={"om-full"}>
                        <div id={elementId} className={"om-button"}>
                            <CenteredText dataId={dataId} />
                        </div>
                    </div>
                </div>
            )
        }
    

export default OptinColumn
