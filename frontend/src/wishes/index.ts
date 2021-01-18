import { InterpreterSettings } from '../storage';

import WISH_SHOML from './1_shoml.wish.json';
import WISH_CHUUML from './2_chuuml.wish.json';

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
    prerequesites: string[]; // names of the wishes that should be completed before this wish
    parts: WishPart[];
}

export interface WishSeries {
    id: string;
    name: string;
    shortName: string;
    description: string[];
    wishes: Wish[];
}

export let DEFAULT_WISHES: WishSeries[] = [
    WISH_SHOML,
    WISH_CHUUML
];
