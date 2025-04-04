import { FineClient } from "@fine-dev/fine-js";
import type { Schema } from "./db-types.ts";

export const fine = new FineClient<Schema>("https://platform.fine.dev/customer-mild-sledder-full-horizontal-tonic");