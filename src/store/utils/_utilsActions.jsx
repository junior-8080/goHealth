import { SET_SITE_LANG, SET_PAGE_TITLE } from '../_types';

export function setPageTitle(title) {
    return dispatch => {
        dispatch({ type: SET_PAGE_TITLE, title });
    }
};

export function setSiteLang(lang) {
    return dispatch => {
        dispatch({ type: SET_SITE_LANG, lang});
    }
};