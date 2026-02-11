import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import TemplateThumbnail from './TemplateThumbnail.tsx'


    
// Component

        function TemplateThumbnailIframe({
            iframeId
        }: {
            iframeId: string;
        }) {
            return (
                <div
                    id={iframeId}
                    className={"template-thumbnail-iframe"}
                    style={{
                        display: "none",
                        minWidth: "1280px",
                        minHeight: "720px",
                        zIndex: "-999999",
                        transform: "scale(0.282288)"
                    }}
                >
                </div>
            );
        }
    

export default TemplateThumbnailIframe
