import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'


    
// Component

        function FilterImg({
            imgId
        }: {
            imgId: string | number;
        }) {
            return (
                <div className={"filter-img"}>
                    <Img id={imgId} />
                </div>
            );
        }
    

export default FilterImg
