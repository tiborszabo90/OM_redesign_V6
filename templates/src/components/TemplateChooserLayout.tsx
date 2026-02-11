import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import ChooserUseCases from './ChooserUseCases.tsx'
import TemplateNav from './TemplateNav.tsx'
import SearchInputWrapper from './SearchInputWrapper.tsx'
import TemplateFilterPanel from './TemplateFilterPanel.tsx'
import LanguageSelect from './LanguageSelect.tsx'
import TemplateChooserHome from './TemplateChooserHome.tsx'
import TopicsCollectionPage from './TopicsCollectionPage.tsx'
import TemplateChooserPage from './TemplateChooserPage.tsx'


    
// Component

        function TemplateChooserLayout({
            variant,
            showFilters,
            dataId
        }: {
            variant: "home" | "topics" | "page" | "useCases";
            showFilters?: boolean;
            dataId?: string;
        }) {
            const location = useLocation()

            return (
                <div className={"brand-wrapper brand-template-chooser-v2"}>
                    <div className={"container-fluid"}>
                        <div className={"layout-side-by-side d-flex"}>
                            <div className={"layout-left-column"}>
                                <nav className={"navigation-v2 mt-6"}>
                                    {(() => {
                                        switch (location.pathname + location.search + location.hash) {
                                            case "/60/templates":
                                            case "/60/templates/use-cases":
                                            case "/60/templates?step=2":
                                                return <TemplateNav />
                                            case "/60/templates/themes":
                                                return <TemplateNav submenuActiveLabel="Beépített témák" />
                                            case "/60/templates/themes/Essential-65d4e58e54c6bc5ba00a94e5":
                                                return <TemplateNav submenuActiveLabel={null} />
                                            default:
                                                return null
                                        }
                                    })()}
                                </nav>
                                <div className={"search-bar-input-wrapper ml-auto mt-6 mb-2"}>
                                    <SearchInputWrapper />
                                </div>
                                {showFilters ? (
                                    <div className={"filters"}>
                                        <TemplateFilterPanel />
                                    </div>
                                ) : null}
                            </div>
                            <div className={"layout-right-column"}>
                                <div className={"template-chooser-page-content"}>
                                    <span>
                                        <div className={"search-bar-heading row align-items-start justify-content-between"}>
                                            <div className={"col-auto"}>
                                                <div data-v-b0ffb60a={""} className={"heading heading-1 design-system"}>
                                                    Essential téma
                                                </div>
                                                <div
                                                    data-v-4ceea79a={""}
                                                    className={"body-text template-chooser-subtitle mt-2 body-text-400-md design-system"}
                                                >
                                                </div>
                                            </div>
                                            <div className={"row col"}>
                                                <div className={"col-12 col-lg d-flex justify-content-end my-2"}>
                                                    <div data-v-3a5f12d8={""} className={"language-chooser"}>
                                                        <div data-v-3a5f12d8={""} className={"language-chooser-label"}>
                                                            Sablon nyelve
                                                        </div>
                                                        <div
                                                            data-v-263ed9dd={""}
                                                            data-v-3a5f12d8={""}
                                                            className={"select language-chooser-select select-position-top select-has-options design-system select-language-chooser"}
                                                        >
                                                            <LanguageSelect />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {(() => {
                                            switch (variant) {
                                                case "home":
                                                    return <TemplateChooserHome dataId={dataId as string} />
                                                case "topics":
                                                    return <TopicsCollectionPage />
                                                case "page":
                                                    return <TemplateChooserPage />
                                                case "useCases":
                                                    return <ChooserUseCases />
                                                default:
                                                    return null
                                            }
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

export default TemplateChooserLayout
