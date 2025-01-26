import HttpResponse from "../httpResponse/HttpResponse";

class ApiServer {
  api<U, T>(path: string, method: string, body: U, token?: string): Promise<HttpResponse<T>> {
    const url = `http://${window.location.hostname}:8080/stock-manager/api${path}`;

    const isFormData = body instanceof FormData;
    const headers: HeadersInit = {
      ...(isFormData ? {} : { "Content-Type": "application/json;charset=utf-8" }),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      body: isFormData ? body : (body == null ? null : JSON.stringify(body)),
    };

    return fetch(url, options);
  }
}

export default ApiServer;
