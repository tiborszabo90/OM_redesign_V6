import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'


        type SeasonSwiperData = {
            slides: {
                slideClassName: string;
                seasonClassName: string;
                imgId: string;
            }[];
        }
    
// Component

        function SeasonSwiper({
            dataId,
            transform
        }: {
            dataId: string;
            transform: string;
        }) {
            const { slides }: SeasonSwiperData = getSeasonSwiperData(dataId)
            return (
                <div
                    className={"swiper-wrapper"}
                    style={{ height: "263px", transform }}
                >
                    {slides.map((slide, index) => (
                        <SeasonSlide
                            key={index}
                            slideClassName={slide.slideClassName}
                            seasonClassName={slide.seasonClassName}
                            imgId={slide.imgId}
                        />
                    ))}
                </div>
            )
        }
    

// Subcomponents

        function SeasonSlide({
            slideClassName,
            seasonClassName,
            imgId
        }: {
            slideClassName: string;
            seasonClassName: string;
            imgId: string;
        }) {
            return (
                <div
                    className={slideClassName}
                    style={{ width: "434.8px", marginRight: "24px" }}
                >
                    <div
                        data-v-a7d2a7f0={""}
                        className={`season-card ${seasonClassName}`}
                    >
                        <Img id={imgId} />
                    </div>
                </div>
            )
        }
    


        function getSeasonSwiperData(id: string): SeasonSwiperData {
            const key = String(id)
            return {
                slides: [
                    {
                        slideClassName: "swiper-slide swiper-slide-active",
                        seasonClassName: "valentin",
                        imgId: "26"
                    },
                    {
                        slideClassName: "swiper-slide swiper-slide-next",
                        seasonClassName: "st_patricks",
                        imgId: "27"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "easter",
                        imgId: "28"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "mothers",
                        imgId: "29"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "childrens",
                        imgId: "30"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "fathers",
                        imgId: "31"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "july_4",
                        imgId: "32"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "summer",
                        imgId: "33"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "back_to_school",
                        imgId: "34"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "autumn",
                        imgId: "35"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "halloween",
                        imgId: "36"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "black_friday",
                        imgId: "37"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "cyber_monday",
                        imgId: "38"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "christmas",
                        imgId: "39"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "new_year",
                        imgId: "40"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "winter",
                        imgId: "41"
                    },
                    {
                        slideClassName: "swiper-slide",
                        seasonClassName: "super_bowl",
                        imgId: "42"
                    }
                ]
            }
        }
    

export default SeasonSwiper
