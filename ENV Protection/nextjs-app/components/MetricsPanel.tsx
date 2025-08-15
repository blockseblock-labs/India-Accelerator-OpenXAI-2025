import React from "react";

const Box: React.FC = () => {
  return (
    <div style={{ border: "1px solid black", padding: "16px", maxWidth: "400px" }}>
      <h2>Welcome to My Box</h2>
      <p>
        This is a simple content box created with React and TypeScript. 
        You can use it to display any kind of information, such as text, 
        descriptions, or even small UI components.
      </p>
      <p>
        The purpose of this box is to give you a clean and minimal way to 
        showcase your content.
      </p>
    </div>
  );
};

export default Box;
