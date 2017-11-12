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
        console.log(JSON.stringify(payload))
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

export const getSharedFiles = () =>
    fetch(`${api}/files/sharedfilelist`,{
        method: 'POST',
        credentials:'include',

    }).then(res => {
        return res.json()
    })
        .catch(error =>{
            console.log(error);
            return error;
        })

export const getActivity = () =>
    fetch(`${api}/files/getactivity`,{
        method: 'POST',
        credentials:'include',

    }).then(res => {

        return res.json()
    })
        .catch(error =>{
            console.log(error);
            return error;
        })

export const groupMembers = (payload) =>
    fetch(`${api}/files/groupmembers`,{
        method: 'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res => {
        console.log(payload)
        return res.json()
    })
        .catch(error =>{
            console.log(error);
            return error;
        })

export const getStarred = () =>
    fetch(`${api}/files/starredfilelist`,{
        method: 'POST',
        credentials:'include',

    }).then(res => {
        return res.json()
    })
        .catch(error =>{
            console.log(error);
            return error;
        })

export const getGroups = () =>
    fetch(`${api}/files/grouplist`, {
        method:'POST',
        credentials:'include',
    }).then(res => {
        console.log("ress");
        return res.json()
    })
        .catch(error =>{
            console.log(error);
            return error;
        })

export const getFilesFromDir = (payload) =>
    fetch(`${api}/files/listfromdir`,{
        method: 'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)

    }).then(res => res.json())
        .catch(error =>{
            console.log(error);
            return error;
        })

export const uploadFile = (payload, objPath) =>
    fetch(`${api}/files/upload`, {
        method: 'POST',
        credentials:'include',
        body: payload,
        params:objPath.patharr
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const createDir = (payload) =>
    fetch(`${api}/files/createdir`, {
        method:'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res => res.status)


export const shareFile = (payload) =>
    fetch(`${api}/files/share`, {
        method:'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res => {
        console.log("status:141::", res.json())
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const createSharedGroup = (payload) =>
    fetch(`${api}/files/sharedDir`, {
        method:'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res => res.status)

export const createGroup = (payload) =>
    fetch(`${api}/files/createGroup`, {
        method:'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res => res.status)


export const downloadFile = (payload) =>
    fetch(`${api}/files/download`,{
        method:'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res =>{
        if(res.status === 200) {
            console.log(payload)
            console.log(res.status);
            return res.json();
        }
        return res;
    }).catch(error => {
        console.log("This is Error");
        return error;
    });

export const starFile = (payload) =>
    fetch(`${api}/files/starfile`, {
        method:'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res => res.status)

export const deleteFile = (payload) =>
    fetch(`${api}/files/delete`,{
        method:'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res =>{
        if(res.status === 200) {
        return res
        }
        return res.status;
    }).catch(error => {
            console.log("This is Error");
            return error;
        });

export const deleteDir = (payload) =>
    fetch(`${api}/files/deletedir`,{
        method:'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(payload)
    }).then(res =>{
        if(res.status === 200) {
            return res
        }
        return res.status;
    }).catch(error => {
        console.log("This is Error");
        return error;
    });