import axios from "axios"

axios.defaults.baseURL = "http://localhost:3000/"
axios.defaults.withCredentials = true

export interface HttpClientInterface {

    get(url: string, headers: { [key:string]: any }): Promise<any>;
    post(url: string, data: { [key:string]: any }, headers: { [key:string]: any }): Promise<any>;
    put(url: string, data: { [key:string]: any }, headers: { [key:string]: any }): Promise<any>;
    delete(url: string, headers: { [key:string]: any }): Promise<any>;
}


class HttpClient implements HttpClientInterface {

    get(url: string, headers: { [key: string]: any; }): Promise<any> {
        return axios.get(url, headers).then(({ data }) => data)
    }

    post(url: string, data: { [key: string]: any; }, headers: { [key: string]: any; }): Promise<any> {
        return axios.post(url, data, headers).then(({ data }) => data)
    }

    put(url: string, data: { [key: string]: any; }, headers: { [key: string]: any; }): Promise<any> {
        throw new Error("Method not implemented.");
    }

    delete(url: string, headers: { [key: string]: any; }): Promise<any> {
        throw new Error("Method not implemented.");
    }

    
}

export default HttpClient