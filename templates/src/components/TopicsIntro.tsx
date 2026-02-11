import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import MediaActionButton from './MediaActionButton.tsx'


// Component
function TopicsIntro() {
    return <div className={"col"}>
        <div className={"d-flex h-100 text-wrapper"}>
            <div className={"col"}>
                <div data-v-b0ffb60a={""} className={"heading mb-2 font-size-3 heading-3 design-system"}>
                    Mik azok a Témák?
                </div>
                <div data-v-4ceea79a={""} className={"body-text line-break body-text-400-md design-system"}>
                    Belefáradtál már, hogy a kampányod minden oldalát egyesével hozzáigazítsd a márkád arculatához? Állíts be egységes megjelenést a kampányaidnak csupán néhány kattintással, a Témák segítségével.
                </div>
            </div>
            <div className={"row buttons justify-content-start"}>
                
                            <MediaActionButton dataId="0" />
                        
                
                            <MediaActionButton dataId="1" />
                        
            </div>
        </div>
    </div>}


export default TopicsIntro
