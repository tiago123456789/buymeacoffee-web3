import axios, { AxiosResponse } from "axios"

axios.defaults.baseURL = "http://localhost:3000/"
axios.defaults.withCredentials = true

export interface HttpClientInterface {

    get(url: string, headers: { [key: string]: any }): Promise<any>;
    post(url: string, data: { [key: string]: any }, headers: { [key: string]: any }): Promise<any>;
    postForm(url: string, data: { [key: string]: any }, headers: { [key: string]: any }): Promise<any>;
    putForm(url: string, data: { [key: string]: any }, headers: { [key: string]: any }): Promise<any>;
    put(url: string, data: { [key: string]: any }, headers: { [key: string]: any }): Promise<any>;
    delete(url: string, headers: { [key: string]: any }): Promise<any>;
}


class HttpClient implements HttpClientInterface {

    private extractResponseData(response: AxiosResponse) {
        return response.data;
    }

    postForm(url: string, data: { [key: string]: any; }, headers: { [key: string]: any; }): Promise<any> {
        return axios.postForm(url, data, headers).then(this.extractResponseData)
    }

    putForm(url: string, data: { [key: string]: any; }, headers: { [key: string]: any; }): Promise<any> {
        return axios.putForm(url, data, headers).then(this.extractResponseData)
    }

    get(url: string, headers: { [key: string]: any; }): Promise<any> {
        return axios.get(url, headers).then(this.extractResponseData)
    }

    post(url: string, data: { [key: string]: any; }, headers: { [key: string]: any; }): Promise<any> {
        return axios.post(url, data, headers).then(this.extractResponseData)
    }

    put(url: string, data: { [key: string]: any; }, headers: { [key: string]: any; }): Promise<any> {
        throw new Error("Method not implemented.");
    }

    delete(url: string, headers: { [key: string]: any; }): Promise<any> {
        throw new Error("Method not implemented.");
    }


}

export default HttpClient