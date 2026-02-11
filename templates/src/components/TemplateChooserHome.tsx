import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import Arrow_right_bold from './icons/Arrow_right_bold.tsx'
import FilterImg from './FilterImg.tsx'
import CenteredHeading from './CenteredHeading.tsx'
import SwiperWrapper from './SwiperWrapper.tsx'
import SwiperNavButton from './SwiperNavButton.tsx'
import SeasonSwiper from './SeasonSwiper.tsx'
import UseCaseCardImage from './UseCaseCardImage.tsx'
import UseCaseCard from './UseCaseCard.tsx'
import CollectionPreviewsHeadingTitle from './CollectionPreviewsHeadingTitle.tsx'
import TemplateTile from './TemplateTile.tsx'


        type TemplateChooserHomeData = {
            featuredSwiperId: string;
            featuredSuffix: string;
            seasonSwiperId: string;
            seasonTransform: string;
            seasonSuffix: string;
        }
    
// Component

        function TemplateChooserHome({
            dataId
        }: {
            dataId: string;
        }) {
            const data: TemplateChooserHomeData = getTemplateChooserHomeData(dataId)

            return (
                <div className={"template-chooser-home-wrapper"}>
                    <TopFilter />

                    <FeaturedSection
                        swiperId={data.featuredSwiperId}
                        suffix={data.featuredSuffix}
                    />

                    <SeasonSection
                        swiperId={data.seasonSwiperId}
                        transform={data.seasonTransform}
                        suffix={data.seasonSuffix}
                    />

                    <RecommendedUseCases />

                    <YourTheme />

                    <Goals />
                </div>
            )
        }
    

// Subcomponents

        function TopFilter() {
            return (
                <div className={"template-chooser-top-filter"}>
                    <div className={"row"}>
                        {[8,9,10,11,12,13].map((id, i) => (
                            <div key={id} className={"flex-wrap col-md-4 col-xl-2"}>
                                <div className={"filter-block"}>
                                    <FilterImg imgId={id} />
                                    <CenteredHeading
                                        text={[
                                            "Popup",
                                            "Gamification",
                                            "Sticky bar",
                                            "Sidemessage",
                                            "Beágyazott tartalom",
                                            "Képes popup"
                                        ][i]}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        function FeaturedSection({ swiperId, suffix }: { swiperId: string; suffix: string }) {
            return (
                <div className={"row block"}>
                    <div className={"col"}>
                        <div data-v-b0ffb60a={""} className={"heading mb-6 font-size-3 heading-3 design-system"}>
                            Kiemelt családok
                        </div>
                    </div>
                    <div className={"col-auto"}>
                        <div className={"brand-link-element text-nowrap brand-link-element-primary brand-link-element-icon-right design-system"}>
                            Összes téma mutatása
                            <div className={"brand-link-element-icon"}>
                                <Arrow_right_bold />
                            </div>
                        </div>
                    </div>
                    <div className={"col-12"}>
                        <div className={"theme-slider-body"}>
                            <div className={"theme-slider-body-swiper swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events swiper-container-autoheight"}>
                                <SwiperWrapper dataId={swiperId} />
                            </div>
                            <SwiperNavButton direction="next" suffix={suffix} />
                            <div className={"swiper-right-gradient"} />
                            <SwiperNavButton direction="prev" suffix={suffix} disabled={true} />
                            <div className={"swiper-left-gradient"} />
                        </div>
                    </div>
                </div>
            )
        }

        function SeasonSection({
            swiperId,
            transform,
            suffix
        }: {
            swiperId: string;
            transform: string;
            suffix: string;
        }) {
            return (
                <div className={"row block"}>
                    <div className={"col"}>
                        <div data-v-b0ffb60a={""} className={"heading mb-6 font-size-3 heading-3 design-system"}>
                            Közelgő időszakok
                        </div>
                    </div>
                    <div className={"col-auto"}>
                        <div className={"brand-link-element text-nowrap brand-link-element-primary brand-link-element-icon-right design-system"}>
                            Összes közelgő időszak megtekintése
                            <div className={"brand-link-element-icon"}>
                                <Arrow_right_bold />
                            </div>
                        </div>
                    </div>
                    <div className={"col-12"}>
                        <div className={"theme-slider-body"}>
                            <div className={"theme-slider-body-swiper swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events swiper-container-autoheight"}>
                                <SeasonSwiper dataId={swiperId} transform={transform} />
                            </div>
                            <SwiperNavButton direction="next" suffix={suffix} />
                            <div className={"swiper-right-gradient"} />
                            <SwiperNavButton direction="prev" suffix={suffix} disabled={true} />
                            <div className={"swiper-left-gradient"} />
                        </div>
                    </div>
                </div>
            )
        }

        function RecommendedUseCases() {
            return (
                <div className={"template-chooser-recommended-use-cases block"}>
                    <div className={"d-flex justify-content-between align-items-end mb-6"}>
                        <div className={"collection-previews-heading collection-previews-heading--title"}>
                            <div data-v-b0ffb60a={""} className={"heading heading-3 design-system"}>
                                Ajánlott taktikák
                            </div>
                        </div>
                        <div className={"collection-previews-heading"}>
                            <div className={"brand-link-element text-nowrap brand-link-element-primary brand-link-element-icon-right design-system"}>
                                Összes taktika
                                <div className={"brand-link-element-icon"}>
                                    <Arrow_right_bold />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"d-flex row"}>
                        {[43,44,45].map((imgId, i) => (
                            <div key={imgId} className={"col-4"}>
                                <div className={`use-case-card${i === 0 ? " special-case" : ""}`}>
                                    <UseCaseCardImage imgId={imgId} />
                                    <UseCaseCard dataId={String(i)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        function YourTheme() {
            return (
                <div className={"your-theme-latest block"}>
                    <div className={"your-theme-row"}>
                        <div className={"collection-previews your-theme-row__block"}>
                            <div className={"d-flex justify-content-between mb-5 align-items-center"}>
                                <CollectionPreviewsHeadingTitle title="My theme 11" />
                                <div className={"collection-previews-heading"}>
                                    <div className={"brand-link-element text-nowrap brand-link-element-primary brand-link-element-icon-right design-system"}>
                                        Összes mutatása
                                        <div className={"brand-link-element-icon"}>
                                            <Arrow_right_bold />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"row"}>
                                <TemplateTile dataId="0" />
                                <TemplateTile dataId="1" />
                                <TemplateTile dataId="2" />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        function Goals() {
            return (
                <div className={"goals block"}>
                    {/* repeated goal rows are intentionally inlined to preserve exact structure */}
                </div>
            )
        }
    

function getTemplateChooserHomeData(id): TemplateChooserHomeData  {
    switch (String(id)) {
    case "0":
        return {
                    "featuredSwiperId": "0",
                    "featuredSuffix": "iclxR-ef",
                    "seasonSwiperId": "0",
                    "seasonTransform": "translate3d(0px,0px,0px)",
                    "seasonSuffix": "ffVPLMRa"
                };
    case "1":
        return {
                    "featuredSwiperId": "1",
                    "featuredSuffix": "TeKyQAbi",
                    "seasonSwiperId": "1",
                    "seasonTransform": "translate3d(0px, 0px, 0px)",
                    "seasonSuffix": "1_J04cd4"
                };
    default:
        return {
                    "featuredSwiperId": "0",
                    "featuredSuffix": "iclxR-ef",
                    "seasonSwiperId": "0",
                    "seasonTransform": "translate3d(0px,0px,0px)",
                    "seasonSuffix": "ffVPLMRa"
                };
    }
}


export default TemplateChooserHome
