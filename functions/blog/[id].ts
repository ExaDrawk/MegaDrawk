/// <reference types="@cloudflare/workers-types" />
import bundle from "../../.astro/private-blog.json";
import {
  privateBlogResponse,
  type PrivateBlogBundle,
} from "../../src/infra/articles/preview";
import type { CommentsEnv } from "../../src/infra/comments/server";

export const onRequest: PagesFunction<CommentsEnv> = async (context) =>
  (await privateBlogResponse(
    context.request,
    context.env,
    bundle as PrivateBlogBundle,
  )) ?? context.next();
