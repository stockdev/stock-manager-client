import HttpResponse from "../httpResponse/HttpResponse";

class ApiServer {
  api<U, T>(
    path: string,
    method: string,
    body: U,
    token?: string
  ): Promise<HttpResponse<T>> {
    const protocol = window.location.protocol;
    const isLocalhost = window.location.hostname === "localhost";
    const port = isLocalhost ? ":8080" : "";
    const url = `${protocol}//${window.location.hostname}${port}/stock-manager/api${path}`;

    const isFormData = body instanceof FormData;
    const headers: HeadersInit = {
      ...(isFormData
        ? {}
        : { "Content-Type": "application/json;charset=utf-8" }),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      body: isFormData ? body : body == null ? null : JSON.stringify(body),
    };

    return fetch(url, options);
  }
}

export default ApiServer;
