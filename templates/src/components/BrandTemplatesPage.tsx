import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import IntercomLauncher from './IntercomLauncher.tsx'
import BrandSideNav from './BrandSideNav.tsx'
import TemplateChooserLayout from './TemplateChooserLayout.tsx'


// Component

        function BrandTemplatesPage() {
            const location = useLocation()

            return (
                <body className={""}>
                    <iframe
                        className={"brand-loading-transition brand-loading-transition-nav-width om-fadeOut"}
                        style={{ display: "none" }}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/01cf36c3-9037-4e9a-b371-943ef1de27c2/index.html"
                    >
                    </iframe>

                    <div className={"brand-page-wrap"}>
                        <div className={"d-flex"}>
                            <BrandSideNav />
                            <div className={"brand-page-wrap-content brand-page-wrap-content-margin-left"}>
                                <div className={"notification-bar sticky-top"}>
                                </div>

                                <div>
                                    {(() => {
                                        switch (location.pathname + location.search + location.hash) {
                                            case "/60/templates":
                                                return (
                                                    <TemplateChooserLayout
                                                        variant="home"
                                                        showFilters={true}
                                                        dataId="0"
                                                    />
                                                )
                                            case "/60/templates/themes":
                                                return (
                                                    <TemplateChooserLayout
                                                        variant="topics"
                                                    />
                                                )
                                            case "/60/templates/use-cases":
                                                return (
                                                    <TemplateChooserLayout
                                                        variant="useCases"
                                                    />
                                                )
                                            case "/60/templates?step=2":
                                                return (
                                                    <TemplateChooserLayout
                                                        variant="home"
                                                        showFilters={true}
                                                        dataId="2"
                                                    />
                                                )
                                            case "/60/templates/themes/Essential-65d4e58e54c6bc5ba00a94e5":
                                                return (
                                                    <TemplateChooserLayout
                                                        variant="page"
                                                    />
                                                )
                                            default:
                                                return null
                                        }
                                    })()}
                                </div>

                                <div className={"brand-scroll-top"}>
                                    <div className={"fas fa-angle-up"}>
                                    </div>
                                </div>

                                <div
                                    className={"vue-notification-group"}
                                    style={{
                                        position: "fixed",
                                        padding: "10px",
                                        bottom: "0px",
                                        right: "0px"
                                    }}
                                >
                                    <span>
                                    </span>
                                </div>

                                <div
                                    data-v-33ee7ba2={""}
                                    className={"v-portal"}
                                    style={{ display: "none" }}
                                >
                                </div>

                                <div
                                    className={"v-portal"}
                                    style={{ display: "none" }}
                                >
                                </div>

                                <div className={"vue-portal-target"}>
                                </div>
                            </div>
                        </div>
                    </div>

                    <iframe
                        title={"archetype"}
                        style={{ display: "none", visibility: "hidden" }}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/3ff3bf4e-619a-4b39-9845-4dc5ad5afdb1/index.html"
                    >
                    </iframe>

                    <iframe
                        height={"0"}
                        width={"0"}
                        style={{ display: "none", visibility: "hidden" }}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/a21a0f96-e888-432c-9ebe-734f92bfddb2/index.html"
                    >
                    </iframe>

                    <iframe
                        id={"__OM_native_iframe"}
                        style={{ display: "none" }}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/68470681-3b80-448f-8bbc-cfffb9de73d0/index.html"
                    >
                    </iframe>

                    <iframe
                        id={"intercom-frame"}
                        style={{
                            position: "absolute",
                            opacity: "0",
                            width: "1px",
                            height: "1px",
                            top: "0",
                            left: "0",
                            border: "none",
                            display: "block",
                            zIndex: "-1",
                            pointerEvents: "none"
                        }}
                        tabIndex={"-1"}
                        title={"Intercom"}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/5fbdcadc-bf2e-4945-9f4e-da037dc3e150/index.html"
                    >
                    </iframe>

                    <iframe
                        name={"__uspapiLocator"}
                        tabIndex={"-1"}
                        role={"presentation"}
                        title={"Blank"}
                        style={{
                            display: "none",
                            position: "absolute",
                            width: "1px",
                            height: "1px",
                            top: "-9999px"
                        }}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/20270625-570e-43c2-9920-cf0c7b3243a1/index.html"
                    >
                    </iframe>

                    <iframe
                        tabIndex={"-1"}
                        role={"presentation"}
                        title={"Blank"}
                        style={{
                            position: "absolute",
                            width: "1px",
                            height: "1px",
                            top: "-9999px"
                        }}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/bba64a5c-eac2-4972-9314-2186fa2a2e2d/index.html"
                    >
                    </iframe>

                    <iframe
                        height={"0"}
                        width={"0"}
                        style={{ display: "none", visibility: "hidden" }}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/848fc2c5-1d27-43e2-b2ab-a9d90a4e61d1/index.html"
                    >
                    </iframe>

                    <iframe
                        style={{ display: "none" }}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/58d7f187-f838-4153-888b-d1e90a5bdcd5/index.html"
                    >
                    </iframe>

                    <iframe
                        style={{ display: "none" }}
                        sandbox={"allow-popups allow-top-navigation-by-user-activation"}
                        src="frames/8b92de06-a626-4a46-9e26-3e619a4c682c/index.html"
                    >
                    </iframe>

                    <div className={"intercom-lightweight-app"}>
                        <IntercomLauncher />
                        <style id={"intercom-lightweight-app-style"}>
                        </style>
                    </div>
                </body>
            )
        }
    

export default BrandTemplatesPage
