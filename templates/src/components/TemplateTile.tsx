import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import LineBreak from './LineBreak.tsx'
import TemplateThumbnailIframe from './TemplateThumbnailIframe.tsx'
import TemplateThumbnail from './TemplateThumbnail.tsx'


        type TemplateTileData = {
            codeLine1: string;
            codeLine2: string;
            fallbackId: string;
            iframeId: string;
            title: string;
        }
    
// Component

        function TemplateTile({
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
            }: TemplateTileData = getTemplateTileData(dataId);

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
    

function getTemplateTileData(id): TemplateTileData  {
    switch (String(id)) {
    case "0":
        return {
                    "codeLine1": "78pKl7eFV",
                    "codeLine2": "vdXRJ0KC7",
                    "fallbackId": "fallback-shown-6319a730b866660023c07dd6",
                    "iframeId": "template-preview-iframe-6319a730b866660023c07dd6",
                    "title": "Feliratkoztató csalogató"
                };
    case "1":
        return {
                    "codeLine1": "TYWHBFvzV",
                    "codeLine2": "m_oAkB0vO",
                    "fallbackId": "fallback-shown-6319b5fd33d44f002374ef15",
                    "iframeId": "template-preview-iframe-6319b5fd33d44f002374ef15",
                    "title": "Kuponkód emlékeztető"
                };
    case "2":
        return {
                    "codeLine1": "img_bJLMW",
                    "codeLine2": "GNm8x2mqt",
                    "fallbackId": "fallback-shown-6324520c35e1430023ea44bb",
                    "iframeId": "template-preview-iframe-6324520c35e1430023ea44bb",
                    "title": "Kilépési emlékeztető"
                };
    case "3":
        return {
                    "codeLine1": "-ZC3nuENL",
                    "codeLine2": "GlEW1x4-S",
                    "fallbackId": "fallback-shown-673c80981e1f980023bece4e",
                    "iframeId": "template-preview-iframe-673c80981e1f980023bece4e",
                    "title": "Intelligens üdvözlő popup"
                };
    case "4":
        return {
                    "codeLine1": "7R3tegIFybm",
                    "codeLine2": "r3sbqX3ep",
                    "fallbackId": "fallback-shown-64218bcc81ebaf6c65cee805",
                    "iframeId": "template-preview-iframe-64218bcc81ebaf6c65cee805",
                    "title": "Visszaszámláló popup"
                };
    case "5":
        return {
                    "codeLine1": "MmIkZX_NV",
                    "codeLine2": "TP6DPr3wd",
                    "fallbackId": "fallback-shown-667bd0f821c6c800249cf590",
                    "iframeId": "template-preview-iframe-667bd0f821c6c800249cf590",
                    "title": "Nyereményjáték"
                };
    case "6":
        return {
                    "codeLine1": "YxHWgaZ0OkD",
                    "codeLine2": "ysMi9frrL7F",
                    "fallbackId": "fallback-shown-65eef822aecfc3f7a5583e82",
                    "iframeId": "template-preview-iframe-65eef822aecfc3f7a5583e82",
                    "title": "Hírlevél feliratkoztató popup"
                };
    case "7":
        return {
                    "codeLine1": "Jeva7twybtD",
                    "codeLine2": "a79HZGR3aOI",
                    "fallbackId": "fallback-shown-65faa6e001767e4484822b60",
                    "iframeId": "template-preview-iframe-65faa6e001767e4484822b60",
                    "title": "SMS listaépítés"
                };
    case "8":
        return {
                    "codeLine1": "kOKc79IBpcm",
                    "codeLine2": "VHgWTCuO0bt",
                    "fallbackId": "fallback-shown-65fd66da2d9c502c9b41525d",
                    "iframeId": "template-preview-iframe-65fd66da2d9c502c9b41525d",
                    "title": "Beágyazott űrlap"
                };
    case "9":
        return {
                    "codeLine1": "TEWXGDdE10",
                    "codeLine2": "hBGYLfCjfo",
                    "fallbackId": "fallback-shown-662250439f04a12912bb4e64",
                    "iframeId": "template-preview-iframe-662250439f04a12912bb4e64",
                    "title": "Klasszikus szerencsekerék"
                };
    case "10":
        return {
                    "codeLine1": "FZGNik40OG",
                    "codeLine2": "X0tEs7dIYa",
                    "fallbackId": "fallback-shown-6662c177ab756f259f0281ad",
                    "iframeId": "template-preview-iframe-6662c177ab756f259f0281ad",
                    "title": "Párbeszéd popup"
                };
    case "11":
        return {
                    "codeLine1": "MEV1ifL1Bv",
                    "codeLine2": "tWADYRM2YK",
                    "fallbackId": "fallback-shown-67ea6571d1bb64157538acfd",
                    "iframeId": "template-preview-iframe-67ea6571d1bb64157538acfd",
                    "title": "Trójai faló"
                };
    case "12":
        return {
                    "codeLine1": "GLZEhX-Tf",
                    "codeLine2": "0MhiLuYSw",
                    "fallbackId": "fallback-shown-631f41181861b800249d70e6",
                    "iframeId": "template-preview-iframe-631f41181861b800249d70e6",
                    "title": "Kosárelhagyás csökkentés"
                };
    case "13":
        return {
                    "codeLine1": "yL0yFy7Dx",
                    "codeLine2": "1J6mmSpEa",
                    "fallbackId": "fallback-shown-66166f849eda1d0023ad730a",
                    "iframeId": "template-preview-iframe-66166f849eda1d0023ad730a",
                    "title": "Kosárelhagyás csökkentés"
                };
    case "14":
        return {
                    "codeLine1": "9xNgjTuIF",
                    "codeLine2": "bB7y9Y4do",
                    "fallbackId": "fallback-shown-661e6e2f8d0b0e0024d74923",
                    "iframeId": "template-preview-iframe-661e6e2f8d0b0e0024d74923",
                    "title": "Kosárelhagyás csökkentés"
                };
    case "15":
        return {
                    "codeLine1": "ufhBqPtxG",
                    "codeLine2": "PKVP-YfKa",
                    "fallbackId": "fallback-shown-66c32e5decf9b80024863b4e",
                    "iframeId": "template-preview-iframe-66c32e5decf9b80024863b4e",
                    "title": "Kilépési emlékeztető"
                };
    case "16":
        return {
                  "codeLine1": "scC8AYOaJ6",
                  "codeLine2": "ApmFVSU5a6",
                  "fallbackId": "fallback-shown-66224fc2bb371728aa36a7ed",
                  "iframeId": "template-preview-iframe-66224fc2bb371728aa36a7ed",
                  "title": "Kosárelhagyás csökkentés"
                };
    case "17":
        return {
                    "codeLine1": "Ux5NjJOc2o",
                    "codeLine2": "VKYiqqZT9n",
                    "fallbackId": "fallback-shown-662250439f04a12912bb4e62",
                    "iframeId": "template-preview-iframe-662250439f04a12912bb4e62",
                    "title": "Top Termékajánló"
                };
    case "18":
        return {
                    "codeLine1": "Im1kIKa7h",
                    "codeLine2": "vMIxlmOvL",
                    "fallbackId": "fallback-shown-65e1a1aa0fe8c900246967a1",
                    "iframeId": "template-preview-iframe-65e1a1aa0fe8c900246967a1",
                    "title": "Ingyenes szállítási sáv"
                };
    case "19":
        return {
                    "codeLine1": "w-So90A9J",
                    "codeLine2": "Gz8assF8L",
                    "fallbackId": "fallback-shown-67ac9a4b483b3f00238431c8",
                    "iframeId": "template-preview-iframe-67ac9a4b483b3f00238431c8",
                    "title": "Hasonló Termékajánló"
                };
    case "20":
        return {
                  "codeLine1": "NHfyInx85-V",
                  "codeLine2": "3SfXbh9_0EY",
                  "fallbackId": "fallback-shown-65faa6e001767e4484822b61",
                  "iframeId": "template-preview-iframe-65faa6e001767e4484822b61",
                  "title": "Ingyenes szállítási sáv"
                };
    case "21":
        return {
                    "codeLine1": "m70YHhvWJS8",
                    "codeLine2": "NVplTG-FzAQ",
                    "fallbackId": "fallback-shown-65fd66da2d9c502c9b41525a",
                    "iframeId": "template-preview-iframe-65fd66da2d9c502c9b41525a",
                    "title": "Ingyenes szállítási sáv"
                };
    case "22":
        return {
                  "codeLine1": "_SwzgTf_e",
                  "codeLine2": "dly0Kpyyb",
                  "fallbackId": "fallback-shown-67acb388483b3f0023843295",
                  "iframeId": "template-preview-iframe-67acb388483b3f0023843295",
                  "title": "Hasonló Termékajánló"
                };
    case "23":
        return {
                    "codeLine1": "UF334sjHR",
                    "codeLine2": "VJ_mMaRzx",
                    "fallbackId": "fallback-shown-64c7a6c8701c700024a4d6e6",
                    "iframeId": "template-preview-iframe-64c7a6c8701c700024a4d6e6",
                    "title": "Exkluzív termékajánló visszatérőknek"
                };
    default:
        return {
                    "codeLine1": "78pKl7eFV",
                    "codeLine2": "vdXRJ0KC7",
                    "fallbackId": "fallback-shown-6319a730b866660023c07dd6",
                    "iframeId": "template-preview-iframe-6319a730b866660023c07dd6",
                    "title": "Feliratkoztató csalogató"
                };
    }
}


export default TemplateTile
