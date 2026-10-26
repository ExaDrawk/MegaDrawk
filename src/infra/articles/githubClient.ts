export const REPO = "ExaDrawk/MegaDrawk";
export const ARTICLE_DIR = "src/content/blog";
export const GITHUB_API = "https://api.github.com";

export function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    // Workersのfetchは既定のUser-Agentを付けないため必須（無いとGitHubが403で拒否する）
    "User-Agent": "megadrawk-admin",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}
