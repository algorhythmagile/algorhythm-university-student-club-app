import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);          // Gelen tüm JSON
  const [state, setState] = useState("loading");   // loading | ok | error | empty

  useEffect(() => {
    // Proxy devrede: 8080'deki frontend → 3000'deki backend'e iletecek
    fetch("/system-message")
      .then(async (res) => {
        if (res.status === 204) { setState("empty"); return; }
        if (!res.ok) throw new Error("Bad response");
        const json = await res.json();              // { id, message_text }
        setData(json);
        setState("ok");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>Üniversite Öğrenci Kulübü</h1>

      {state === "loading" && <p>Yükleniyor…</p>}
      {state === "error"   && <p style={{color:"#b91c1c"}}>Sistem duyurusu yüklenemedi</p>}
      {state === "empty"   && <p>(Aktif mesaj yok — 204 No Content)</p>}

      {state === "ok" && (
        <>
          {/* Sadece mesaj metnini banner gibi göster */}
          <div style={{
            background:"#111827", color:"#e5e7eb", padding:12, borderRadius:8, marginBottom:12
          }}>
            {data?.message_text}
          </div>
        </>
      )}
    </div>
  );
}
