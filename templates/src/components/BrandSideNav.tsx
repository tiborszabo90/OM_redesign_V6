import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import Img from './Img.tsx'
import BrandSideNavLogo from './BrandSideNavLogo.tsx'
import BrandSideNavItem1 from './BrandSideNavItem1.tsx'
import BrandTooltip from './BrandTooltip.tsx'
import BrandSideNavItem from './BrandSideNavItem.tsx'
import SimpleTextBlock from './SimpleTextBlock.tsx'
import BrandSideNavBottomItem from './BrandSideNavBottomItem.tsx'
import BrandAvatar from './BrandAvatar.tsx'
import HelpCenterTooltip from './HelpCenterTooltip.tsx'
import ProfilePopper from './ProfilePopper.tsx'


// Component
function BrandSideNav() {
    const location = useLocation();
    return <nav className={"brand-side-nav"}>
        <BrandSideNavLogo />
        <div className={"brand-side-nav-top"}>
            
                        <BrandSideNavItem1
                            className={"brand-side-nav-item d-flex flex-column campaigns"}
                            imgId={1}
                            title={"Kampányok"}
                        />
                    
            
                        <BrandSideNavItem1
                            className={"brand-side-nav-item d-flex flex-column subscribers"}
                            imgId={2}
                            title={"Közönség"}
                        />
                    
            
                        <BrandSideNavItem1
                            className={"brand-side-nav-item d-flex flex-column analytics"}
                            imgId={3}
                            title={"Analitika"}
                        />
                    
            {(() => {
                switch (location.pathname + location.search + location.hash) {
                case "/60/templates": case "/60/templates?step=2":
                    return <BrandSideNavItem1
                                    className={"brand-side-nav-item d-flex flex-column router-link-exact-active router-link-active templates"}
                                    imgId={4}
                                    title={"Sablonok"}
                                    navigateRoutes={JSON.stringify(["/60/templates"])}
                                />
                case "/60/templates/themes": case "/60/templates/use-cases": case "/60/templates/themes/Essential-65d4e58e54c6bc5ba00a94e5":
                    return <BrandSideNavItem1
                                    className={"brand-side-nav-item d-flex flex-column router-link-active templates"}
                                    imgId={4}
                                    title={"Sablonok"}
                                    navigateRoutes={JSON.stringify(["/60/templates"])}
                                />
                }
            })()}
            <div className={"more-menu-items"}>
                <span>
                    <span style={{display:"none"}}>
                        
                                <BrandTooltip />
                            
                    </span>
                    <div>
                        <BrandSideNavItem />
                    </div>
                </span>
            </div>
        </div>
        <div className={"brand-side-nav-bottom"}>
            <span>
                <span style={{display:"none"}}>
                    <div className={"popper brand-tooltip brand-tooltip-light brand-tooltip-right ml-n1"}>
                        
                                    <SimpleTextBlock text="Újdonságok" />
                                
                    </div>
                </span>
                <div>
                    <div className={"brand-side-nav-bottom-item cursor-pointer beamerTrigger"}>
                        <Img id="6" />
                    </div>
                </div>
            </span>
            <span>
                <span style={{display:"none"}}>
                    <div className={"popper brand-tooltip brand-tooltip-light brand-tooltip-right ml-n1"}>
                        
                                    <SimpleTextBlock text="Segítség" />
                                
                    </div>
                </span>
                <div>
                    <span className={"help-center-popper"}>
                        <span style={{display:"none"}}>
                            
                                    <HelpCenterTooltip />
                                
                        </span>
                        <BrandSideNavBottomItem />
                    </span>
                </div>
            </span>
            <div className={"brand-side-nav-bottom-item"}>
                <span>
                    <span style={{display:"none"}}>
                        
                                <ProfilePopper />
                            
                    </span>
                    <div className={"cursor-pointer"}>
                        
                                <BrandAvatar />
                            
                    </div>
                </span>
            </div>
        </div>
    </nav>}


export default BrandSideNav
