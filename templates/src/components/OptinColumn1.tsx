import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import CenteredText from './CenteredText.tsx'
import OmInput from './OmInput.tsx'
import OptinColumn from './OptinColumn.tsx'


// Component

        function OptinColumn1() {
            return (
                <div id={"col_SdHj-OMS4"} className={"col-0 _xs-12 canv-col"} type={""} data-margin={""}>
                    <div className={"om-view-content-helper"}>
                        <div className={"om-element"} type={"OmImage"} data-margin={"ele_ma_0felbKWLJ"}>
                            <div className={"om-image"} id={"ele_0felbKWLJ_align"}>
                                <picture>
                                    <Img id="85" />
                                </picture>
                            </div>
                        </div>

                        <OmTextBlock
                            elementMargin={"ele_ma_xOhJxedLr"}
                            wrapperId={"ele_xOhJxedLr_wrapper"}
                            textId={"ele_xOhJxedLr"}
                            dataId="13"
                        />

                        <OmTextBlock
                            elementMargin={"ele_ma_aY8sNiCUc"}
                            wrapperId={"ele_aY8sNiCUc_wrapper"}
                            textId={"ele_aY8sNiCUc"}
                            dataId="14"
                        />

                        <OmInputBlock
                            elementMargin={"ele_ma_rzPsMAZve"}
                            wrapperId={"ele_rzPsMAZve_wrapper"}
                        >
                            <OmInput
                                id={"ele_rzPsMAZve"}
                                name={"visitor[firstname]"}
                                placeholder={"Keresztnév"}
                            />
                        </OmInputBlock>

                        <OmInputBlock
                            elementMargin={"ele_ma_ydXaFa-Sb"}
                            wrapperId={"ele_ydXaFa-Sb_wrapper"}
                        >
                            <OmInput
                                id={"ele_ydXaFa-Sb"}
                                name={"visitor[email]"}
                                placeholder={"Email"}
                                type={"email"}
                            />
                        </OmInputBlock>

                        <div className={"om-element"} type={"OmButton"} data-margin={"ele_ma_r_bQwh5nz"}>
                            <div id={"ele_r_bQwh5nz_wrapper"} className={"om-full"}>
                                <div id={"ele_r_bQwh5nz"} className={"om-button"}>
                                    <CenteredText dataId="5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    

// Subcomponents

        function OmTextBlock({
            elementMargin,
            wrapperId,
            textId,
            dataId
        }: {
            elementMargin: string;
            wrapperId: string;
            textId: string;
            dataId: string;
        }) {
            return (
                <div className={"om-element"} type={"OmText"} data-margin={elementMargin}>
                    <div id={wrapperId} className={"om-full"}>
                        <div id={textId} className={"om-text"}>
                            <CenteredText dataId={dataId} />
                        </div>
                    </div>
                </div>
            );
        }

        function OmInputBlock({
            elementMargin,
            wrapperId,
            children
        }: {
            elementMargin: string;
            wrapperId: string;
            children: JSX.Element;
        }) {
            return (
                <div className={"om-element"} type={"OmInput"} data-margin={elementMargin}>
                    <div id={wrapperId}>
                        <div className={"om-inputs-wrapper"}>
                            {children}
                        </div>
                    </div>
                </div>
            );
        }
    

export default OptinColumn1
