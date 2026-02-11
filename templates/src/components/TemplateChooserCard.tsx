import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import LineBreak from './LineBreak.tsx'
import TemplateThumbnailIframe from './TemplateThumbnailIframe.tsx'
import TemplateThumbnail from './TemplateThumbnail.tsx'


        type TemplateChooserCardData = {
            codeLine1: string;
            codeLine2: string;
            fallbackId: string;
            iframeId: string;
            title: string;
        }
    
// Component

        function TemplateChooserCard({
            dataId
        }: {
            dataId: string;
        }) {
            const {
                codeLine1,
                codeLine2,
                fallbackId,
                iframeId,
                title
            }: TemplateChooserCardData = getTemplateChooserCardData(dataId);

            return (
                <div className={"col-12 col-lg-4"}>
                    <div className={"template-chooser-template-box"}>
                        <div className={"template-box-wrapper ssr"}>
                            <div className={"template-thumbnail-box-wrapper custom-theme-slider-template cursor-pointer"}>
                                <div className={"template-data-box"}>
                                    Custom
                                    <LineBreak />
                                    {codeLine1}
                                    <LineBreak />
                                    {codeLine2}
                                </div>
                                <div
                                    id={fallbackId}
                                    className={"template-thumbnail-box brand-themes-template-box universal-template _lr-hide"}
                                >
                                    <div className={"template-thumbnail-overlay brand-themes-template-box-overlay"}>
                                    </div>

                                    <TemplateThumbnailIframe iframeId={iframeId} />
                                </div>
                            </div>
                        </div>
                        <div className={"template-chooser-content"}>
                            <div className={"template-chooser-title"}>
                                <span>
                                    {title}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    

function getTemplateChooserCardData(id): TemplateChooserCardData  {
    switch (String(id)) {
    case "0":
        return 
                {
                  "codeLine1": "sWVZzk1ew",
                  "codeLine2": "tC2bjfpJh",
                  "fallbackId": "fallback-shown-631f3494a4c0f20024535d63",
                  "iframeId": "template-preview-iframe-631f3494a4c0f20024535d63",
                  "title": "“Hol hallottál rólunk?” popup"
                }
            ;
    case "1":
        return 
                {
                    "codeLine1": "JqoJp-6oY",
                    "codeLine2": "zjd374vYn",
                    "fallbackId": "fallback-shown-631f357147a1df0025193360",
                    "iframeId": "template-preview-iframe-631f357147a1df0025193360",
                    "title": "Vásárlói elégedettség mérő (kedvezménnyel)"
                }
            ;
    case "2":
        return 
                {
                    "codeLine1": "sKAbpdOaO",
                    "codeLine2": "JRS8kXrXW",
                    "fallbackId": "fallback-shown-6824b6fb2ad72778246dd058",
                    "iframeId": "template-preview-iframe-6824b6fb2ad72778246dd058",
                    "title": "Vevőprobléma azonosító"
                }
            ;
    case "3":
        return 
                {
                    "codeLine1": "LQxY9EXsa",
                    "codeLine2": "mvWi-i2PU",
                    "fallbackId": "fallback-shown-65d5fbd63034e600230c0502",
                    "iframeId": "template-preview-iframe-65d5fbd63034e600230c0502",
                    "title": "NPS típusú kérdőív"
                }
            ;
    case "4":
        return 
                {
                    "codeLine1": "y1Vc0wtYAGt",
                    "codeLine2": "m0xeYBjG83d",
                    "fallbackId": "fallback-shown-65eef820aecfc3f7a5583e7b",
                    "iframeId": "template-preview-iframe-65eef820aecfc3f7a5583e7b",
                    "title": "NPS típusú kérdőív"
                }
            ;
    case "5":
        return 
                {
                  "codeLine1": "Xf7f-mPV9Xz",
                  "codeLine2": "zjd374vYn",
                  "fallbackId": "fallback-shown-64218bcc81ebaf6c65cee807",
                  "iframeId": "template-preview-iframe-64218bcc81ebaf6c65cee807",
                  "title": "Vásárlói elégedettség mérő (kedvezménnyel)"
                }
            ;
    case "6":
        return 
                {
                    "codeLine1": "9Dq0EZLaI",
                    "codeLine2": "--edg2pyo",
                    "fallbackId": "fallback-shown-621cae8659318c0023020fb1",
                    "iframeId": "template-preview-iframe-621cae8659318c0023020fb1",
                    "title": "Közlemény"
                }
            ;
    case "7":
        return 
                {
                    "codeLine1": "Fc2KjOZhY",
                    "codeLine2": "xBeI-Oa_z",
                    "fallbackId": "fallback-shown-631f390a47a1df0025193366",
                    "iframeId": "template-preview-iframe-631f390a47a1df0025193366",
                    "title": "Vásárlói kvíz"
                }
            ;
    case "8":
        return 
                {
                    "codeLine1": "1YsTR1nMtKR",
                    "codeLine2": "MSnQhw29S",
                    "fallbackId": "fallback-shown-64218bcf81ebaf6c65cee820",
                    "iframeId": "template-preview-iframe-64218bcf81ebaf6c65cee820",
                    "title": "Emlékeztető termékajánló"
                }
            ;
    case "9":
        return 
                {
                    "codeLine1": "cpdd_C2UBlG",
                    "codeLine2": "IJDiHhaDb",
                    "fallbackId": "fallback-shown-64218bd781ebaf6c65cee870",
                    "iframeId": "template-preview-iframe-64218bd781ebaf6c65cee870",
                    "title": "Közlemény"
                }
            ;
    case "10":
        return 
                {
                    "codeLine1": "7WqnOrn5k",
                    "codeLine2": "9YmRuM4nJO",
                    "fallbackId": "fallback-shown-65eef820aecfc3f7a5583e79",
                    "iframeId": "template-preview-iframe-65eef820aecfc3f7a5583e79",
                    "title": "Emlékeztető termékajánló"
                }
            ;
    case "11":
        return 
                {
                  "codeLine1": "jc9QAM3CO",
                  "codeLine2": "IJDiHhaDb",
                  "fallbackId": "fallback-shown-634578785f9ab90023c978b5",
                  "iframeId": "template-preview-iframe-634578785f9ab90023c978b5",
                  "title": "Közlemény"
                }
            ;
    case "12":
        return 
                {
                    "codeLine1": "PgvG7p5Jl0",
                    "codeLine2": "eX4HdtsjrV",
                    "fallbackId": "fallback-shown-662a10ebd5b96e4a8bd2000a",
                    "iframeId": "template-preview-iframe-662a10ebd5b96e4a8bd2000a",
                    "title": "Szezonális visszaszámláló"
                }
            ;
    case "13":
        return 
                {
                    "codeLine1": "2y92CK2TIZ",
                    "codeLine2": "VQUx0KmXr3",
                    "fallbackId": "fallback-shown-65eef821aecfc3f7a5583e7e",
                    "iframeId": "template-preview-iframe-65eef821aecfc3f7a5583e7e",
                    "title": "Szezonális visszaszámláló"
                }
            ;
    case "14":
        return 
                {
                    "codeLine1": "qNQEjtYuVL",
                    "codeLine2": "IiJ-DlTMhG",
                    "fallbackId": "fallback-shown-65faa6e001767e4484822b5e",
                    "iframeId": "template-preview-iframe-65faa6e001767e4484822b5e",
                    "title": "Szezonális visszaszámláló"
                }
            ;
    case "15":
        return 
                {
                    "codeLine1": "VpmMCooeg",
                    "codeLine2": "UGumztym-",
                    "fallbackId": "fallback-shown-65d60157833d01002437ca1c",
                    "iframeId": "template-preview-iframe-65d60157833d01002437ca1c",
                    "title": "Szezonális visszaszámláló"
                }
            ;
    case "16":
        return 
                {
                  "codeLine1": "p9S7JXBAqd",
                  "codeLine2": "aoJtQZB6BY",
                  "fallbackId": "fallback-shown-67ea656fd1bb64157538acbe",
                  "iframeId": "template-preview-iframe-67ea656fd1bb64157538acbe",
                  "title": "Szezonális visszaszámláló"
                }
            ;
    case "17":
        return 
                {
                  "codeLine1": "b3PLbK4nTa",
                  "codeLine2": "oHbSc7Flqx",
                  "fallbackId": "fallback-shown-662250479f04a12912bb4e77",
                  "iframeId": "template-preview-iframe-662250479f04a12912bb4e77",
                  "title": "Szezonális visszaszámláló"
                }
            ;
    case "18":
        return 
                {
                    "codeLine1": "Am3xTrVcr6",
                    "codeLine2": "MIMlzJJVb6",
                    "fallbackId": "fallback-shown-662250469f04a12912bb4e76",
                    "iframeId": "template-preview-iframe-662250469f04a12912bb4e76",
                    "title": "Kuponkód emlékeztető"
                }
            ;
    case "19":
        return 
                {
                  "codeLine1": "cGMk3glpXaV",
                  "codeLine2": "pj0ihyXhh",
                  "fallbackId": "fallback-shown-64218bcd81ebaf6c65cee80b",
                  "iframeId": "template-preview-iframe-64218bcd81ebaf6c65cee80b",
                  "title": "Kuponkód emlékeztető"
                }
            ;
    case "20":
        return 
                {
                    "codeLine1": "MeeES0diM",
                    "codeLine2": "RLWC6hICnk",
                    "fallbackId": "fallback-shown-65faa6e001767e4484822b5d",
                    "iframeId": "template-preview-iframe-65faa6e001767e4484822b5d",
                    "title": "Kuponkód emlékeztető"
                }
            ;
    case "21":
        return 
                {
                    "codeLine1": "63ZcIQlVQ",
                    "codeLine2": "mmk3dia-6G",
                    "fallbackId": "fallback-shown-65eef821aecfc3f7a5583e7d",
                    "iframeId": "template-preview-iframe-65eef821aecfc3f7a5583e7d",
                    "title": "Kuponkód emlékeztető"
                }
            ;
    case "22":
        return 
                {
                    "codeLine1": "gJZqIryOi",
                    "codeLine2": "4LpnIDDI1",
                    "fallbackId": "fallback-shown-631f3daaa4c0f20024535d94",
                    "iframeId": "template-preview-iframe-631f3daaa4c0f20024535d94",
                    "title": "Kuponkód emlékeztető"
                }
            ;
    case "23":
        return 
                {
                    "codeLine1": "oIuPI5zisR",
                    "codeLine2": "OPLSAp2t0f",
                    "fallbackId": "fallback-shown-67ea656fd1bb64157538acb5",
                    "iframeId": "template-preview-iframe-67ea656fd1bb64157538acb5",
                    "title": "Kuponkód emlékeztető"
                }
            ;
    default:
        return 
                {
                  "codeLine1": "sWVZzk1ew",
                  "codeLine2": "tC2bjfpJh",
                  "fallbackId": "fallback-shown-631f3494a4c0f20024535d63",
                  "iframeId": "template-preview-iframe-631f3494a4c0f20024535d63",
                  "title": "“Hol hallottál rólunk?” popup"
                }
            ;
    }
}


export default TemplateChooserCard
