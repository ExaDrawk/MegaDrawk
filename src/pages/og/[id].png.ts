import type { APIRoute, GetStaticPaths } from "astro";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import satori from "satori";
import { getPublishedBlogPosts } from "@/config/blog";
import { SITE } from "@/config/site";
import { formatJaDate } from "@/lib/date";

// 記事ごとのOG画像（1200x630）をビルド時に生成する静的エンドポイント。
// フォントとアイコンはscripts/assets・publicから読み込む（OTFはブラウザへ配信しない）。

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_TITLE_LENGTH = 40;

type SatoriOptions = NonNullable<Parameters<typeof satori>[1]>;
type FontData = SatoriOptions["fonts"][number];
let fontCache: FontData[] | null = null;

async function loadFonts(): Promise<FontData[]> {
  fontCache ??= [
    {
      name: "NotoSansJP",
      data: await readFile(
        path.resolve("scripts/assets/fonts/NotoSansJP-Regular.otf"),
      ),
      weight: 400,
      style: "normal",
    },
  ];
  return fontCache;
}

let iconCache: string | null = null;
async function loadIconDataUri(): Promise<string> {
  iconCache ??=
    "data:image/png;base64," +
    (await readFile(path.resolve("public/apple-touch-icon.png"))).toString(
      "base64",
    );
  return iconCache;
}

function clampTitle(title: string): string {
  return title.length > MAX_TITLE_LENGTH
    ? title.slice(0, MAX_TITLE_LENGTH - 1) + "…"
    : title;
}

export const getStaticPaths = (async () => {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as {
    post: { id: string; title: string; date: string };
  };
  const [fonts, icon] = await Promise.all([loadFonts(), loadIconDataUri()]);
  // satoriはReactNode型を受け取るため、プレーンオブジェクト木はその型へ投射する
  const element = {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 96px",
        background: "#fcfcfd",
        color: "#3a4150",
        fontFamily: "NotoSansJP",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "24px",
            },
            children: [
              {
                type: "img",
                props: {
                  src: icon,
                  width: 88,
                  height: 88,
                  borderRadius: "20px",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "30px",
                    color: "#2b50c7",
                    letterSpacing: "0.04em",
                  },
                  children: SITE.name,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              flex: "1",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "46px",
                    lineHeight: "1.45",
                    color: "#242a35",
                  },
                  children: clampTitle(post.title),
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid #d5d9e0",
              paddingTop: "32px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: "28px", color: "#6b7280" },
                  children: formatJaDate(post.date),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "24px",
                    color: "#6b7280",
                    letterSpacing: "0.06em",
                  },
                  children: SITE.domain,
                },
              },
            ],
          },
        },
      ],
    },
  } as unknown as Parameters<typeof satori>[0];
  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
