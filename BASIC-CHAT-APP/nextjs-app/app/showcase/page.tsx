import Link from "next/link";
import styles from "./ui.module.css";

export const metadata = { title: "Showcase • Basic Chat App" };

export default function ShowcasePage() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Make your chat app <span className={styles.accent}>shine</span> ✨
        </h1>
        <p className={styles.subtitle}>
          Clean gradients, smooth hover effects, and a friendly layout.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>Open Chat</Link>
          <Link href="/showcase" className={styles.ghostBtn}>This Page</Link>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.card}><h3>Fast Setup</h3><p>Next.js + TS</p></div>
        <div className={styles.card}><h3>Pretty UI</h3><p>Cards & shadows</p></div>
        <div className={styles.card}><h3>Responsive</h3><p>Mobile → Desktop</p></div>
        <div className={styles.card}><h3>Extensible</h3><p>Drop in components</p></div>
      </section>

      <footer className={styles.footer}>
        Built by <b>Pruthviraj Pawar</b> • Internship mini task
      </footer>
    </main>
  );
}
