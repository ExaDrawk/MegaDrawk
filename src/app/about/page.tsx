import type { Metadata } from "next";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.ownerName}について。大学生、ジオラマ制作、テクノロジーへの関心。`,
};

export default function AboutPage() {
  return (
    <div className="animate-enter-up">
      <section className="pt-8 pb-16 sm:pt-16 sm:pb-24">
        <h1 className="section-heading">About</h1>
        <div
          className="mt-8 flex flex-col gap-8"
          style={{ maxWidth: "var(--content-width)" }}
        >
          {/* ── 基本プロフィール ── */}
          <div>
            <h2
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--color-text)" }}
            >
              プロフィール
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Drawkは日本の大学生です。
              手のひらサイズのミニチュア世界——ジオラマの制作を趣味としています。
            </p>
          </div>

          {/* ── 最近の活動 ── */}
          <div>
            <h2
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--color-text)" }}
            >
              最近の活動
            </h2>
            <ul
              className="text-base leading-relaxed flex flex-col gap-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <li>• Unityを初めて使用（2026年3月〜）</li>
              <li>• KiloCodeでKimi K2.5を無料で使用</li>
              <li>• Gemini 3.1 Pro / FlashでPNG→SVG変換の実験</li>
              <li>• quiver arrow 1.0のSVG性能テスト</li>
            </ul>
          </div>

          {/* ── 病歴（X Bioの一文のみ） ── */}
          <div>
            <h2
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--color-text)" }}
            >
              病歴
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              2025年9月に持病の高安動脈炎による胸部大動脈瘤、severe
              ARのためBentall手術（ベントール手術）を受け、機械弁を挿入。身体障害1級。リンヴォック15mg、プレドニン8mgを服用中。
            </p>
          </div>

          {/* ── 目標 ── */}
          <div>
            <h2
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--color-text)" }}
            >
              目標
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              AGIまで生きるのが第一目標。同じ高安動脈炎の人と仲良くしたい。
            </p>
          </div>

          {/* ── メッセージ ── */}
          <div
            className="p-5 rounded-lg"
            style={{
              background: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              同じ高安動脈炎で闘病中の方がいらっしゃいましたら、
              お気軽にXで声をかけてください。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
