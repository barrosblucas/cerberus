import pandas as pd
import json
import os
import numpy as np

def clean_val(val):
    if pd.isna(val):
        return None
    if isinstance(val, (np.integer, np.floating)):
        return float(val) if isinstance(val, np.floating) else int(val)
    return str(val).strip()

def extract_prices(df, start_col, ufs):
    prices = {}
    for i, uf in enumerate(ufs):
        prices[uf] = clean_val(df.iloc[start_col + i])
    return prices

def extract_costs(df, start_col, ufs):
    costs = {}
    for i, uf in enumerate(ufs):
        costs[uf] = clean_val(df.iloc[start_col + 2*i])
    return costs

xlsx_path = r'c:\Users\Lucas\Documents\Tecnologia_Informacao\Dev\SINAPI\SINAPI-2025-12-formato-xlsx\SINAPI_Referência_2025_12.xlsx'
output_json = r'c:\Users\Lucas\Documents\Tecnologia_Informacao\Dev\SINAPI\sinapi_2025_12.json'
referencia = "2025-12"

ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']

data = {
    "referencia": referencia,
    "insumos": {},
    "composicoes": {}
}

# 1. ANALÍTICO (Structure)
print("Processing Analítico (Structure)...")
df_analitico = pd.read_excel(xlsx_path, sheet_name='Analítico', header=9)
desc_to_code = {}
current_comp_code = None

for _, row in df_analitico.iterrows():
    try:
        code_val = row.iloc[1]
        tipo_item = row.iloc[2]
        desc = clean_val(row.iloc[4])
        if not desc: continue
        
        if not pd.isna(code_val):
            comp_code = str(int(code_val))
            if pd.isna(tipo_item):  # Header
                current_comp_code = comp_code
                data["composicoes"][comp_code] = {
                    "codigo": comp_code,
                    "descricao": desc,
                    "unidade": clean_val(row.iloc[5]),
                    "grupo": clean_val(row.iloc[0]),
                    "scenarios": {
                        "nao_desonerado": {},
                        "desonerado": {},
                        "sem_encargos": {}
                    },
                    "itens": []
                }
                desc_to_code[desc] = comp_code
            else: # Item
                if current_comp_code:
                    item_type = clean_val(tipo_item)
                    item_code_val = row.iloc[3]
                    item_code = str(int(item_code_val)) if not pd.isna(item_code_val) else None
                    data["composicoes"][current_comp_code]["itens"].append({
                        "tipo": item_type,
                        "codigo": item_code,
                        "descricao": desc,
                        "unidade": clean_val(row.iloc[5]),
                        "coeficiente": clean_val(row.iloc[6])
                    })
    except: continue

# 2. INSUMOS (Prices)
scenarios_insumos = {
    "nao_desonerado": "ISD",
    "desonerado": "ICD",
    "sem_encargos": "ISE"
}

for scenario, sheet in scenarios_insumos.items():
    print(f"Processing Insumos scenario: {scenario} ({sheet})...")
    df = pd.read_excel(xlsx_path, sheet_name=sheet, header=9)
    for _, row in df.iterrows():
        try:
            code_val = row.iloc[1]
            if pd.isna(code_val): continue
            code = str(int(code_val))
            
            if code not in data["insumos"]:
                data["insumos"][code] = {
                    "codigo": code,
                    "descricao": clean_val(row.iloc[2]),
                    "unidade": clean_val(row.iloc[3]),
                    "classificacao": clean_val(row.iloc[0]),
                    "scenarios": {
                        "nao_desonerado": {},
                        "desonerado": {},
                        "sem_encargos": {}
                    }
                }
            data["insumos"][code]["scenarios"][scenario] = extract_prices(row, 5, ufs)
        except: continue

# 3. COMPOSIÇÕES (Costs)
scenarios_composicoes = {
    "nao_desonerado": "CSD",
    "desonerado": "CCD",
    "sem_encargos": "CSE"
}

for scenario, sheet in scenarios_composicoes.items():
    print(f"Processing Composições scenario: {scenario} ({sheet})...")
    df = pd.read_excel(xlsx_path, sheet_name=sheet, header=9)
    for _, row in df.iterrows():
        try:
            desc = clean_val(row.iloc[2])
            if not desc or desc not in desc_to_code: continue
            
            comp_code = desc_to_code[desc]
            data["composicoes"][comp_code]["scenarios"][scenario] = extract_costs(row, 4, ufs)
        except: continue

print(f"Saving to {output_json}...")
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done!")
