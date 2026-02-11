import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import CenteredText from './CenteredText.tsx'
import FeedbackRadioInput from './FeedbackRadioInput.tsx'


        type SurveyColumnData = {
            imageId: string;
            textBlockA: string[];
            textBlockB: string[];
            hasSpacer: boolean;
            survey: {
                wrapperId: string;
                name: string;
                options: {
                    value: string;
                    label: string;
                    inputId: string;
                }[];
            };
        }
    
// Component

        function SurveyColumn({
            dataId
        }: {
            dataId: string;
        }) {
            const {
                imageId,
                textBlockA,
                textBlockB,
                hasSpacer,
                survey
            }: SurveyColumnData = getSurveyColumnData(dataId);

            return (
                <div id={"col_SdHj-OMS4"} className={"col-12 _xs-12 canv-col"} type={""} data-margin={""}>
                    <div className={"om-view-content-helper"}>
                        <div className={"om-element"} type={"OmImage"} data-margin={survey.wrapperId === "ele_ma_FEYMmvr1s" ? "ele_ma_FEYMmvr1s" : "ele_ma_xtxApHOsl"}>
                            <div className={"om-image"} id={`${survey.wrapperId.replace("ele_ma_", "ele_")}_align`}>
                                <picture>
                                    <Img id={imageId} />
                                </picture>
                            </div>
                        </div>

                        <div className={"om-element"} type={"OmText"} data-margin={"ele_ma_xOhJxedLr"}>
                            <div id={"ele_xOhJxedLr_wrapper"} className={"om-full"}>
                                <div id={"ele_xOhJxedLr"} className={"om-text"}>
                                    {textBlockA.map((tid) => (
                                        <CenteredText key={tid} dataId={tid} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={"om-element"} type={"OmText"} data-margin={"ele_ma_aY8sNiCUc"}>
                            <div id={"ele_aY8sNiCUc_wrapper"} className={"om-full"}>
                                <div id={"ele_aY8sNiCUc"} className={"om-text"}>
                                    {textBlockB.map((tid) => (
                                        <CenteredText key={tid} dataId={tid} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {hasSpacer && (
                            <div className={"om-element"} type={"OmSpacer"} data-margin={"ele_ma_6YWyS6qgX"}>
                                <div className={"om-spacer"} id={"ele_6YWyS6qgX"} />
                            </div>
                        )}

                        <div className={"om-element"} type={"OmSurvey"} data-margin={survey.wrapperId}>
                            <div id={`${survey.wrapperId.replace("ele_ma_", "ele_")}_wrapper`} className={"undefined"}>
                                <div className={"om-inputs-wrapper om-picker-group om-survey"} id={survey.wrapperId.replace("ele_ma_", "ele_")}>
                                    {survey.options.map((opt) => (
                                        <SurveyOption
                                            key={opt.inputId}
                                            name={survey.name}
                                            value={opt.value}
                                            inputId={opt.inputId}
                                            label={opt.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    

// Subcomponents

        function SurveyOption({
            name,
            value,
            inputId,
            label
        }: {
            name: string;
            value: string;
            inputId: string;
            label: string;
        }) {
            return (
                <div className={"om-input-picker-button om-survey-option"}>
                    <FeedbackRadioInput
                        name={name}
                        value={value}
                        id={inputId}
                    />
                    <label htmlFor={inputId}>
                        <span>{label}</span>
                    </label>
                </div>
            );
        }
    


        function getSurveyColumnData(id: string): SurveyColumnData {
            const key = String(id);

            if (key === "0") {
                return {
                    imageId: "81",
                    textBlockA: ["0"],
                    textBlockB: ["1"],
                    hasSpacer: true,
                    survey: {
                        wrapperId: "ele_ma_IChXNEz2N",
                        name: "custom_fields[kKqkjwkWl]",
                        options: [
                            { value: "1", label: "1", inputId: "kKqkjwkWl--pge_4Q1fvVv-I-input-0" },
                            { value: "2", label: "2", inputId: "kKqkjwkWl--pge_4Q1fvVv-I-input-1" },
                            { value: "3", label: "3", inputId: "kKqkjwkWl--pge_4Q1fvVv-I-input-2" },
                            { value: "4", label: "4", inputId: "kKqkjwkWl--pge_4Q1fvVv-I-input-3" },
                            { value: "5", label: "5", inputId: "kKqkjwkWl--pge_4Q1fvVv-I-input-4" }
                        ]
                    }
                };
            }

            return {
                imageId: "94",
                textBlockA: ["35", "36"],
                textBlockB: ["37"],
                hasSpacer: false,
                survey: {
                    wrapperId: "ele_ma_6K8yyg4_r",
                    name: "custom_fields[griZRhZSz]",
                    options: [
                        { value: "Pólók", label: "Pólók", inputId: "griZRhZSz--pge_4Q1fvVv-I-input-0" },
                        { value: "Ingek", label: "Ingek", inputId: "griZRhZSz--pge_4Q1fvVv-I-input-1" },
                        { value: "Nadrágok", label: "Nadrágok", inputId: "griZRhZSz--pge_4Q1fvVv-I-input-2" },
                        { value: "Kiegészítők", label: "Kiegészítők", inputId: "griZRhZSz--pge_4Q1fvVv-I-input-3" }
                    ]
                }
            };
        }
    

export default SurveyColumn
