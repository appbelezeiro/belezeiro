#!/usr/bin/env python3
"""
Script para unificar todos os JSONs de serviços em um único arquivo TypeScript.
"""

import json
import os
from pathlib import Path

# Diretório dos JSONs
SERVICES_JSON_DIR = Path(__file__).parent / "services-json"
OUTPUT_FILE = Path(__file__).parent / "service-seeds.ts"

def load_all_services():
    """Carrega todos os serviços de todos os arquivos JSON."""
    all_services = []

    for json_file in sorted(SERVICES_JSON_DIR.glob("*.json")):
        print(f"Carregando: {json_file.name}")
        with open(json_file, 'r', encoding='utf-8') as f:
            services = json.load(f)
            all_services.extend(services)

    return all_services

def generate_typescript(services):
    """Gera o conteúdo do arquivo TypeScript."""

    # Header do arquivo
    ts_content = '''export interface ServiceSeed {
  id: string;
  specialty_id: string;
  code: string;
  name: string;
  description: string | undefined;
  default_duration_minutes: number;
  default_price_cents: number;
  is_predefined: boolean;
  is_active: boolean;
}

const PREFIX = "serv";

export const SERVICE_SEEDS: ServiceSeed[] = [
'''

    # Adiciona cada serviço
    for i, service in enumerate(services):
        # Extrai o ULID do id (remove o prefixo serv_)
        ulid = service['id'].replace('serv_', '')

        # Extrai o ULID do specialty_id (remove o prefixo spec_)
        specialty_ulid = service['specialty_id'].replace('spec_', '')

        # Escapa aspas na descrição se houver
        description = service.get('description')
        if description:
            description = description.replace("'", "\\'")
            desc_str = f"'{description}'"
        else:
            desc_str = "undefined"

        ts_content += f'''  {{
    id: `${{PREFIX}}_{ulid}`,
    specialty_id: `spec_{specialty_ulid}`,
    code: '{service['code']}',
    name: '{service['name'].replace("'", "\\'")}',
    description: {desc_str},
    default_duration_minutes: {service['default_duration_minutes']},
    default_price_cents: {service['default_price_cents']},
    is_predefined: {str(service['is_predefined']).lower()},
    is_active: {str(service['is_active']).lower()},
  }}'''

        # Adiciona vírgula se não for o último
        if i < len(services) - 1:
            ts_content += ','
        ts_content += '\n'

    ts_content += '];\n'

    return ts_content

def main():
    print("=" * 50)
    print("Unificando serviços JSON em TypeScript")
    print("=" * 50)

    # Carrega todos os serviços
    services = load_all_services()
    print(f"\nTotal de serviços carregados: {len(services)}")

    # Gera o TypeScript
    ts_content = generate_typescript(services)

    # Salva o arquivo
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"\nArquivo gerado: {OUTPUT_FILE}")
    print(f"Total de serviços: {len(services)}")
    print("=" * 50)
    print("Concluído!")

if __name__ == "__main__":
    main()
