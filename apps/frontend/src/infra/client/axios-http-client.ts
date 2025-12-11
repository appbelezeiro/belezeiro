// ============================================================================
// AXIOS HTTP CLIENT - Implementação usando Axios
// ============================================================================

import axios from 'axios';
import type {
  IHttpClient,
  HttpRequestConfig,
  HttpResponse,
  HttpError,
} from '../contracts/i-http-client';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * Cliente HTTP baseado em Axios
 * Wrapper que adapta o Axios para nossa interface IHttpClient
 */
export class AxiosHttpClient implements IHttpClient {
  private axiosInstance: AxiosInstance;
  private requestInterceptorIds: Map<number, number> = new Map();
  private responseInterceptorIds: Map<number, number> = new Map();
  private interceptorIdCounter = 0;

  constructor(axiosInstance?: AxiosInstance) {
    if (axiosInstance) {
      this.axiosInstance = axiosInstance;
    } else {
      this.axiosInstance = axios.create();
    }
  }

  // ========================================================================
  // Métodos HTTP
  // ========================================================================

  async get<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, this.adaptConfig(config));
    return this.adaptResponse(response);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, data, this.adaptConfig(config));
    return this.adaptResponse(response);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, data, this.adaptConfig(config));
    return this.adaptResponse(response);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.patch<T>(url, data, this.adaptConfig(config));
    return this.adaptResponse(response);
  }

  async delete<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, this.adaptConfig(config));
    return this.adaptResponse(response);
  }

  // ========================================================================
  // Configuração
  // ========================================================================

  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  setDefaultHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  // ========================================================================
  // Interceptors
  // ========================================================================

  addRequestInterceptor(
    onFulfilled: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>,
    onRejected?: (error: any) => any
  ): number {
    const id = this.interceptorIdCounter++;

    const axiosInterceptorId = this.axiosInstance.interceptors.request.use(
      async (axiosConfig: InternalAxiosRequestConfig) => {
        // Adaptar AxiosRequestConfig para HttpRequestConfig
        const httpConfig: HttpRequestConfig = {
          headers: axiosConfig.headers as Record<string, string>,
          params: axiosConfig.params,
          timeout: axiosConfig.timeout,
          signal: axiosConfig.signal,
          withCredentials: axiosConfig.withCredentials,
        };

        // Executar interceptor
        const modifiedConfig = await onFulfilled(httpConfig);

        // Aplicar mudanças de volta ao axiosConfig
        if (modifiedConfig.headers) {
          Object.entries(modifiedConfig.headers).forEach(([key, value]) => {
            axiosConfig.headers.set(key, value);
          });
        }
        if (modifiedConfig.params) axiosConfig.params = modifiedConfig.params;
        if (modifiedConfig.timeout !== undefined) axiosConfig.timeout = modifiedConfig.timeout;
        if (modifiedConfig.signal) axiosConfig.signal = modifiedConfig.signal;
        if (modifiedConfig.withCredentials !== undefined)
          axiosConfig.withCredentials = modifiedConfig.withCredentials;

        return axiosConfig;
      },
      onRejected
    );

    this.requestInterceptorIds.set(id, axiosInterceptorId);
    return id;
  }

  addResponseInterceptor(
    onFulfilled: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>,
    onRejected?: (error: HttpError) => any
  ): number {
    const id = this.interceptorIdCounter++;

    const axiosInterceptorId = this.axiosInstance.interceptors.response.use(
      async (axiosResponse: AxiosResponse) => {
        // Adaptar AxiosResponse para HttpResponse
        const httpResponse = this.adaptResponse(axiosResponse);

        // Executar interceptor
        const modifiedResponse = await onFulfilled(httpResponse);

        // Converter de volta para AxiosResponse
        axiosResponse.data = modifiedResponse.data;
        axiosResponse.status = modifiedResponse.status;
        axiosResponse.statusText = modifiedResponse.statusText;
        Object.entries(modifiedResponse.headers).forEach(([key, value]) => {
          axiosResponse.headers[key] = value;
        });

        return axiosResponse;
      },
      async (axiosError: AxiosError) => {
        // Adaptar AxiosError para HttpError
        const httpError = this.adaptError(axiosError);

        // Executar interceptor de erro se existir
        if (onRejected) {
          return onRejected(httpError);
        }

        throw httpError;
      }
    );

    this.responseInterceptorIds.set(id, axiosInterceptorId);
    return id;
  }

  removeInterceptor(id: number, type: 'request' | 'response'): void {
    if (type === 'request') {
      const axiosId = this.requestInterceptorIds.get(id);
      if (axiosId !== undefined) {
        this.axiosInstance.interceptors.request.eject(axiosId);
        this.requestInterceptorIds.delete(id);
      }
    } else {
      const axiosId = this.responseInterceptorIds.get(id);
      if (axiosId !== undefined) {
        this.axiosInstance.interceptors.response.eject(axiosId);
        this.responseInterceptorIds.delete(id);
      }
    }
  }

  // ========================================================================
  // Métodos de adaptação
  // ========================================================================

  private adaptConfig(config?: HttpRequestConfig): AxiosRequestConfig {
    if (!config) return {};

    return {
      headers: config.headers,
      params: config.params,
      timeout: config.timeout,
      signal: config.signal,
      withCredentials: config.withCredentials,
    };
  }

  private adaptResponse<T>(axiosResponse: AxiosResponse<T>): HttpResponse<T> {
    // Converter headers do Axios para objeto simples
    const headers: Record<string, string> = {};
    if (axiosResponse.headers) {
      Object.entries(axiosResponse.headers).forEach(([key, value]) => {
        headers[key] = String(value);
      });
    }

    return {
      data: axiosResponse.data,
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      headers,
    };
  }

  private adaptError(axiosError: AxiosError): HttpError {
    const error = new Error(axiosError.message) as HttpError;

    error.status = axiosError.response?.status;
    error.statusText = axiosError.response?.statusText;

    if (axiosError.response) {
      error.response = this.adaptResponse(axiosError.response);
    }

    error.isNetworkError = axiosError.code === 'ERR_NETWORK';
    error.isTimeoutError = axiosError.code === 'ECONNABORTED';

    return error;
  }

  // ========================================================================
  // Acesso à instância Axios (caso necessário)
  // ========================================================================

  /**
   * Retorna a instância Axios subjacente
   * Use com cuidado - quebra a abstração
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
