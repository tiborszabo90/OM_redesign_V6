import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


        type CenteredTextData = {
            lineHeight: string;
            tag: "span" | "u";
            text: string;
            className: string;
            style?: React.CSSProperties;
        }
    
// Component

        function CenteredText({
            dataId
        }: {
            dataId: string;
        }) {
            const {
                lineHeight,
                tag,
                text,
                className,
                style
            }: CenteredTextData = getCenteredTextData(dataId)

            const InnerTag = tag

            return (
                <div
                    className={"om-dtr-content ql-align-center"}
                    style={{ lineHeight }}
                >
                    <InnerTag
                        className={className}
                        style={style}
                    >
                        {text}
                    </InnerTag>
                </div>
            )
        }
    

function getCenteredTextData(id): CenteredTextData  {
    switch (String(id)) {
    case "0":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Várj! Oszd meg véleményed!",
                    "className": "om-text-fontsize-30 om-color-palette-main ql-font-om-font-1",
                    "style": { "fontWeight": "700" }
                };
    case "1":
        return {
                    "lineHeight": "1.5",
                    "tag": "span",
                    "text": "Hogyan értékelnéd a vásárlásod?",
                    "className": "om-color-palette-c7 ql-font-om-font-2 om-text-fontsize-18",
                    "style": { "fontWeight": "400" }
                };
    case "2":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Várj! szerezd meg...",
                    "className": "om-text-fontsize-16 om-color-palette-main ql-font-om-font-2",
                    "style": { "fontWeight": "700", "textTransform": "uppercase" }
                };
    case "3":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "10%-os kupont",
                    "className": "om-color-palette-main ql-font-om-font-1 om-text-fontsize-52",
                    "style": { "fontWeight": "700" }
                };
    case "4":
        return {
                    "lineHeight": "1",
                    "tag": "span",
                    "text": "Folytatás",
                    "className": "om-button-fontsize-18 om-color-palette-main ql-font-om-font-2",
                    "style": { "fontWeight": "700", "textTransform": "uppercase" }
                };
    case "5":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Szeretnél egy 10.000 forintos ajándékkártyát?",
                    "className": "ql-font-om-font-1 om-color-palette-main om-text-fontsize-36",
                    "style": { "fontWeight": "700" }
                };
    case "6":
        return {
                    "lineHeight": "1.3",
                    "tag": "span",
                    "text": "Vegyél részt a játékunkban!",
                    "className": "om-text-fontsize-18 ql-font-om-font-2 om-color-palette-c7",
                    "style": { "fontWeight": "500", "textTransform": "uppercase" }
                };
    case "7":
        return {
                    "lineHeight": "1.5",
                    "tag": "span",
                    "text": "Add meg az email címed, hogy esélyed legyen nyerni.",
                    "className": "om-color-palette-c7 ql-font-om-font-2 om-text-fontsize-18",
                    "style": { "fontWeight": "400" }
                };
    case "8":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Szereztél egy 10%-os kupont!",
                    "className": "om-color-palette-main ql-font-om-font-1 om-text-fontsize-70",
                    "style": { "fontWeight": "700" }
                };
    case "9":
        return {
                    "lineHeight": "1.5",
                    "tag": "span",
                    "text": "Iratkozz fel hírlevelünkre, és Tiéd egy 10%-os kupon.",
                    "className": "om-color-palette-c7 ql-font-om-font-2 om-text-fontsize-22",
                    "style": { "fontWeight": "400" }
                };
    case "10":
        return {
                    "lineHeight": "1",
                    "tag": "span",
                    "text": "IGEN, KÉREM A 10%-OT",
                    "className": "om-color-palette-main ql-font-om-font-2 om-button-fontsize-20",
                    "style": { "fontWeight": "700", "textTransform": "uppercase" }
                };
    case "11":
        return {
                    "lineHeight": "1",
                    "tag": "u",
                    "text": "Nem, köszi",
                    "className": "om-button-fontsize-18 om-color-palette-main ql-font-om-font-2",
                    "style": { "fontWeight": "700" }
                };
    case "12":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Szerezz exkluzív ajánlatokat",
                    "className": "ql-font-om-font-1 om-color-palette-main om-text-fontsize-36",
                    "style": { "fontWeight": "700" }
                };
    case "13":
        return {
                    "lineHeight": "1.5",
                    "tag": "span",
                    "text": "Értesülj elsőként az exkluzív ajánlatokról, új termékekről és még sok másról!",
                    "className": "om-color-palette-c7 ql-font-om-font-2 om-text-fontsize-18",
                    "style": { "fontWeight": "400" }
                };
    case "14":
        return {
                    "lineHeight": "1.5",
                    "tag": "span",
                    "text": "ÚJDONSÁGOK",
                    "className": "om-color-palette-c7 ql-font-om-font-2 om-text-fontsize-18",
                    "style": { "fontWeight": "400" }
                };
    case "15":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Nyári kollekciók",
                    "className": "om-text-fontsize-30 om-color-palette-main ql-font-om-font-1",
                    "style": { "fontWeight": "700" }
                };
    case "16":
        return {
                    "lineHeight": "1.5",
                    "tag": "span",
                    "text": "Megérkezett az új nyári kollekció! 🔥 Nézd meg most!",
                    "className": "om-color-palette-c7 ql-font-om-font-2 om-text-fontsize-18",
                    "style": { "fontWeight": "400" }
                };
    case "17":
        return {
                    "lineHeight": "1",
                    "tag": "span",
                    "text": "MEGNÉZEM",
                    "className": "ql-font-om-font-2 om-button-fontsize-18 om-color-palette-main",
                    "style": { "fontWeight": "700", "textTransform": "uppercase" }
                };
    case "18":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Pörgess, nyerj és spórolj",
                    "className": "om-color-palette-main ql-font-om-font-1 om-text-fontsize-52",
                    "style": { "fontWeight": "700" }
                };
    case "19":
        return {
                    "lineHeight": "1.5",
                    "tag": "span",
                    "text": "Úgy érzed, rád mosolyoghat a szerencse? Add meg az email címed, és pörgess!",
                    "className": "om-color-palette-c7 om-text-fontsize-18 ql-font-om-font-2",
                    "style": { "fontWeight": "400", "color": "rgb(77,77,77)" }
                };
    case "20":
        return {
                    "lineHeight": "1",
                    "tag": "span",
                    "text": "Pörgetek",
                    "className": "om-button-fontsize-18 om-color-palette-main ql-font-om-font-2",
                    "style": { "fontWeight": "700", "textTransform": "uppercase" }
                };
    case "21":
        return {
                  "lineHeight": "1.2",
                  "tag": "span",
                  "text": "Mit szólnál egy",
                  "className": "ql-font-om-font-1 om-color-palette-main om-text-fontsize-36",
                  "style": { "fontWeight": "700" }
                };
    case "22":
        return {
                  "lineHeight": "1.2",
                  "tag": "span",
                  "text": "10%-os kuponhoz?",
                  "className": "ql-font-om-font-1 om-color-palette-main om-text-fontsize-36",
                  "style": { "fontWeight": "700" }
                };
    case "23":
        return {
                  "lineHeight": "1.5",
                  "tag": "span",
                  "text": "Ne hagyd ki!",
                  "className": "om-color-palette-c7 ql-font-om-font-2 om-text-fontsize-18",
                  "style": { "fontWeight": "400" }
                };
    case "24":
        return {
                    "lineHeight": "1",
                    "tag": "span",
                    "text": "tovább",
                    "className": "om-button-fontsize-18 om-color-palette-main ql-font-om-font-2",
                    "style": { "fontWeight": "700", "textTransform": "uppercase" }
                };
    case "25":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "20%-os kupon &",
                    "className": "ql-font-om-font-1 om-color-palette-main om-text-fontsize-36",
                    "style": { "fontWeight": "700" }
                };
    case "26":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "ingyenes szállítás",
                    "className": "ql-font-om-font-1 om-color-palette-main om-text-fontsize-36",
                    "style": { "fontWeight": "700" }
                };
    case "27":
        return {
                    "lineHeight": "1.5",
                    "tag": "span",
                    "text": "Ha befejezed a rendelést ....",
                    "className": "om-color-palette-c7 ql-font-om-font-2 om-text-fontsize-18",
                    "style": { "fontWeight": "400" }
                };
    case "28":
        return {
                    "lineHeight": "1",
                    "tag": "span",
                    "text": "KÉREM A 20%-OS KUPONT",
                    "className": "om-button-fontsize-18 om-color-palette-main ql-font-om-font-2",
                    "style": { "fontWeight": "700", "textTransform": "uppercase" }
                };
    case "29":
        return {
                    "lineHeight": "1.3",
                    "tag": "span",
                    "text": "ne hagyd itt!",
                    "className": "om-text-fontsize-18 ql-font-om-font-2 om-color-palette-c7",
                    "style": { "fontWeight": "500", "textTransform": "uppercase" }
                };
    case "30":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Népszerű termékek, amik tetszeni fognak",
                    "className": "ql-font-om-font-1 om-color-palette-main om-text-fontsize-36",
                    "style": { "fontWeight": "700" }
                };
    case "31":
        return {
                    "lineHeight": "1.3",
                    "tag": "span",
                    "text": "Ingyenes ebook",
                    "className": "om-text-fontsize-18 ql-font-om-font-2 om-color-palette-c7",
                    "style": { "fontWeight": "500", "textTransform": "uppercase" }
                };
    case "32":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Töltsd le az ingyenes ebookot",
                    "className": "ql-font-om-font-1 om-color-palette-main om-text-fontsize-36",
                    "style": { "fontWeight": "700" }
                };
    case "33":
        return {
                    "lineHeight": "1",
                    "tag": "span",
                    "text": "Küldd el az ebookot",
                    "className": "om-button-fontsize-18 om-color-palette-main ql-font-om-font-2",
                    "style": { "fontWeight": "700", "textTransform": "uppercase" }
                };
    case "34":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Szerezd meg a",
                    "className": "om-color-palette-main ql-font-om-font-1 om-text-fontsize-52",
                    "style": { "fontWeight": "700" }
                };
    case "35":
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "10%-os kupont!",
                    "className": "om-color-palette-main om-text-fontsize-52 ql-font-om-font-1",
                    "style": { "fontWeight": "700" }
                };
    case "36":
        return {
                    "lineHeight": "1.5",
                    "tag": "span",
                    "text": "A kuponért oszd meg, hogy mit vásárolsz!",
                    "className": "om-color-palette-c7 ql-font-om-font-2 om-text-fontsize-18",
                    "style": {
                        "fontWeight": "400"
                    }
                };
    default:
        return {
                    "lineHeight": "1.2",
                    "tag": "span",
                    "text": "Várj! Oszd meg véleményed!",
                    "className": "om-text-fontsize-30 om-color-palette-main ql-font-om-font-1",
                    "style": { "fontWeight": "700" }
                };
    }
}


export default CenteredText
