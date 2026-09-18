import { getApiClient, type ApiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import {
  registerInputSchema,
  registerResponseSchema,
  loginInputSchema,
  loginResponseSchema,
  meResponseSchema,
} from "@/features/auth/contracts";
import { z } from "zod";
export function login(
  input: z.output<typeof loginInputSchema>,
  client: ApiClient = getApiClient(),
) {
  return client.request(
    { endpoint: endpoints.login(), body: loginInputSchema.parse(input) },
    loginResponseSchema,
    (dto) => dto.data,
  );
}
export function register(
  input: z.output<typeof registerInputSchema>,
  client: ApiClient = getApiClient(),
) {
  return client.request(
    { endpoint: endpoints.register(), body: registerInputSchema.parse(input) },
    registerResponseSchema,
    (dto) => dto.data,
  );
}
export function getIdentity(client: ApiClient = getApiClient()) {
  return client.request(
    { endpoint: endpoints.identity() },
    meResponseSchema,
    (dto) => dto.data,
  );
}
