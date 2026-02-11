import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Magnifying_glass from './icons/Magnifying_glass.tsx'


// Component
function SearchButton() {
    return <button data-v-54b206f2={""} type={"button"} title={"Search"} className={"search-bar-button btn btn-link btn-icon-only design-system"} data-v-50696e8e={""}>
        <span data-v-54b206f2={""} className={"d-inline-flex justify-content-center align-items-center btn-icon-only-wrap"}>
            <Magnifying_glass />
        </span>
    </button>}


export default SearchButton
