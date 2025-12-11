// ============================================================================
// PHONE UTILITIES - Formatação e validação de telefones brasileiros
// ============================================================================

/**
 * Remove todos os caracteres não numéricos de uma string
 */
export function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata um número de telefone brasileiro
 * Suporta:
 * - Celular: (XX) XXXXX-XXXX (11 dígitos)
 * - Fixo: (XX) XXXX-XXXX (10 dígitos)
 */
export function formatPhone(value: string): string {
  const digits = extractDigits(value);

  if (digits.length === 0) return '';

  // Aplica formatação progressiva
  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  // Celular: (XX) XXXXX-XXXX
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Valida se é um telefone brasileiro válido
 * Aceita 10 dígitos (fixo) ou 11 dígitos (celular)
 */
export function isValidPhone(value: string): boolean {
  const digits = extractDigits(value);
  return digits.length === 10 || digits.length === 11;
}

/**
 * Valida se é um celular brasileiro válido (11 dígitos, começando com 9)
 */
export function isValidMobile(value: string): boolean {
  const digits = extractDigits(value);
  return digits.length === 11 && digits[2] === '9';
}

/**
 * Valida se é um telefone fixo brasileiro válido (10 dígitos)
 */
export function isValidLandline(value: string): boolean {
  const digits = extractDigits(value);
  return digits.length === 10;
}

/**
 * Retorna o telefone sem formatação (apenas dígitos)
 */
export function unformatPhone(value: string): string {
  return extractDigits(value);
}

/**
 * Handler para onChange de input de telefone
 * Aplica máscara e limita caracteres
 */
export function handlePhoneChange(
  value: string,
  onChange: (value: string) => void
): void {
  const digits = extractDigits(value);
  // Limita a 11 dígitos (celular)
  const limitedDigits = digits.slice(0, 11);
  onChange(formatPhone(limitedDigits));
}

/**
 * Obtém o placeholder adequado para input de telefone
 */
export function getPhonePlaceholder(): string {
  return '(00) 00000-0000';
}

/**
 * Valida DDD brasileiro (11-99)
 */
export function isValidDDD(ddd: string): boolean {
  const num = parseInt(ddd, 10);
  return num >= 11 && num <= 99;
}
