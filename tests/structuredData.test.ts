import { describe, it, expect } from "vitest";
import {
  articleSchema,
  itemListSchema,
  jsonLdScript,
  personSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/structuredData";
import { PROJECTS } from "@/config/projects";
import { SITE } from "@/config/site";
import { createBlogPost } from "@/domain/blog/post";

describe("structured data", () => {
  it("builds a person node identified on the site", () => {
    const person = personSchema();
    expect(person["@type"]).toBe("Person");
    expect(person["@id"]).toBe(SITE.url + "/#person");
    expect(person.name).toBe(SITE.ownerName);
  });

  it("links the website publisher to the person node", () => {
    expect(websiteSchema().publisher).toEqual({ "@id": personSchema()["@id"] });
  });

  it("maps every project to a SoftwareApplication with an absolute image", () => {
    for (const project of PROJECTS) {
      const schema = softwareApplicationSchema(project);
      expect(schema["@type"]).toBe("SoftwareApplication");
      expect(schema.url).toBe(project.href);
      expect(schema.image).toBe(SITE.url + project.imageSrc);
      expect(schema.operatingSystem).toBe(project.operatingSystem);
      expect(schema.applicationCategory).toBe(project.applicationCategory);
    }
  });

  it("numbers ItemList positions from one", () => {
    const list = itemListSchema(PROJECTS);
    expect(list.itemListElement).toHaveLength(PROJECTS.length);
    expect(list.itemListElement[0]?.position).toBe(1);
    expect(list.itemListElement[PROJECTS.length - 1]?.position).toBe(
      PROJECTS.length,
    );
  });

  it("builds an article node pointing at its own URL", () => {
    const post = createBlogPost({
      title: "構造化データのテスト",
      body: "本文",
      date: "2026-10-03",
    });
    const schema = articleSchema(post, `/blog/${post.id}`);
    expect(schema["@type"]).toBe("Article");
    expect(schema.mainEntityOfPage).toBe(SITE.url + `/blog/${post.id}`);
    expect(schema.dateModified).toBe(post.updatedAt);
  });

  it("escapes closing tags in the JSON-LD script", () => {
    expect(
      jsonLdScript([{ name: "</script><script>alert(1)</script>" }]),
    ).not.toContain("</script>");
  });
});
