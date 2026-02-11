import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import CenteredText from './CenteredText.tsx'


// Component

        function ColumnContent() {
            return (
                <div
                    id={"col_SdHj-OMS4"}
                    className={"col-6 _xs-12 canv-col"}
                    type={""}
                    data-margin={""}
                >
                    <div className={"om-view-content-helper"}>
                        <div
                            className={"om-element"}
                            type={"OmImage"}
                            data-margin={"ele_ma_fDEDShMOO"}
                        >
                            <div className={"om-image"} id={"ele_fDEDShMOO_align"}>
                                <picture>
                                    <Img id="84" />
                                </picture>
                            </div>
                        </div>

                        <OmTextLikeElement
                            elementType="OmText"
                            margin="ele_ma_xOhJxedLr"
                            wrapperId="ele_xOhJxedLr_wrapper"
                            innerId="ele_xOhJxedLr"
                            innerClass="om-text"
                            dataId="9"
                        />

                        <OmTextLikeElement
                            elementType="OmText"
                            margin="ele_ma_aY8sNiCUc"
                            wrapperId="ele_aY8sNiCUc_wrapper"
                            innerId="ele_aY8sNiCUc"
                            innerClass="om-text"
                            dataId="10"
                        />

                        <OmTextLikeElement
                            elementType="OmButton"
                            margin="ele_ma_r_bQwh5nz"
                            wrapperId="ele_r_bQwh5nz_wrapper"
                            innerId="ele_r_bQwh5nz"
                            innerClass="om-button"
                            dataId="11"
                        />

                        <OmTextLikeElement
                            elementType="OmButton"
                            margin="ele_ma_yznsZkKn6"
                            wrapperId="ele_yznsZkKn6_wrapper"
                            innerId="ele_yznsZkKn6"
                            innerClass="om-button"
                            dataId="12"
                        />
                    </div>
                </div>
            );
        }
    

// Subcomponents

        function OmTextLikeElement({
            elementType,
            margin,
            wrapperId,
            innerId,
            innerClass,
            dataId,
        }: {
            elementType: string;
            margin: string;
            wrapperId: string;
            innerId: string;
            innerClass: string;
            dataId: string;
        }) {
            return (
                <div
                    className={"om-element"}
                    type={elementType}
                    data-margin={margin}
                >
                    <div id={wrapperId} className={"om-full"}>
                        <div id={innerId} className={innerClass}>
                            <CenteredText dataId={dataId} />
                        </div>
                    </div>
                </div>
            );
        }
    

export default ColumnContent
