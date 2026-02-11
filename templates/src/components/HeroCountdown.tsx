import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import CenteredText from './CenteredText.tsx'
import CountdownUnit from './CountdownUnit.tsx'


// Component

        function HeroCountdown() {
            return (
                <div id={"col_SdHj-OMS4"} className={"col-12 _xs-12 canv-col"} type={""} data-margin={""}>
                    <div className={"om-view-content-helper"}>
                        <div className={"om-element"} type={"OmImage"} data-margin={"ele_ma_wEiDrkx8c"}>
                            <div className={"om-image"} id={"ele_wEiDrkx8c_align"}>
                                <picture>
                                    <Img id="88" />
                                </picture>
                            </div>
                        </div>

                        <OmTextBlock
                            elementMargin="ele_ma_xOhJxedLr"
                            wrapperId="ele_xOhJxedLr_wrapper"
                            textId="ele_xOhJxedLr"
                        >
                            <CenteredText dataId="26" />
                            <CenteredText dataId="27" />
                        </OmTextBlock>

                        <OmTextBlock
                            elementMargin="ele_ma_aY8sNiCUc"
                            wrapperId="ele_aY8sNiCUc_wrapper"
                            textId="ele_aY8sNiCUc"
                        >
                            <CenteredText dataId="28" />
                        </OmTextBlock>

                        <div className={"om-element"} type={"OmCountdown"} data-margin={"ele_ma_Z6auQXq8g"}>
                            <div className={"om-countdown-container"}>
                                <div className={"om-countdown flex-row-baseline"} id={"ele_Z6auQXq8g"}>
                                    <CountdownUnit
                                        unitClass="countdown-days"
                                        display="none"
                                        firstDigit="0"
                                        secondDigit="0"
                                        showSeparator={true}
                                        centerFirstDigit={true}
                                    />
                                    <CountdownUnit
                                        unitClass="countdown-hours"
                                        display="none"
                                        firstDigit="0"
                                        secondDigit="0"
                                        showSeparator={true}
                                    />
                                    <CountdownUnit
                                        unitClass="countdown-minutes"
                                        display=""
                                        firstDigit="1"
                                        secondDigit="5"
                                        showSeparator={true}
                                    />
                                    <CountdownUnit
                                        unitClass="countdown-seconds"
                                        firstDigit="0"
                                        secondDigit="0"
                                        showSeparator={false}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"om-element"} type={"OmSpacer"} data-margin={"ele_ma_ycV0raSPp"}>
                            <div className={"om-spacer"} id={"ele_ycV0raSPp"}>
                            </div>
                        </div>

                        <OmButtonBlock
                            elementMargin="ele_ma_r_bQwh5nz"
                            wrapperId="ele_r_bQwh5nz_wrapper"
                            buttonId="ele_r_bQwh5nz"
                        >
                            <CenteredText dataId="29" />
                        </OmButtonBlock>

                        <OmButtonBlock
                            elementMargin="ele_ma_LVLXJnlQq"
                            wrapperId="ele_LVLXJnlQq_wrapper"
                            buttonId="ele_LVLXJnlQq"
                        >
                            <CenteredText dataId="12" />
                        </OmButtonBlock>
                    </div>
                </div>
            )
        }
    

// Subcomponents

        function OmTextBlock({
            elementMargin,
            wrapperId,
            textId,
            children,
        }: {
            elementMargin: string;
            wrapperId: string;
            textId: string;
            children: React.ReactNode;
        }) {
            return (
                <div className={"om-element"} type={"OmText"} data-margin={elementMargin}>
                    <div id={wrapperId} className={"om-full"}>
                        <div id={textId} className={"om-text"}>
                            {children}
                        </div>
                    </div>
                </div>
            )
        }

        function OmButtonBlock({
            elementMargin,
            wrapperId,
            buttonId,
            children,
        }: {
            elementMargin: string;
            wrapperId: string;
            buttonId: string;
            children: React.ReactNode;
        }) {
            return (
                <div className={"om-element"} type={"OmButton"} data-margin={elementMargin}>
                    <div id={wrapperId} className={"om-full"}>
                        <div id={buttonId} className={"om-button"}>
                            {children}
                        </div>
                    </div>
                </div>
            )
        }
    

export default HeroCountdown
