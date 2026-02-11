import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import CheckboxInput from './CheckboxInput.tsx'

null
// Component

        function TemplateFilterPanel() {
            return (
                <div>
                    <div className={"template-filter"}>
                        <div className={"brand-slide-down"}>
                            <div className={"brand-slide-down-header"}>
                                <div className={"brand-slide-down-title"}>
                                    Célok
                                </div>
                            </div>
                            <div className={"brand-slide-down-body"}>
                                <FilterItem
                                    id={"template-goal-listBuilding"}
                                    name={"listBuilding"}
                                    label={"Listaépítés"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-goal-stopCartAbandonment"}
                                    name={"stopCartAbandonment"}
                                    label={"Kosárelhagyók csökkentése"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-goal-growAOV"}
                                    name={"growAOV"}
                                    label={"Átlagos rendelési érték növelés"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-goal-collectFeedback"}
                                    name={"collectFeedback"}
                                    label={"Visszajelzések gyűjtése"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-goal-guideYourVisitors"}
                                    name={"guideYourVisitors"}
                                    label={"Látogatók irányítása"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-goal-boostConversions"}
                                    name={"boostConversions"}
                                    label={"Konverzió növelés"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-goal-increaseSales"}
                                    name={"increaseSales"}
                                    label={"Eladásösztönzés"}
                                    withMarginTop={true}
                                />
                            </div>
                        </div>

                        <div className={"brand-slide-down"}>
                            <div className={"brand-slide-down-header"}>
                                <div className={"brand-slide-down-title"}>
                                    Tartalom
                                </div>
                            </div>
                            <div className={"brand-slide-down-body"}>
                                <FilterItem
                                    id={"template-content-coupon"}
                                    name={"coupon"}
                                    label={"Kupon"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-content-luckyWheel"}
                                    name={"luckyWheel"}
                                    label={"Szerencsekerék"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-content-product"}
                                    name={"product"}
                                    label={"Termékajánló"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-content-countdown"}
                                    name={"countdown"}
                                    label={"Visszaszámláló"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-content-survey"}
                                    name={"survey"}
                                    label={"Felmérés"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-content-feedback"}
                                    name={"feedback"}
                                    label={"Feedback"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-content-pickAPresent"}
                                    name={"pickAPresent"}
                                    label={"Ajándék választó"}
                                    withMarginTop={true}
                                />
                                <FilterItem
                                    id={"template-content-scratchCard"}
                                    name={"scratchCard"}
                                    label={"Kaparós sorsjegy"}
                                    withMarginTop={true}
                                />
                            </div>
                        </div>

                        <div className={"brand-slide-down"}>
                            <div className={"brand-slide-down-header"}>
                                <div className={"brand-slide-down-title"}>
                                    Üzenet típus
                                </div>
                            </div>
                            <div className={"brand-slide-down-body"}>
                                <FilterItem
                                    id={"template-type-embedded"}
                                    name={"embedded"}
                                    label={"Beágyazható tartalom"}
                                />
                                <FilterItem
                                    id={"template-type-nanobar"}
                                    name={"nanobar"}
                                    label={"Sticky bar"}
                                />
                                <FilterItem
                                    id={"template-type-popup"}
                                    name={"popup"}
                                    label={"Popup"}
                                />
                                <FilterItem
                                    id={"template-type-sidebar"}
                                    name={"sidebar"}
                                    label={"Sidemessage"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

// Subcomponents

        function FilterItem({
            id,
            name,
            label,
            withMarginTop
        }: {
            id: string;
            name: string;
            label: string;
            withMarginTop?: boolean;
        }) {
            return (
                <div id={id} className={"template-filter-item"}>
                    <div className={"d-flex-1 justify-content-start align-items-center"}>
                        <CheckboxInput name={name} withMarginTop={withMarginTop} />
                        <label
                            htmlFor={name}
                            className={"template-filter-item-label template-filter-item-label-active"}
                        >
                            {label}
                        </label>
                    </div>
                </div>
            )
        }
    

export default TemplateFilterPanel
