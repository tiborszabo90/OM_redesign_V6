import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Downward_chevron from './icons/Downward_chevron.tsx'
import SelectOption from './SelectOption.tsx'


// Component
function LanguageSelect() {
    return <div data-v-263ed9dd={""} className={"select-wrapper"}>
        <span data-v-263ed9dd={""}>
            <span style={{display:"none"}}>
                <div data-v-263ed9dd={""} className={"popper brand-popper select-popper"} style={{minWidth:"initial"}}>
                    <div data-v-263ed9dd={""} className={"select-options"}>
                        
                                    <SelectOption label="Angol" index={0} />
                                
                        
                                    <SelectOption label="Francia" index={1} />
                                
                        
                                    <SelectOption label="Magyar" index={2} isSelected={true} />
                                
                        
                                    <SelectOption label="Német" index={3} />
                                
                        
                                    <SelectOption label="Portugál" index={4} />
                                
                        
                                    <SelectOption label="Román" index={5} />
                                
                        
                                    <SelectOption label="Spanyol" index={6} />
                                
                    </div>
                </div>
            </span>
            <div data-v-263ed9dd={""} className={"select-content form-control"}>
                <span data-v-263ed9dd={""} className={"select-toggle"}>
                    <Downward_chevron />
                </span>
                <input data-v-263ed9dd={""} autoComplete={"off"} type={"button"} id={"language-chooser"} className={"text-left select-input"} value={"Magyar"}>
                </input>
                <span data-v-263ed9dd={""} className={"select-selection"}>
                    Magyar
                </span>
                <div data-v-263ed9dd={""} className={"clearfix"}>
                </div>
            </div>
        </span>
        <div data-v-263ed9dd={""} className={"select-messages"}>
        </div>
    </div>}


export default LanguageSelect
