import { useEffect, useState } from "react";

function App() {
  const [ping, setPing] = useState(null);

  useEffect(() => {
    fetch("/ping")
      .then(res => res.json())
      .then(data => setPing(data));
  }, []);

  return (
    <div>
      <h1>TaskFlow</h1>
      <pre>{JSON.stringify(ping, null, 2)}</pre>
    </div>
  );
}

export default App;
