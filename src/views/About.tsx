import { SITE } from "@/config/site";
import { ProjectList } from "@/components/ui/ProjectList";
export const metadata = {
  title: "About",
  description: SITE.ownerName + "のプロフィールと個人開発。",
};
export default function AboutPage() {
  return (
    <section className="page-section" aria-labelledby="about-title">
      <header className="page-header">
        <h1 id="about-title" className="page-title">
          About
        </h1>
      </header>
      <div className="profile">
        <h2 className="section-label">プロフィール</h2>
        <p>日本の大学生 / 個人開発</p>
        <h2 className="section-label">目標</h2>
        <p>AGIまで生きるのが第一目標。</p>
      </div>
      <section className="about-projects" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="section-label">
          個人開発
        </h2>
        <ProjectList />
      </section>
    </section>
  );
}
