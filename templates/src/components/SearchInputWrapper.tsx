import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import TemplateSearchInput from './TemplateSearchInput.tsx'
import SearchButton from './SearchButton.tsx'


// Component
function SearchInputWrapper() {
    return <div data-v-50696e8e={""} className={"input-wrapper search-bar-input"}>
        <div data-v-50696e8e={""} className={"input-wrapper-col"}>
            <div data-v-50696e8e={""} className={"input-element-wrapper design-system type-text suffix-slot-used invalid-suffix"}>
                
                        <TemplateSearchInput />
                    
                <div data-v-50696e8e={""} className={"input-suffix-slot"}>
                    <SearchButton />
                </div>
            </div>
        </div>
    </div>}


export default SearchInputWrapper
