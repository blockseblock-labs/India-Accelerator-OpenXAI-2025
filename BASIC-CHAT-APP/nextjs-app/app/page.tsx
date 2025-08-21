import GroupChat from '@/components/GroupChat';

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>India Accelerator OpenXAI 2025 — Demo UI</h1>
      <p>Local AI chat is working. Below is a realtime group chat room.</p>
      <GroupChat />
    </main>
  );
}
