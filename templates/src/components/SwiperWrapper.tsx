import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'


        type SwiperWrapperData = {
            wrapperStyle: {
                height: string;
                transform: string;
            };
            slides: Array<{
                slideClassName: string;
                slideStyle: {
                    width: string;
                    marginRight: string;
                };
                cardClassName: string;
                imgId: string;
                navigateRoutes?: string;
            }>;
        }
    
// Component

        function SwiperWrapper({ dataId }: { dataId: string }) {
            const { wrapperStyle, slides }: SwiperWrapperData = getSwiperWrapperData(dataId)

            return (
                <div
                    className={"swiper-wrapper"}
                    style={{
                        height: wrapperStyle.height,
                        transform: wrapperStyle.transform
                    }}
                >
                    {slides.map((slide, index) => (
                        <Slide
                            key={index}
                            slideClassName={slide.slideClassName}
                            slideStyle={slide.slideStyle}
                            cardClassName={slide.cardClassName}
                            imgId={slide.imgId}
                            navigateRoutes={slide.navigateRoutes}
                        />
                    ))}
                </div>
            )
        }
    

// Subcomponents

        function Slide({
            slideClassName,
            slideStyle,
            cardClassName,
            imgId,
            navigateRoutes
        }: {
            slideClassName: string;
            slideStyle: { width: string; marginRight: string };
            cardClassName: string;
            imgId: string;
            navigateRoutes?: string;
        }) {
            return (
                <div className={slideClassName} style={slideStyle}>
                    <div
                        data-v-021da501={""}
                        className={cardClassName}
                        {...(navigateRoutes
                            ? { "data-navigate-routes": navigateRoutes }
                            : {})}
                    >
                        <Img id={imgId} />
                    </div>
                </div>
            )
        }
    


        function getSwiperWrapperData(id: string): SwiperWrapperData {
            const key = String(id)

            if (key === "0") {
                return {
                    wrapperStyle: {
                        height: "382px",
                        transform: "translate3d(0px,0px,0px)"
                    },
                    slides: [
                        {
                            slideClassName: "swiper-slide swiper-slide-active",
                            slideStyle: { width: "631.429px", marginRight: "24px" },
                            cardClassName: "brand-themes-card Essential brand-themes-card-lg",
                            imgId: "14"
                        },
                        {
                            slideClassName: "swiper-slide swiper-slide-next",
                            slideStyle: { width: "631.429px", marginRight: "24px" },
                            cardClassName: "brand-themes-card Black brand-themes-card-lg",
                            imgId: "15"
                        },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Pure brand-themes-card-lg", imgId: "16" },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Modern brand-themes-card-lg", imgId: "17" },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Inverse brand-themes-card-lg", imgId: "18" },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Midnight brand-themes-card-lg", imgId: "19" },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Groundy brand-themes-card-lg", imgId: "20" },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Edge brand-themes-card-lg", imgId: "21" },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Monochrome brand-themes-card-lg", imgId: "22" },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Botanic brand-themes-card-lg", imgId: "23" },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Spark brand-themes-card-lg", imgId: "24" },
                        { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Photographic brand-themes-card-lg", imgId: "25" }
                    ]
                }
            }

            return {
                wrapperStyle: {
                    height: "382px",
                    transform: "translate3d(0px, 0px, 0px)"
                },
                slides: [
                    {
                        slideClassName: "swiper-slide swiper-slide-active",
                        slideStyle: { width: "631.429px", marginRight: "24px" },
                        cardClassName: "brand-themes-card Essential brand-themes-card-lg",
                        imgId: "14",
                        navigateRoutes: JSON.stringify(["/60/templates/themes/Essential-65d4e58e54c6bc5ba00a94e5"])
                    },
                    {
                        slideClassName: "swiper-slide swiper-slide-next",
                        slideStyle: { width: "631.429px", marginRight: "24px" },
                        cardClassName: "brand-themes-card Black brand-themes-card-lg",
                        imgId: "15"
                    },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Pure brand-themes-card-lg", imgId: "16" },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Modern brand-themes-card-lg", imgId: "17" },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Inverse brand-themes-card-lg", imgId: "18" },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Midnight brand-themes-card-lg", imgId: "19" },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Groundy brand-themes-card-lg", imgId: "20" },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Edge brand-themes-card-lg", imgId: "21" },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Monochrome brand-themes-card-lg", imgId: "22" },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Botanic brand-themes-card-lg", imgId: "23" },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Spark brand-themes-card-lg", imgId: "24" },
                    { slideClassName: "swiper-slide", slideStyle: { width: "631.429px", marginRight: "24px" }, cardClassName: "brand-themes-card Photographic brand-themes-card-lg", imgId: "25" }
                ]
            }
        }
    

export default SwiperWrapper
