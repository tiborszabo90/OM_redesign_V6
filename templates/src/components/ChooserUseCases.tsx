import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'
import UseCaseCardImage from './UseCaseCardImage.tsx'
import UseCaseCard from './UseCaseCard.tsx'


// Component

        function ChooserUseCases() {
            return (
                <div>
                    <div className={"chooser-use-cases"}>
                        <div className={"chooser-use-cases-cards"}>
                            <ChooserUseCasesCard
                                id={"65ba19dc39eb6000240f7e02"}
                                classExtra={" special-case"}
                                imgId={43}
                                dataId={"0"}
                            />
                            <ChooserUseCasesCard id={"5fb5095eb2c7250013145979"} imgId={44} dataId={"1"} />
                            <ChooserUseCasesCard id={"5fb534fb0e4fb2001328a154"} imgId={45} dataId={"2"} />
                            <ChooserUseCasesCard id={"613b4920acdfbc001d24a57a"} imgId={49} dataId={"3"} />
                            <ChooserUseCasesCard id={"683c35df01bab32213a0f3b4"} imgId={50} dataId={"4"} />
                            <ChooserUseCasesCard id={"5fb534910e4fb2001328a153"} imgId={51} dataId={"5"} />
                            <ChooserUseCasesCard id={"5fb505eeb2c7250013145961"} imgId={52} dataId={"6"} />
                            <ChooserUseCasesCard id={"5fb50eb0e31f8300133fce75"} imgId={53} dataId={"7"} />
                            <ChooserUseCasesCard id={"5fb5114f0e4fb2001328a0b7"} imgId={54} dataId={"8"} />
                            <ChooserUseCasesCard id={"5fb53337b2c7250013145a9a"} imgId={55} dataId={"9"} />
                            <ChooserUseCasesCard id={"624c61975e2d640023f5501b"} imgId={56} dataId={"10"} />
                            <ChooserUseCasesCard id={"5fabce0f8a4b6100128e2627"} imgId={57} dataId={"11"} />
                            <ChooserUseCasesCard id={"5fb50e27b2c72500131459a7"} imgId={58} dataId={"12"} />
                            <ChooserUseCasesCard id={"5fb7cf92cfb17f001305dfdc"} imgId={59} dataId={"13"} />
                            <ChooserUseCasesCard id={"5fb7e324cfb17f001305e030"} imgId={60} dataId={"14"} />
                            <ChooserUseCasesCard id={"64c11aa8581ec600251082c5"} imgId={61} dataId={"15"} />
                            <ChooserUseCasesCard id={"66753760ab550d00245e4227"} imgId={62} dataId={"16"} />
                            <ChooserUseCasesCard id={"5fb53133e31f8300133fcf48"} imgId={63} dataId={"17"} />
                            <ChooserUseCasesCard id={"5fb7ce42cfb17f001305dfd8"} imgId={64} dataId={"18"} />
                            <ChooserUseCasesCard id={"602400f89612930012dc527e"} imgId={65} dataId={"19"} />
                            <ChooserUseCasesCard id={"6061bdcc96bed5001dae03cc"} imgId={66} dataId={"20"} />
                            <ChooserUseCasesCard id={"607d6cff2cdacf001d08a858"} imgId={67} dataId={"21"} />
                            <ChooserUseCasesCard id={"6214fdeda981870024aa7ad7"} imgId={68} dataId={"22"} />
                            <ChooserUseCasesCard id={"64d5ff7c6668a40025654eae"} imgId={69} dataId={"23"} />
                            <ChooserUseCasesCard id={"5fb516f60e4fb2001328a0cc"} imgId={70} dataId={"24"} />
                            <ChooserUseCasesCard id={"5fb519c00e4fb2001328a0cf"} imgId={71} dataId={"25"} />
                            <ChooserUseCasesCard id={"5fb7e511e6535c0012b74d94"} imgId={72} dataId={"26"} />
                            <ChooserUseCasesCard id={"5fb7f319cfb17f001305e090"} imgId={73} dataId={"27"} />
                            <ChooserUseCasesCard id={"5ffc54cab2317100121de450"} imgId={74} dataId={"28"} />
                            <ChooserUseCasesCard id={"60507931fcc047001a65365e"} imgId={75} dataId={"29"} />
                            <ChooserUseCasesCard id={"683c406001bab32213a12a8c"} imgId={76} dataId={"30"} />
                            <ChooserUseCasesCard id={"5fb7c820c808830013110105"} imgId={77} dataId={"31"} />
                            <ChooserUseCasesCard id={"5fb7c8a69958650012f54d73"} imgId={78} dataId={"32"} />
                            <ChooserUseCasesCard id={"67acb5fd483b3f00238432ad"} imgId={79} dataId={"33"} />
                            <ChooserUseCasesCard id={"683c390301bab32213a104d8"} imgId={80} dataId={"34"} />
                        </div>
                    </div>
                </div>
            )
        }
    

// Subcomponents

        function ChooserUseCasesCard({
            id,
            classExtra = "",
            imgId,
            dataId
        }: {
            id: string;
            classExtra?: string;
            imgId: number;
            dataId: string;
        }) {
            return (
                <div id={id} className={"chooser-use-cases-card" + classExtra}>
                    <div className={"use-case-card"}>
                        <UseCaseCardImage imgId={imgId} />
                        <UseCaseCard dataId={dataId} />
                    </div>
                </div>
            )
        }
    

export default ChooserUseCases
