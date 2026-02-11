import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import TopicsIntro from './TopicsIntro.tsx'


// Component

        function TopicsCollectionPage() {
            return (
                <div data-v-3f2e4d80={""}>
                    <div data-v-3f2e4d80={""} className={"template-chooser-collection-page"}>
                        <span data-v-3f2e4d80={""}>
                            <div data-v-3f2e4d80={""} className={"template-chooser-banner-wrapper themes-banner"}>
                                <div className={"row align-items-stretch h-100"}>
                                    <TopicsIntro />
                                    <div className={"col flex-grow-0 d-flex align-items-center pl-0"}>
                                    </div>
                                </div>
                            </div>
                        </span>
                        <div data-v-3f2e4d80={""} className={"grid-container mt-6"}>
                            <ThemeGridItem themeClass="Spark" imgId="24" />
                            <ThemeGridItem themeClass="Midnight" imgId="19" />
                            <ThemeGridItem themeClass="Pure" imgId="16" />
                            <ThemeGridItem themeClass="Edge" imgId="21" />
                            <ThemeGridItem themeClass="Essential" imgId="14" />
                            <ThemeGridItem themeClass="Inverse" imgId="18" />
                            <ThemeGridItem themeClass="Botanic" imgId="23" />
                            <ThemeGridItem themeClass="Black" imgId="15" />
                            <ThemeGridItem themeClass="Monochrome" imgId="22" />
                            <ThemeGridItem themeClass="Photographic" imgId="25" />
                            <ThemeGridItem themeClass="Modern" imgId="17" />
                            <ThemeGridItem themeClass="Groundy" imgId="20" />
                            <ThemeGridItem themeClass="New Year" imgId="46" />
                            <ThemeGridItem themeClass="Winter" imgId="47" />
                            <ThemeGridItem themeClass="Christmas" imgId="48" />
                        </div>
                    </div>
                </div>
            )
        }
    

// Subcomponents

        function ThemeGridItem({
            themeClass,
            imgId
        }: {
            themeClass: string;
            imgId: string;
        }) {
            return (
                <div data-v-3f2e4d80={""} className={"grid-item"}>
                    <div
                        data-v-021da501={""}
                        data-v-3f2e4d80={""}
                        className={`brand-themes-card ${themeClass}`}
                    >
                        <Img id={imgId} />
                    </div>
                </div>
            )
        }
    

export default TopicsCollectionPage
