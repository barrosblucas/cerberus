
import { useState } from "react";
import { usePriceBankSearch } from "./use-orcamentos";

interface ItemSearchProps {
    onSelect: (item: any) => void;
}

export function ItemSearch({ onSelect }: ItemSearchProps) {
    const [term, setTerm] = useState("");
    const { data: results, isLoading } = usePriceBankSearch(term);

    return (
        <div className="relative w-full">
            <div className="flex gap-2">
                <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Pesquisar composição ou insumo (ex: concreto, 94250)..."
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
                {isLoading && <span className="text-gray-400 self-center">...</span>}
            </div>

            {results && results.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto mt-1">
                    {results.map((item: any) => (
                        <li
                            key={item.id}
                            onClick={() => {
                                onSelect(item);
                                setTerm(""); // Reset after select
                            }}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-medium text-sm text-gray-900">{item.descricao}</div>
                                    <div className="text-xs text-gray-500">Cod: {item.codigo} | {item.origem}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm">R$ {item.preco.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500">/ {item.unidade}</div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {term.length > 2 && results?.length === 0 && !isLoading && (
                <div className="absolute z-10 w-full bg-white border rounded p-2 text-gray-500 text-sm mt-1">
                    Nenhum resultado encontrado.
                </div>
            )}
        </div>
    );
}
