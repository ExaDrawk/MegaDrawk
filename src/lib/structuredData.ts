import { SITE } from "@/config/site";
import type { ProjectItem } from "@/config/projects";
import type { BlogPost } from "@/domain/blog/post";

const PERSON_ID = SITE.url + "/#person";

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.ownerName,
    url: SITE.url,
    description: SITE.description,
    sameAs: [SITE.social.x],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE.url + "/#website",
    name: SITE.name,
    url: SITE.url,
    inLanguage: SITE.language,
    description: SITE.description,
    publisher: { "@id": PERSON_ID },
  };
}

export function softwareApplicationSchema(project: ProjectItem) {
  return {
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    url: project.href,
    image: SITE.url + project.imageSrc,
    operatingSystem: project.operatingSystem,
    applicationCategory: project.applicationCategory,
    author: { "@id": PERSON_ID },
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
}

export function itemListSchema(projects: readonly ProjectItem[]) {
  return {
    "@type": "ItemList",
    name: SITE.name + "の個人開発",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: softwareApplicationSchema(project),
    })),
  };
}

export function articleSchema(post: BlogPost, pathname: string) {
  return {
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt,
    inLanguage: SITE.language,
    mainEntityOfPage: SITE.url + pathname,
    author: { "@id": PERSON_ID },
  };
}

/**
 * JSON-LDスクリプト文字列を生成する。
 * 出力にHTML終端の <script> が現れないよう、JSON文字列中の < を \u003c に置換する
 * （JSON.parseで元の文字へ復元される）。
 */
export function jsonLdScript(graph: readonly object[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");
}
