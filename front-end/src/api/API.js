const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};
export const doSignUp = (payload) =>
    
    fetch(`${api}/signup`, {
        method: 'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res => {
        // window.sessionStorage.setItem("email", payload.email);
        // window.sessionStorage.setItem("phone", payload.phone)
        // window.sessionStorage.setItem("key", payload.username);
        return res.json();
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doCheck = () =>
    fetch(`${api}/check`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',

    }).then(res =>{
        return res.status;
    }).catch(error => {
        console.log("some error");
        return error;
    })
export const doLogin = (payload) =>
    fetch(`${api}/login`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res.json();
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const logout = () =>
    fetch(`${api}/logout`, {
        method: 'POST',
        headers: {
            ...headers
        },
        credentials:'include'
    }).then(res => {
        window.sessionStorage.removeItem('key');
        window.sessionStorage.removeItem('email');
        window.sessionStorage.removeItem('phone');
        return res.status;
        //  res.data;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getFiles = () =>
    fetch(`${api}/files/list`,{
        method: 'POST',
        credentials:'include',

    }).then(res => res.json())
      .catch(error =>{
        console.log(error);
        return error;
    })
export const uploadFile = (payload) =>
    fetch(`${api}/files/upload`, {
        method: 'POST',
        credentials:'include',
        body: payload
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });