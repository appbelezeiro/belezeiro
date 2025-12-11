// ============================================================================
// CEP SERVICE - Busca de endereço por CEP (ViaCEP)
// ============================================================================

import axios from 'axios';
import { z } from 'zod';

// ============================================================================
// Schemas
// ============================================================================

export const cepSchema = z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos');

export const addressResponseSchema = z.object({
  cep: z.string(),
  logradouro: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string(),
  ibge: z.string().optional(),
  gia: z.string().optional(),
  ddd: z.string().optional(),
  siafi: z.string().optional(),
});

export const addressErrorSchema = z.object({
  erro: z.literal(true),
});

// ============================================================================
// Types
// ============================================================================

export type AddressResponse = z.infer<typeof addressResponseSchema>;

export interface Address {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CepServiceError {
  code: 'INVALID_CEP' | 'NOT_FOUND' | 'NETWORK_ERROR';
  message: string;
}

// ============================================================================
// Service
// ============================================================================

const viaCepClient = axios.create({
  baseURL: 'https://viacep.com.br/ws',
  timeout: 10000,
});

/**
 * Remove formatação do CEP (pontos, traços)
 */
export function extractCepDigits(cep: string): string {
  return cep.replace(/\D/g, '');
}

/**
 * Formata CEP para exibição (XXXXX-XXX)
 */
export function formatCep(cep: string): string {
  const digits = extractCepDigits(cep);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

/**
 * Valida se o CEP tem formato válido
 */
export function isValidCepFormat(cep: string): boolean {
  const digits = extractCepDigits(cep);
  return digits.length === 8;
}

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 */
export async function fetchAddressByCep(cep: string): Promise<Address> {
  const digits = extractCepDigits(cep);

  // Valida formato
  const parseResult = cepSchema.safeParse(digits);
  if (!parseResult.success) {
    throw {
      code: 'INVALID_CEP',
      message: 'CEP inválido',
    } as CepServiceError;
  }

  try {
    const response = await viaCepClient.get(`/${digits}/json/`);

    // Verifica se retornou erro
    const errorParse = addressErrorSchema.safeParse(response.data);
    if (errorParse.success) {
      throw {
        code: 'NOT_FOUND',
        message: 'CEP não encontrado',
      } as CepServiceError;
    }

    // Valida resposta
    const addressParse = addressResponseSchema.safeParse(response.data);
    if (!addressParse.success) {
      throw {
        code: 'NETWORK_ERROR',
        message: 'Erro ao processar resposta',
      } as CepServiceError;
    }

    const data = addressParse.data;

    return {
      cep: formatCep(data.cep),
      street: data.logradouro,
      complement: data.complemento,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch (error) {
    // Se já é um CepServiceError, repassa
    if ((error as CepServiceError).code) {
      throw error;
    }

    throw {
      code: 'NETWORK_ERROR',
      message: 'Erro ao buscar CEP',
    } as CepServiceError;
  }
}

/**
 * Handler para onChange de input de CEP
 * Aplica máscara e limita caracteres
 */
export function handleCepChange(
  value: string,
  onChange: (value: string) => void
): void {
  const digits = extractCepDigits(value);
  const limitedDigits = digits.slice(0, 8);
  onChange(formatCep(limitedDigits));
}
