import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import SimpleTextBlock from './SimpleTextBlock.tsx'
import ProfilePopperItem from './ProfilePopperItem.tsx'
import ProfileInfoRow from './ProfileInfoRow.tsx'
import ProgressItem from './ProgressItem.tsx'


// Component

        function ProfilePopper() {
            const location = useLocation()
            return (
                <div className={"popper brand-side-nav-profile-popper"}>
                    <div className={"brand-side-nav-profile-popper-content"}>
                        <div className={"brand-side-nav-profile-popper-content-top"}>
                            <div className={"brand-side-nav-profile-popper-content-top-img"}>
                                <div
                                    className={"brand-avatar brand-avatar-big"}
                                    style={{ background: "rgb(145,152,169)" }}
                                >
                                    <SimpleTextBlock text="AÁ" />
                                </div>
                            </div>
                            <div className={"ml-3 mb-2"}>
                                <div className={"font-weight-bold font-size-0--9375"}>
                                    Ádám Attila
                                </div>
                                <div
                                    className={
                                        "font-size-0--875 brand-side-nav-profile-popper-gray text-truncate"
                                    }
                                >
                                    zsolt.gal@reflexshop.hu
                                </div>
                            </div>
                        </div>
                        <div className={"brand-side-nav-profile-popper-content-body"}>
                            <div className={"brand-side-nav-profile-popper-content-body-left"}>
                                <div className={"d-flex flex-column justify-content-center"}>
                                    <ProfilePopperItem label="Előfizetés" />
                                    <ProfilePopperItem label="Beállítások" />
                                    <ProfilePopperItem
                                        label="Felhasználók kezelése"
                                        idAttr="inviteYourTeamProfileAction"
                                    />
                                    <ProfilePopperItem label="Kijelentkezés" />
                                </div>
                            </div>
                            <div className={"brand-side-nav-profile-popper-content-body-right"}>
                                <div className={"d-flex flex-column justify-content-center"}>
                                    <ProfileInfoRow
                                        label="Előfizetésem"
                                        value="Diamond reflexshop (havi)"
                                    />
                                    <ProfileInfoRow
                                        label="Következő fizetés"
                                        value="2026. márc.. 01."
                                    />
                                    <ProgressItem dataId="0" />
                                    <ProgressItem dataId="1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    

export default ProfilePopper
