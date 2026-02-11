import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import UseCaseCard from './UseCaseCard.tsx'


    
// Component

        function UseCaseCardImage({
            imgId
        }: {
            imgId: number;
        }) {
            return (
                <div className={"use-case-card-image-wrap"}>
                    <Img id={imgId} />
                </div>
            );
        }
    

export default UseCaseCardImage
