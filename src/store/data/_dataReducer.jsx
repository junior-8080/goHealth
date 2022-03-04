import { SET_SET_SETTINGS } from '../_types';
import * as func from '../../utils/functions';

const initialState = {
    settings: func.getStorageJson('settings') || {},

    navigation: [
        // { code: '', name: 'Dashboard', icon: 'fas fa-fw fa-home', link: '', subs: [] },
        {
            code: 'pha', name: 'Pharmacies', icon: 'fas fa-fw fa-capsules', link: 'pharmacies',
            subs: [],
        },
        {
            code: 'man', name: 'Manufacturers', icon: 'fas fa-fw fa-industry', link: 'manufacturers',
            subs: [],
        },
        {
            code: 'doc', name: 'Doctors', icon: 'fas fa-fw  fa-user', link: 'doctors',
            subs: [],
        },
        {
            code: 'fdven', name: 'Food Vendors', icon: 'fas fa-fw fa-utensils', link: 'foodvendors',
            subs:[]
            
        },
        {
            code: 'gro', name: 'Groceries ', icon: 'fas fa-fw  fa-box-open', link: 'groceries',
            subs:[]
            
        },
        { code: 'ord', name: 'Orders', icon: 'fas fa-fw fa-cube', link: 'orders', subs: [], },
        {
            code: 'lon', name: 'Loans', icon: 'fas fa-fw fa-dollar-sign', link: 'loans', subs: [
                { code: 'lon_lon', name: 'Manage loans', link: 'loans', rules: [] },
                { code: 'lon_use', name: 'Loans usage', link: 'loans/usage', rules: [] },
            ],
        },
        { code: 'trs', name: 'Transfers', icon: 'fas fa-fw fa-university', link: 'transfers', subs: [], },
        {
            code: 'usr', name: 'Users', icon: 'fas fa-fw fa-users', link: 'users', subs: [
                { code: 'usr_usr', name: 'Manage users', link: 'users', rules: [] },
                { code: 'usr_adm', name: 'Admin users', link: 'users/admins', subs: [], },
                { code: 'usr_prm', name: 'Admin permissions', link: 'users/permissions', rules: [] },
                { code: 'usr_not', name: 'Notifications', link: 'users/notifications', rules: [] },
            ],
        },
        {
            code: 'set', name: 'Settings', icon: 'fas fa-fw fa-cogs', link: 'riders',
            subs: [
                { code: 'set_set', name: 'General settings', link: 'settings', rules: [] },
                { code: 'set_itm', name: 'Item categories', link: 'settings/items-categories', rules: [] },
                { code: 'set_del', name: 'Delivery charges', link: 'settings/deliveries', rules: [] },
            ]
        },
    ]
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;

        case SET_SET_SETTINGS:
            return {
                ...state,
                [action.key]: action.value
            };
    }
};


export default dataReducer;