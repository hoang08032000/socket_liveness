import React from 'react';

export default function Welcome() {
  const [count, setCount] = React.useState(0);

  return (
    <section className="absolute w-full h-full flex flex-col justify-center items-center">
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
      </div> */}
      <h1 className="text-3xl font-bold underline">Vite + React</h1>
      <button
        className="border p-2"
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </section>
  );
}
