import axios from 'axios';
const token = '';
const baseUrl = import.meta.env.VITE_API_URL;
const getAccessToken = () => { return localStorage.getItem("accesstoken") };

const axiosApi = axios.create({
    baseURL: baseUrl,
});

axiosApi.defaults.headers.common['Authorization'] = token;

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
);

export async function uploadPost(data) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const uploadUrl = `${baseUrl}/v1/upload-file`;
      const result = await fetch(uploadUrl, requestOptions);
      const response = await result.json();
      return response.data;
    } catch (err) {
      console.log("err errerr ", err.message);
    }
  }
  
export async function apiGET(url, config = {}) {
    let accessToken = getAccessToken();
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return await axiosApi
        .get(url, { ...config })
        .then((response) => response)
        .catch((error) => error.response);
}
export async function apiPOST(url, data, config = {}) {
    let accessToken = getAccessToken();
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return axiosApi
        .post(url, { ...data }, { ...config })
        .then((response) => response)
        .catch((error) => error.response);
}

export async function apiPUT(url, data, config = {}) {
    let accessToken = getAccessToken();
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return axiosApi
        .put(url, { ...data }, { ...config })
        .then((response) => response)
        .catch((error) => error.response);
}

export async function apiDELETE(url, config = {}) {
    let accessToken = getAccessToken();
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return await axiosApi
        .delete(url, { ...config })
        .then((response) => response)
        .catch((error) => error.response);
}
export const objectToQueryParam = (obj) => {
    if (typeof obj !== 'object') return ""

    let objKeys = Object.keys(obj)
    console.log("hello1", objKeys)
    if (Object.keys(obj).length) {

        const queryParams = new URLSearchParams()
        objKeys.map(key => {
            if (obj[key]) {
                queryParams.append(key, JSON.stringify(obj[key]))
            }

        })
        return decodeURIComponent(queryParams.toString())
    }

    return ""

}

