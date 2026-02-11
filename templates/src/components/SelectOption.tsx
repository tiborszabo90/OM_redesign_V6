import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Thin_close_cross from './icons/Thin_close_cross.tsx'
import Regular_check_mark from './icons/Regular_check_mark.tsx'
import Regular_check_mark1 from './icons/Regular_check_mark1.tsx'


    
// Component

        function SelectOption({
            label,
            index,
            isSelected = false
        }: {
            label: string;
            index: number;
            isSelected?: boolean;
        }) {
            return (
                <div
                    data-v-263ed9dd={""}
                    className={`select-option${isSelected ? " select-option-selected" : ""}`}
                >
                    <div
                        data-v-263ed9dd={""}
                        className={`select-option-value text-truncate select-option-value-language-chooser-${index}`}
                    >
                        <span data-v-263ed9dd={""}>
                            {label}
                        </span>
                    </div>
                    <div
                        data-v-263ed9dd={""}
                        className={"select-option-status"}
                    >
                        <Thin_close_cross />
                        {isSelected ? <Regular_check_mark1 /> : <Regular_check_mark />}
                    </div>
                    <div
                        data-v-263ed9dd={""}
                        className={"select-option-actions"}
                    >
                    </div>
                </div>
            );
        }
    

export default SelectOption
