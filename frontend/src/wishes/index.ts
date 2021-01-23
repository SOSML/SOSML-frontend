import { InterpreterSettings, ExternalWish, WishType } from '../storage';

import WISH_HOWTO from './0_howto.wish.json';
// import WISH_SHOML from './1_shoml.wish.json';
// import WISH_CHUUML from './2_chuuml.wish.json';

export interface InterpretationField {
    interpreterSettings?: InterpreterSettings;
    beforeCode?: string[]; // code to be executed before any user-entered code
    userDefaultCode?: string[]; // default code displayed
    afterCode?: string[]; // code used to check the user's input for correctness
}

export interface WishPart {
    description: string[];
    code: InterpretationField;
}

export interface Wish {
    name: string; // Name of the wish
    prerequisites: string[]; // names of the wishes that should be completed before this wish
    parts: WishPart[];
}

export interface WishSeries {
    id: string;
    name: string;
    shortName: string;
    description: string[];
    wishes: Wish[];
}

export let DEFAULT_WISHES: [WishSeries, ExternalWish][] = [
    [WISH_HOWTO, {fileName: '0_howto', wishType: WishType.LOCAL_DEFAULT}],
//    [WISH_SHOML, {fileName: '1_shoml', wishType: WishType.LOCAL_DEFAULT}],
//    [WISH_CHUUML, {fileName: '2_chuuml', wishType: WishType.LOCAL_DEFAULT}],
];
