import { useEffect, useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const api = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${api}/api/health`).catch(()=>{});
    fetch(`${api}/api/items`).then(r=>r.json()).then(setItems);
  }, []);

  const add = async () => {
    await fetch(`${api}/api/items`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ name })
    });
    setName("");
    const list = await fetch(`${api}/api/items`).then(r=>r.json());
    setItems(list);
  };

  return (
    <div style={{padding: 24, fontFamily: "sans-serif"}}>
      <h1>MERN Demo</h1>
      <div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Add item" />
        <button onClick={add}>Add</button>
      </div>
      <ul>{items.map((x,i)=><li key={i}>{x.name}</li>)}</ul>
    </div>
  );
}