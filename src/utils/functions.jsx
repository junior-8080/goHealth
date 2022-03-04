import React from 'react';
import moment from 'moment';
import { Modal } from 'antd';

export const api = {
    space: 'of',
    headers: {},
    headersFile: {},

    key_of: 'cvrg7vssNLGH6JlPrVRt5pZNvAjf94k83ArFG8UK2LlVX9Gl7czzuqIQSdxsyzgb',
    key_dev: 'z369YwPDYnWMxHup9B5FTSMjw5EPqBk5cjeAcMX6wYrRCvTKbd5ppmmJhqYdKDC3',
    key_on: 'QShFN8DrPWLGNsJpkHhMHVWcw8eGqPcnfxDgMUL39MIfAGW6pTN8xKn4zRMWLw3r',

    server_of: 'http://localhost/_cp/gohealthy/api/',
    server_on: 'https://api.gohealthy.ng/',
    server_dev: 'https://dev-api.gohealthy.ng/',

    platform_of: 'localhost',
    platform_dev: 'dev-admin',
    platform_on: 'admin',
}

export const app = {
    version: require('../../package.json').version,
    dbpref: 'goh_',
}

export const initialize = () => {
    if (window.location.hostname === 'localhost') {
        api.space = 'dev';
    } else if (window.location.host === 'dev-admin.gohealthy.ng') {
        api.space = 'dev';
    } else {
        api.space = 'dev';
    }
    api.apiURL = api[`server_${api.space}`];
    api.apiKey = api[`key_${api.space}`];
    api.apiPlatform = api[`platform_${api.space}`];
    api.apiToken = getStorage('token');

    api.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Platform': `${api.apiPlatform}/${app.version}`,
        'goh-access-token': `${api.apiKey}.${api.apiToken}`
    };
    api.headersFile = {
        'Accept': 'application/json',
        'Platform': `${api.apiPlatform}/${app.version}`,
        'goh-access-token': `${api.apiKey}.${api.apiToken}`
    };
}

export const dates = {
    yr: moment().format('YYYY')
}


// Storage
export const setStorage = (key, value) => {
    if (key && value) {
        localStorage.setItem(app.dbpref + key, value);
    }
}
export const getStorage = (key) => {
    const value = localStorage.getItem(app.dbpref + key);
    return value || '';
}
export const setStorageJson = (key, value) => {
    if (key && value) {
        localStorage.setItem(app.dbpref + key, JSON.stringify(value));
    }
}
export const getStorageJson = (key) => {
    if (key) {
        const value = localStorage.getItem(app.dbpref + key);
        return JSON.parse(value) || [];
    }
}
export const delStorage = (key) => {
    if (key) {
        localStorage.removeItem(app.dbpref + key);
    }
}


export const inArray = (needle, haystack) => {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] === needle) return true;
    }
    return false;
}
export const mergeObj = (obj, src) => {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}
export const getFileExtension = (filename) => {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext === null ? '' : ext[1];
}


// Data Request
initialize();

export const alert = (props = {}) => {
    Modal.confirm({
        icon: null,
        centered: true,
        okText: 'Okay!',
        width: '300px',
        cancelButtonProps: { className: 'hide' },
        ...props,
        content: <span dangerouslySetInnerHTML={{ __html: props.content }} />,
    });
}

export const loading = (content) => {
    return new Promise((resolve) => {
        content = <div dangerouslySetInnerHTML={{ __html: `<i className="fa fa-spin fa-spinner"></i> <span>${content}</span>` }} />
        const loading = Modal.info({
            icon: null,
            title: null,
            centered: true,
            content,
            width: '250px',
            cancelText: <div />,
        });
        resolve(loading);
    });
}

// Spinners
export const fspinner = <div style={{ textAlign: 'center', color: '#999', lineHeight: 320 + 'px', width: 100 + '%' }}><i className="fa fa-spin fa-circle-o-notch fa-5x"></i></div>;
export const fspinner_sm = <div style={{ textAlign: 'center', color: '#999', lineHeight: 120 + 'px', width: 100 + '%' }}><i className="fa fa-spin fa-circle-o-notch fa-3x"></i></div>;
export const fspinner_xs = <i className="fa fa-spin fa-spinner primary"></i>;

export const redirect = (to) => {
    window.location = to;
}

export const generateOptions = (length, step = 1) => {
    const arr = [];
    for (let value = 0; value < length; value += step) {
        arr.push(value);
    }
    return arr;
};

export const hasR = (role) => {
    // return true;
    let user = getStorageJson('user') || {};
    let myRoles = ((user.access || {}).permissions || '').split(',');
    var hasR = !role || (myRoles.includes(role) || myRoles.includes('*'));
    return hasR;
};

export const numberFormat = (number, decimal = 0) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimal }).format(number);
}

export const imgError = e => {
    e.target.src = `assets/img/favicon.png`;
    return true;
}

export const chunk = (inputArray, chunkSize) => {
    return inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }
        resultArray[chunkIndex].push(item);
        return resultArray
    }, []);
}

export const  comparer = (otherArray) => {
    return function(current){
      return otherArray.filter(function(other){ // eslint-disable-next-line
        return other.days == current.abbre // eslint-disable-next-line
      }).length == 0; // eslint-disable-next-line
    }
}