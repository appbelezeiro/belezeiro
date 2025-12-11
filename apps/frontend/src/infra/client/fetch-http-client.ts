// ============================================================================
// FETCH HTTP CLIENT - Implementação usando Fetch API nativa
// ============================================================================

import type {
  IHttpClient,
  HttpRequestConfig,
  HttpResponse,
  HttpError,
} from '../contracts/i-http-client';

/**
 * Interceptor de requisição
 */
type RequestInterceptor = {
  id: number;
  onFulfilled: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>;
  onRejected?: (error: any) => any;
};

/**
 * Interceptor de resposta
 */
type ResponseInterceptor = {
  id: number;
  onFulfilled: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>;
  onRejected?: (error: HttpError) => any;
};

/**
 * Cliente HTTP baseado em Fetch API
 * Não tem dependências externas - usa apenas APIs nativas do browser
 */
export class FetchHttpClient implements IHttpClient {
  private baseURL: string = '';
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private interceptorIdCounter = 0;

  constructor(baseURL?: string) {
    if (baseURL) {
      this.baseURL = baseURL;
    }
  }

  // ========================================================================
  // Métodos HTTP
  // ========================================================================

  async get<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  async delete<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  // ========================================================================
  // Configuração
  // ========================================================================

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  // ========================================================================
  // Interceptors
  // ========================================================================

  addRequestInterceptor(
    onFulfilled: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>,
    onRejected?: (error: any) => any
  ): number {
    const id = this.interceptorIdCounter++;
    this.requestInterceptors.push({ id, onFulfilled, onRejected });
    return id;
  }

  addResponseInterceptor(
    onFulfilled: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>,
    onRejected?: (error: HttpError) => any
  ): number {
    const id = this.interceptorIdCounter++;
    this.responseInterceptors.push({ id, onFulfilled, onRejected });
    return id;
  }

  removeInterceptor(id: number, type: 'request' | 'response'): void {
    if (type === 'request') {
      this.requestInterceptors = this.requestInterceptors.filter((i) => i.id !== id);
    } else {
      this.responseInterceptors = this.responseInterceptors.filter((i) => i.id !== id);
    }
  }

  // ========================================================================
  // Métodos internos
  // ========================================================================

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      // Aplicar interceptors de requisição
      let requestConfig = config || {};
      for (const interceptor of this.requestInterceptors) {
        try {
          requestConfig = await interceptor.onFulfilled(requestConfig);
        } catch (error) {
          if (interceptor.onRejected) {
            await interceptor.onRejected(error);
          }
          throw error;
        }
      }

      // Construir URL completa
      const fullURL = this.buildURL(url, requestConfig.params);

      // Construir headers
      const headers = {
        ...this.defaultHeaders,
        ...requestConfig.headers,
      };

      // Configurar requisição
      const init: RequestInit = {
        method,
        headers,
        signal: requestConfig.signal,
        credentials: requestConfig.withCredentials ? 'include' : 'same-origin',
      };

      // Adicionar body se necessário
      if (data !== undefined && method !== 'GET' && method !== 'HEAD') {
        init.body = JSON.stringify(data);
      }

      // Fazer requisição
      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout | undefined;

      if (requestConfig.timeout) {
        timeoutId = setTimeout(() => controller.abort(), requestConfig.timeout);
      }

      const fetchSignal = requestConfig.signal || controller.signal;
      init.signal = fetchSignal;

      let response: Response;
      try {
        response = await fetch(fullURL, init);
      } catch (error) {
        if (timeoutId) clearTimeout(timeoutId);
        throw this.createError('Network error', error, true, false);
      }

      if (timeoutId) clearTimeout(timeoutId);

      // Processar resposta
      let responseData: T;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = (await response.text()) as any;
      }

      // Converter headers para objeto
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Criar resposta padronizada
      let httpResponse: HttpResponse<T> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      };

      // Verificar erro HTTP
      if (!response.ok) {
        throw this.createError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          null,
          false,
          false,
          response.status,
          response.statusText,
          httpResponse
        );
      }

      // Aplicar interceptors de resposta
      for (const interceptor of this.responseInterceptors) {
        try {
          httpResponse = await interceptor.onFulfilled(httpResponse);
        } catch (error) {
          if (interceptor.onRejected) {
            await interceptor.onRejected(error as HttpError);
          }
          throw error;
        }
      }

      return httpResponse;
    } catch (error) {
      // Aplicar interceptors de erro de resposta
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onRejected) {
          try {
            await interceptor.onRejected(error as HttpError);
          } catch (interceptorError) {
            throw interceptorError;
          }
        }
      }
      throw error;
    }
  }

  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    if (!params || Object.keys(params).length === 0) {
      return fullURL;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${fullURL}?${queryString}` : fullURL;
  }

  private createError(
    message: string,
    originalError: any,
    isNetworkError: boolean,
    isTimeoutError: boolean,
    status?: number,
    statusText?: string,
    response?: HttpResponse
  ): HttpError {
    const error = new Error(message) as HttpError;
    error.status = status;
    error.statusText = statusText;
    error.response = response;
    error.isNetworkError = isNetworkError;
    error.isTimeoutError = isTimeoutError;

    if (originalError) {
      error.cause = originalError;
    }

    return error;
  }
}
