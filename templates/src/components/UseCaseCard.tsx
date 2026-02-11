import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'


        type UseCaseCardData = {
            title: string;
            description: string;
        }

// Component

        function UseCaseCard({ dataId }: { dataId: string }) {
            const { title, description }: UseCaseCardData = getUseCaseCardData(dataId)
            return (
                <div className={"use-case-card-content"}>
                    <div className={"use-case-card-title"}>
                        {title}
                    </div>
                    <div className={"use-case-card-description"}>
                        {description}
                    </div>
                </div>
            )
        }


function getUseCaseCardData(id): UseCaseCardData  {
    switch (String(id)) {
    case "0":
        return {
                  "title": "Intelligens üdvözlő popup",
                  "description": "Duplázd meg üdvözlő popupod konverzióját!"
                };
    case "1":
        return {
                  "title": "Kosárelhagyás csökkentés",
                  "description": "Fordítsd vissza a kosárelhagyókat kedvezményekkel!"
                };
    case "2":
        return {
                  "title": "Klasszikus szerencsekerék",
                  "description": "Tedd játékossá a feliratkozást!"
                };
    case "3":
        return {
                    "title": "Párbeszéd popup",
                    "description": "Építs listát, gyűjts adatokat és ösztönözd a vásárlást!"
                };
    case "4":
        return {
                    "title": "Zsákbamacska",
                    "description": "Tereld a látogatókat vásárlás felé egy játékos élménnyel!"
                };
    case "5":
        return {
                    "title": "Kuponkód emlékeztető",
                    "description": "Emlékeztesd a látogatókat kuponbeváltásra!"
                };
    case "6":
        return {
                    "title": "Visszaszámláló popup",
                    "description": "Állítsd meg a kosárelhagyókat, még mielőtt távoznának!"
                };
    case "7":
        return {
                    "title": "Emlékeztető termékajánló",
                    "description": "Segíts a visszatérő látogatóknak ott folytatni, ahol abbahagyták!"
                };
    case "8":
        return {
                    "title": "Hírlevél feliratkoztató popup",
                    "description": "Építs hírlevél listát egyszerűen és felhasználóbarát módon!"
                };
    case "9":
        return {
                    "title": "Diszkrét kedvezményes popup",
                    "description": "Mutass nem zavaró kedvezményes popupokat!"
                };
    case "10":
        return {
                    "title": "Trójai faló",
                    "description": "Építsd egyszerre az email és SMS listádat!"
                };
    case "11":
        return {
                    "title": "Ingyenes szállítási sáv",
                    "description": "Emeld a kosárértéket ingyenes szállítás ajánlatával!"
                };
    case "12":
        return {
                    "title": "Feliratkoztató csalogató",
                    "description": "Bővítsd e-mail listádat értékes e-book letöltésekért cserébe!"
                };
    case "13":
        return {
                    "title": "Kilépési emlékeztető",
                    "description": "Hódítsd vissza a kosárelhagyókat és vezesd őket vissza a pénztárhoz!"
                };
    case "14":
        return {
                    "title": "Szezonális visszaszámláló",
                    "description": "Hozd ki a maximumot ajánlataidból a sürgetettséggel!"
                };
    case "15":
        return {
                    "title": "Top Termékajánló",
                    "description": "Keltsd fel a látogatók érdeklődését top termékeiddel!"
                };
    case "16":
        return {
                    "title": "Nyereményjáték",
                    "description": "Szerezz előfizetőket ajándékokkal vagy nyereményjátékokkal!"
                };
    case "17":
        return {
                    "title": "Vásárlói elégedettség mérő (kedvezménnyel)",
                    "description": "Növeld a lojalitást már az első vásárlás után!"
                };
    case "18":
        return {
                    "title": "Exkluzív termékajánló visszatérőknek",
                    "description": "Hirdesd legújabb ajánlatod visszatérő látogatóidnak!"
                };
    case "19":
        return {
                    "title": "Beágyazott szezonális ajánlat",
                    "description": "Mutass limitált idejű ajánlatokat a teljes weboldaladon!"
                };
    case "20":
        return {
                    "title": "SMS listaépítés",
                    "description": "Gyűjts be telefonszámokat, és indíts SMS kampányt!"
                };
    case "21":
        return {
                  "title": "Diszkrét kapcsolatfelvételi űrlapra",
                  "description": "Szerezz ajánlatkéréseket hatékonyan és diszéreten!"
                };
    case "22":
        return {
                  "title": "Dinamikus szállítási küszöb sáv",
                  "description": "Reklámozd az ingyenes szállítást a kosárérték alapján!"
                };
    case "23":
        return {
                  "title": "Szegmentáló popup",
                  "description": "Gyűjts feliratkozókat, szegmentálj, és ösztönözd a vásárlást!"
                };
    case "24":
        return {
                  "title": "'Hol hallottál rólunk?' popup",
                  "description": "Indíts vásárlás utáni felmérést!"
                };
    case "25":
        return {
                  "title": "Vásárlói elégedettség felmérés",
                  "description": "Derítsd ki a vásárlói élmény esetleges problémáit!"
                };
    case "26":
        return {
                  "title": "Vevőprobléma azonosító",
                  "description": "Tudd meg, mi tartja vissza a látogatókat, még mielőtt elhagynák az oldalt!"
                };
    case "27":
        return {
                  "title": "Vásárlói kvíz",
                  "description": "Szegmentáld és segítsd látogatókat a vásárlásban!"
                };
    case "28":
        return {
                  "title": "Közlemény",
                  "description": "Tájékoztasd a látogatóidat zökkenőmentesen!"
                };
    case "29":
        return {
                  "title": "Beágyazott termékajánló",
                  "description": "Ajánlj a látogatóidnak cikkeidhez kapcsolódó termékeket!"
                };
    case "30":
        return {
                    "title": "Beágyazott űrlap",
                    "description": "Gyűjts feliratkozókat élményrombolás nélkül!"
                };
    case "31":
        return {
                    "title": "Social media listaépítő",
                    "description": "Hatékony módszer a közösségi média követőid számának növelésére!"
                };
    case "32":
        return {
                    "title": "NPS típusú kérdőív",
                    "description": "Szerezz valós, mérhető visszajelzést bármiről, amiről csak szeretnél!"
                };
    case "33":
        return {
                    "title": "Hasonló Termékajánló",
                    "description": "Növeld az eladásokat egy dinamikus termékajánlóval!"
                };
    case "34":
        return {
                    "title": "Kaparós sorsjegy",
                    "description": "Tedd próbára a látogatóid szerencséjét!"
                };
    default:
        return {
                  "title": "Intelligens üdvözlő popup",
                  "description": "Duplázd meg üdvözlő popupod konverzióját!"
                };
    }
}


export default UseCaseCard
