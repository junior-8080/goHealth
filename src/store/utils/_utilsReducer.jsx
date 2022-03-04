import { SET_SITE_LANG, SET_PAGE_TITLE, SET_PAGE_SUB_TITLE } from '../_types';

const initialState = {
    pageTitle: 'BlowApp Monitor',
    pageSubTitle: '',
    lang: 'en',
};

const utilsReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;

        case SET_PAGE_TITLE:
            return {
                ...state,
                pageTitle: action.title
            }

        case SET_PAGE_SUB_TITLE:
            return {
                ...state,
                pageSubTitle: action.title
            };

        case SET_SITE_LANG:
            return {
                ...state,
                lang: action.lang
            };
    }
};


export default utilsReducer;