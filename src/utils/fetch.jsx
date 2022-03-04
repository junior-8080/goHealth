import axios from 'axios';
import { func } from '.';
import fetch from 'isomorphic-unfetch';

export const apnData = (obj) => {
    const body = new FormData();
    for (var p in obj) {
        if (p === 'file') {
            body.append('file[0]', obj[p]);
        } else if (p === 'image') {
            body.append('image[0]', obj[p]);
        } else {
            body.append(p, obj[p]);
        }
    }
    return body;
}

export const apiHeaders = (type = '') => {
    var token = func.getStorage('token') || '';
    if (type === 'file') {
        return {
            'Accept': 'application/json',
            'Platform': `${func.api.apiPlatform}/${func.app.version}`,
            'goh-access-token': `${func.api.apiKey}.${token}`
        };
    } else {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Platform': `${func.api.apiPlatform}/${func.app.version}`,
            'goh-access-token': `${func.api.apiKey}.${token}`,
        };
    }
}


export const post = async (action, data = {}, empty = false) => {
    let headers = apiHeaders();
    let url = ((empty === false) ? func.api.apiURL + action : action);
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error };
    }
}

export const get = async (action, data = {}, empty = false) => {
    let headers = apiHeaders();
    let url = ((empty === false) ? func.api.apiURL + action : action);
    return axios({
        method: 'GET', url,
        headers: empty ? {} : headers,
        params: data
    }).then(response => {
        const res = response.data;
        return res;
    }).catch(error => {
        return { status: 606, result: 'Network request failed', error };
    });
}

export const put = async (action, data = {}, empty = false) => {
    let headers = apiHeaders();
    let url = ((empty === false) ? func.api.apiURL + action : action);
    try {
        let response = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error };
    }
}

export const delte = async (action, data = {}) => {
    let headers = apiHeaders();
    try {
        let response = await fetch(func.api.apiURL + action, {
            method: 'DELETE',
            headers,
            body: JSON.stringify(data),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error: error };
    }
}

export const postFile = async (action, data = {}) => {
    let headers = apiHeaders('file');
    try {
        let response = await fetch(func.api.server_dev + action, {
            method: 'POST',
            headers,
            body: apnData(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return { status: 606, result: 'Network request failed', error: error };
    }
}

