import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import FilterImg from './FilterImg.tsx'
import CenteredHeading from './CenteredHeading.tsx'


// Component
function TemplateChooserTopFilterOnly() {
    return <div className={"template-chooser-home-wrapper"}>
        <div className={"template-chooser-top-filter"}>
            <div className={"row"}>
                <div className={"flex-wrap col-md-4 col-xl-2"}>
                    <div className={"filter-block"}>
                        
                                    <FilterImg imgId={8} />
                                
                        
                                    <CenteredHeading text="Popup" />
                                
                    </div>
                </div>
                <div className={"flex-wrap col-md-4 col-xl-2"}>
                    <div className={"filter-block"}>
                        
                                    <FilterImg imgId={9} />
                                
                        
                                    <CenteredHeading text="Gamification" />
                                
                    </div>
                </div>
                <div className={"flex-wrap col-md-4 col-xl-2"}>
                    <div className={"filter-block"}>
                        
                                    <FilterImg imgId={10} />
                                
                        
                                    <CenteredHeading text="Sticky bar" />
                                
                    </div>
                </div>
                <div className={"flex-wrap col-md-4 col-xl-2"}>
                    <div className={"filter-block"}>
                        
                                    <FilterImg imgId={11} />
                                
                        
                                    <CenteredHeading text="Sidemessage" />
                                
                    </div>
                </div>
                <div className={"flex-wrap col-md-4 col-xl-2"}>
                    <div className={"filter-block"}>
                        
                                    <FilterImg imgId={12} />
                                
                        
                                    <CenteredHeading text="Beágyazott tartalom" />
                                
                    </div>
                </div>
                <div className={"flex-wrap col-md-4 col-xl-2"}>
                    <div className={"filter-block"}>
                        
                                    <FilterImg imgId={13} />
                                
                        
                                    <CenteredHeading text="Képes popup" />
                                
                    </div>
                </div>
            </div>
        </div>
    </div>}


export default TemplateChooserTopFilterOnly
