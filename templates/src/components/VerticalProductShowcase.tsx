import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import CenteredText from './CenteredText.tsx'

null
// Component

        function VerticalProductShowcase() {
            return (
                <div
                    id={"col_SdHj-OMS4"}
                    className={"col-12 _xs-12 canv-col"}
                    type={""}
                    data-margin={""}
                >
                    <div className={"om-view-content-helper"}>
                        <div
                            className={"om-element"}
                            type={"OmImage"}
                            data-margin={"ele_ma_OJfNVTYoS"}
                        >
                            <div
                                className={"om-image"}
                                id={"ele_OJfNVTYoS_align"}
                            >
                                <picture>
                                    <Img id="89" />
                                </picture>
                            </div>
                        </div>

                        <div
                            className={"om-element"}
                            type={"OmText"}
                            data-margin={"ele_ma_qlIzdueZP"}
                        >
                            <div
                                id={"ele_qlIzdueZP_wrapper"}
                                className={"om-full"}
                            >
                                <div
                                    id={"ele_qlIzdueZP"}
                                    className={"om-text"}
                                >
                                    <CenteredText dataId="30" />
                                </div>
                            </div>
                        </div>

                        <div
                            className={"om-element"}
                            type={"OmText"}
                            data-margin={"ele_ma_xOhJxedLr"}
                        >
                            <div
                                id={"ele_xOhJxedLr_wrapper"}
                                className={"om-full"}
                            >
                                <div
                                    id={"ele_xOhJxedLr"}
                                    className={"om-text"}
                                >
                                    <CenteredText dataId="31" />
                                </div>
                            </div>
                        </div>

                        <div
                            className={"om-element"}
                            type={"OmProduct"}
                            data-margin={"ele_ma_Az3fX8Wb5"}
                        >
                            <div
                                className={"om-swiper-button-prev"}
                                style={{ display: "none" }}
                            ></div>
                            <div
                                className={"om-swiper-button-next"}
                                style={{ display: "none" }}
                            ></div>

                            <div
                                className={
                                    "om-product om-swiper-container om-product-vertical om-product-multiple-cards"
                                }
                                id={"ele_Az3fX8Wb5"}
                            >
                                <div className={"om-swiper-wrapper"}>
                                    <VerticalProductCard
                                        imgId="90"
                                        name="AirPods Rózsaszín"
                                    />
                                    <VerticalProductCard
                                        imgId="91"
                                        name="AirPods Lila"
                                    />
                                    <VerticalProductCard
                                        imgId="92"
                                        name="AirPods Sárga"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

// Subcomponents

        function VerticalProductCard({
            imgId,
            name,
        }: {
            imgId: string
            name: string
        }) {
            return (
                <div
                    className={
                        "om-product-holder manual om-swiper-slide align-vertical om-product-click-area"
                    }
                >
                    <div className={"om-product-image"}>
                        <Img id={imgId} />
                    </div>
                    <div className={"om-product-details"}>
                        <div
                            className={"om-product-name om-product-style"}
                        >
                            <span>{name}</span>
                        </div>
                        <div className={"om-product-price-wrap"}>
                            <div
                                className={
                                    "om-product-old-price om-product-style"
                                }
                            >
                                <span>$149.00</span>
                            </div>
                            <div
                                className={"om-product-price om-product-style"}
                            >
                                <span>$129.00</span>
                            </div>
                        </div>
                    </div>
                    <div
                        className={
                            "om-product-vertical-action om-product-cta-box om-full"
                        }
                    ></div>
                </div>
            )
        }
    

export default VerticalProductShowcase
