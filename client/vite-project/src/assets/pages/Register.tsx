import React from "react";

function Main() {
  const handleSubmit = () => {
    console.log("submit");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <>
      <div>
        <form className="regsisterForm" onSubmit={handleSubmit}>
          <input type="text" onChange={handleChange}></input>
          <button type="submit">Let's go</button>
        </form>
      </div>
    </>
  );
}

export default Main;
