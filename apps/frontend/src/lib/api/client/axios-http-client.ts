// ============================================================================
// AXIOS HTTP CLIENT - Implementação usando Axios
// ============================================================================

import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import type {
  IHttpClient,
  HttpRequestConfig,
  HttpResponse,
  HttpError,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  InterceptorType,
} from '../contracts/http-client.types';

/**
 * Opções de configuração do cliente Axios
 */
export interface AxiosHttpClientOptions {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
}

/**
 * Cliente HTTP baseado em Axios
 * Wrapper que adapta o Axios para nossa interface IHttpClient
 */
export class AxiosHttpClient implements IHttpClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly requestInterceptorIds: Map<number, number> = new Map();
  private readonly responseInterceptorIds: Map<number, number> = new Map();
  private interceptorIdCounter = 0;

  constructor(options: AxiosHttpClientOptions = {}) {
    this.axiosInstance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout ?? 30000,
      withCredentials: options.withCredentials ?? true,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  // ========================================================================
  // Métodos HTTP
  // ========================================================================

  async get<T = unknown>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, this.adaptConfig(config));
    return this.adaptResponse(response);
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.post<T>(
      url,
      data,
      this.adaptConfig(config)
    );
    return this.adaptResponse(response);
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.put<T>(
      url,
      data,
      this.adaptConfig(config)
    );
    return this.adaptResponse(response);
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.patch<T>(
      url,
      data,
      this.adaptConfig(config)
    );
    return this.adaptResponse(response);
  }

  async delete<T = unknown>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
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
    onFulfilled: RequestInterceptor,
    onRejected?: ErrorInterceptor
  ): number {
    const id = this.interceptorIdCounter++;

    const axiosInterceptorId = this.axiosInstance.interceptors.request.use(
      async (axiosConfig: InternalAxiosRequestConfig) => {
        const httpConfig: HttpRequestConfig = {
          headers: axiosConfig.headers as unknown as Record<string, string>,
          params: axiosConfig.params as Record<string, unknown>,
          timeout: axiosConfig.timeout,
          signal: axiosConfig.signal as AbortSignal | undefined,
          withCredentials: axiosConfig.withCredentials,
        };

        const modifiedConfig = await onFulfilled(httpConfig);

        if (modifiedConfig.headers) {
          Object.entries(modifiedConfig.headers).forEach(([key, value]) => {
            axiosConfig.headers.set(key, value);
          });
        }
        if (modifiedConfig.params) {
          axiosConfig.params = modifiedConfig.params;
        }
        if (modifiedConfig.timeout !== undefined) {
          axiosConfig.timeout = modifiedConfig.timeout;
        }
        if (modifiedConfig.signal) {
          axiosConfig.signal = modifiedConfig.signal;
        }
        if (modifiedConfig.withCredentials !== undefined) {
          axiosConfig.withCredentials = modifiedConfig.withCredentials;
        }

        return axiosConfig;
      },
      onRejected
        ? (error: unknown) => onRejected(this.adaptError(error as AxiosError))
        : undefined
    );

    this.requestInterceptorIds.set(id, axiosInterceptorId);
    return id;
  }

  addResponseInterceptor(
    onFulfilled: ResponseInterceptor,
    onRejected?: ErrorInterceptor
  ): number {
    const id = this.interceptorIdCounter++;

    const axiosInterceptorId = this.axiosInstance.interceptors.response.use(
      async (axiosResponse: AxiosResponse) => {
        const httpResponse = this.adaptResponse(axiosResponse);
        const modifiedResponse = await onFulfilled(httpResponse);

        axiosResponse.data = modifiedResponse.data;
        axiosResponse.status = modifiedResponse.status;
        axiosResponse.statusText = modifiedResponse.statusText;

        return axiosResponse;
      },
      onRejected
        ? (error: unknown) => onRejected(this.adaptError(error as AxiosError))
        : undefined
    );

    this.responseInterceptorIds.set(id, axiosInterceptorId);
    return id;
  }

  removeInterceptor(id: number, type: InterceptorType): void {
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

  /**
   * Retorna a instância Axios subjacente
   * Use com cuidado - quebra a abstração
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
