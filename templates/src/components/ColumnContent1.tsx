import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import CenteredText from './CenteredText.tsx'
import ColumnContent from './ColumnContent.tsx'


// Component

        function ColumnContent1() {
            return (
                <div id={"col_SdHj-OMS4"} className={"col-12 _xs-12 canv-col"} type={""} data-margin={""}>
                    <div className={"om-view-content-helper"}>
                        <OmTextBlock
                            elementMargin={"ele_ma_aY8sNiCUc"}
                            wrapperId={"ele_aY8sNiCUc_wrapper"}
                            elementId={"ele_aY8sNiCUc"}
                            dataId={"15"}
                        />
                        <OmTextBlock
                            elementMargin={"ele_ma_xOhJxedLr"}
                            wrapperId={"ele_xOhJxedLr_wrapper"}
                            elementId={"ele_xOhJxedLr"}
                            dataId={"16"}
                        />
                        <OmTextBlock
                            elementMargin={"ele_ma_zXtuWcIw4"}
                            wrapperId={"ele_zXtuWcIw4_wrapper"}
                            elementId={"ele_zXtuWcIw4"}
                            dataId={"17"}
                        />
                        <div className={"om-element"} type={"OmSpacer"} data-margin={"ele_ma_6YWyS6qgX"}>
                            <div className={"om-spacer"} id={"ele_6YWyS6qgX"}>
                            </div>
                        </div>
                        <div className={"om-element"} type={"OmButton"} data-margin={"ele_ma_j83lW33KW"}>
                            <div id={"ele_j83lW33KW_wrapper"} className={"om-full"}>
                                <div id={"ele_j83lW33KW"} className={"om-button"}>
                                    <CenteredText dataId="18" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

// Subcomponents

        function OmTextBlock({
            elementMargin,
            wrapperId,
            elementId,
            dataId
        }: {
            elementMargin: string;
            wrapperId: string;
            elementId: string;
            dataId: string;
        }) {
            return (
                <div className={"om-element"} type={"OmText"} data-margin={elementMargin}>
                    <div id={wrapperId} className={"om-full"}>
                        <div id={elementId} className={"om-text"}>
                            <CenteredText dataId={dataId} />
                        </div>
                    </div>
                </div>
            )
        }
    

export default ColumnContent1
