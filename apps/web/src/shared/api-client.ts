import { CreateUserInputSchema, CreateUserOutput, ListObrasOutputSchema, ListUsersOutput, ListUsersOutputSchema, LoginSchema } from "@repo/contracts";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function createUser(input: unknown): Promise<CreateUserOutput> {
  const parsed = CreateUserInputSchema.parse(input);
  const res = await fetch(`${baseUrl}/v1/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed),
  });
  const json = await res.json();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return CreateUserOutputSchema.parse(json);
}


export async function listUsers(): Promise<ListUsersOutput["users"]> {
  const res = await fetch(`${baseUrl}/v1/users`);
  const json = await res.json();
  const result = ListUsersOutputSchema.parse(json);
  return result.users;
}

export async function login(input: unknown) {
  const parsed = LoginSchema.parse(input);
  const res = await fetch(`${baseUrl}/v1/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const json = await res.json();
  // Validar resposta se tiver schema, por enquanto retorna user
  return json;
}

export async function getMe() {
  const res = await fetch(`${baseUrl}/v1/auth/profile`);
  if (!res.ok) {
    throw new Error("Not authenticated");
  }
  return res.json();
}

export async function listObras() {
  const res = await fetch(`${baseUrl}/v1/obras`);
  if (!res.ok) throw new Error("Failed to list obras");
  const json = await res.json();
  const result = ListObrasOutputSchema.parse(json);
  return result.obras;
}

export async function createObra(input: unknown) {
  // Parsing input here to ensure safety before sending, optional but good.
  // const parsed = CreateObraInputSchema.parse(input);
  const res = await fetch(`${baseUrl}/v1/obras`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create obra");
  return res.json();
}

export async function getObra(id: string) {
  const res = await fetch(`${baseUrl}/v1/obras/${id}`);
  if (!res.ok) throw new Error("Obra not found");
  const json = await res.json();
  return json.obra;
}


// --- Price Bank ---
export async function searchPriceBank(query: string) {
  const res = await fetch(`${baseUrl}/v1/banco-precos/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

// --- Budgets ---
export async function createOrcamento(input: unknown) {
  const res = await fetch(`${baseUrl}/v1/orcamentos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error("Failed to create budget");
  return res.json();
}

export async function getOrcamento(id: string) {
  const res = await fetch(`${baseUrl}/v1/orcamentos/${id}`);
  if (!res.ok) throw new Error("Budget not found");
  return res.json();
}

export async function saveOrcamentoItems(id: string, input: unknown) {
  const res = await fetch(`${baseUrl}/v1/orcamentos/${id}/items`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error("Failed to save budget");
  return res.json();
}
