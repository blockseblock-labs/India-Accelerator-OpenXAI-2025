export default function Home() {
  return (
    <div className="chat-container">
      <h1>Basic Chat App</h1>
      <div className="chat-box">
        <div className="messages">
          <p>User: Hello 👋</p>
        </div>
        <input type="text" placeholder="Type a message..." />
      </div>
    </div>
  );
}