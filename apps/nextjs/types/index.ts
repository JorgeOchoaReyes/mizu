import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "../../../packages/api/index";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getSpookTypeResult = RouterOutput["speak"]["getSpooks"]["data"];

export type { getSpookTypeResult };
