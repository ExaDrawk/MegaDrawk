export function SkipNav({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a href={`#${targetId}`} className="skip-nav">
      メインコンテンツへスキップ
    </a>
  );
}
