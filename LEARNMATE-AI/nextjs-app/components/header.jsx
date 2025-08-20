// src/components/Header.jsx
const Header = () => {
  return (
    <div className="card p-6 mb-8 text-center">
      <h1 className="text-6xl font-extrabold text-neon-blue drop-shadow-neon mb-4 tracking-tighter">
        LEARNMATE <span className="text-neon-purple">AI</span>
      </h1>
      <p className="text-light-grey text-2xl font-mono">
        Your <span className="text-neon-green">AI-Powered</span> Educational Assistant
      </p>
    </div>
  );
};

export default Header;