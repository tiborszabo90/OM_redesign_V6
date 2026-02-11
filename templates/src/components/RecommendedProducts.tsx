import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'

null
// Component

        function RecommendedProducts() {
            return (
                <div
                    id={"col_SdHj-OMS4"}
                    className={"col-12 _xs-12 canv-col om-justify-center"}
                    type={""}
                    data-margin={""}
                >
                    <div
                        className={"om-element"}
                        type={"OmText"}
                        data-margin={"ele_ma_xOhJxedLr"}
                    >
                        <div id={"ele_xOhJxedLr_wrapper"} className={"om-full"}>
                            <div id={"ele_xOhJxedLr"} className={"om-text"}>
                                <div
                                    className={"om-dtr-content ql-align-center"}
                                    style={{ lineHeight: "1.2" }}
                                >
                                    <span
                                        className={
                                            "om-text-fontsize-16 om-color-palette-main ql-font-om-font-2"
                                        }
                                        style={{
                                            fontWeight: "700",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Ezek is érdekelhetnek
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={"om-element"}
                        type={"OmProduct"}
                        data-margin={"ele_ma_9QPjeWH8G"}
                    >
                        <div className={"om-swiper-button-prev"}></div>
                        <div className={"om-swiper-button-next"}></div>

                        <div
                            className={
                                "om-product om-swiper-container om-product-horizontal om-product-multiple-cards"
                            }
                            id={"ele_9QPjeWH8G"}
                        >
                            <div className={"om-swiper-wrapper"}>
                                <HorizontalProductCard />
                                <HorizontalProductCard />
                                <HorizontalProductCard />
                                <HorizontalProductCard />
                                <HorizontalProductCard />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

// Subcomponents

        function HorizontalProductCard() {
            return (
                <div className={"om-product-holder manual om-swiper-slide"}>
                    <div className={"om-product-image"}>
                        <Img id="83" />
                    </div>
                    <div className={"om-product-details"}>
                        <div className={"om-product-name om-product-style"}>
                            <span>Termék neve</span>
                        </div>
                        <div className={"om-product-price-wrap"}>
                            <div
                                className={
                                    "om-product-old-price om-product-style"
                                }
                            >
                                <span>$25</span>
                            </div>
                            <div
                                className={"om-product-price om-product-style"}
                            >
                                <span>$19</span>
                            </div>
                        </div>
                        <div className={"om-product-cta-box om-full"}>
                            <div
                                className={
                                    "om-product-cta om-om-product-click-area"
                                }
                            >
                                <div
                                    className={"om-product-cta-text"}
                                >
                                    <span>Kosárba</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

export default RecommendedProducts
