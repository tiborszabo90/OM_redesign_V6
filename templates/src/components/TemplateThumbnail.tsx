import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


        type TemplateThumbnailData = {
            line1: string;
            line2: string;
            line3: string;
            fallbackId: string;
        }
    
// Component

        function TemplateThumbnail({
            dataId
        }: {
            dataId: string;
        }) {
            const {
                line1,
                line2,
                line3,
                fallbackId
            }: TemplateThumbnailData = getTemplateThumbnailData(dataId)
            return (
                <div className={"template-thumbnail-box-wrapper custom-theme-slider-template cursor-pointer"}>
                    <div className={"template-data-box"}>
                        {line1}
                        <br>
                        </br>
                        {line2}
                        <br>
                        </br>
                        {line3}
                    </div>
                    <div
                        id={`fallback-shown-${fallbackId}`}
                        className={"template-thumbnail-box brand-themes-template-box universal-template _lr-hide"}
                    >
                        <div className={"template-thumbnail-overlay brand-themes-template-box-overlay"}>
                        </div>
                        <div
                            id={`template-preview-iframe-${fallbackId}`}
                            className={"template-thumbnail-iframe"}
                            style={{display:"none", minWidth:"1280px", minHeight:"720px", zIndex:"-999999", transform:"scale(0.282288)"}}
                        >
                        </div>
                    </div>
                </div>
            )
        }
    


        function getTemplateThumbnailData(id: string): TemplateThumbnailData {
            const key = String(id)
            const data: Record<string, TemplateThumbnailData> = {
                "0": { line1: "Essential", line2: "FqzbFlmsX", line3: "YOspXlkTq", fallbackId: "66c3305b29e9ab002381b429" },
                "1": { line1: "Essential", line2: "QnjYPA4L6", line3: "4oDIZldab", fallbackId: "65d5f94ad4d5710023c7ef0a" },
                "2": { line1: "Essential", line2: "SaWLJ8D3c", line3: "aSf4c7iQx", fallbackId: "65d60028e5d00c0024755a66" },
                "3": { line1: "Essential", line2: "DXzJvhfoI", line3: "jMlz21_gz", fallbackId: "65e1a5ec0fe8c900246967cd" },
                "4": { line1: "Essential", line2: "KfgzflywW", line3: "ks12MyiIa", fallbackId: "65d60a029b2d3e002307496d" },
                "5": { line1: "Essential", line2: "ZVM_g4Xx3", line3: "-2lILtlSq", fallbackId: "65e1cbae0fe8c900246968bb" },
                "6": { line1: "Essential", line2: "eylu9khNV", line3: "mNvbsfBa4", fallbackId: "65e1dbaa0fe8c90024696926" },
                "7": { line1: "Essential", line2: "lAetGGbk9", line3: "0X5R7D2DZ", fallbackId: "65e1dcfa4305bc0024669ad9" },
                "8": { line1: "Essential", line2: "pw9Mhn-WQ", line3: "rsTlDN4L7", fallbackId: "65e1dff86fbc460023898b70" },
                "9": { line1: "Essential", line2: "Re4fblKcT", line3: "BWnafYt63", fallbackId: "6824947713907edd03094538" },
                "10": { line1: "Essential", line2: "USJor5SSI", line3: "qfEHhH3mR", fallbackId: "65e1a07b4305bc002466988e" },
                "11": { line1: "Essential", line2: "k70Nx-BQ2", line3: "58bA0o17Y", fallbackId: "6855555825962f6bc3181f7a" }
            }
            return data[key] || data["0"]
        }
    

export default TemplateThumbnail
