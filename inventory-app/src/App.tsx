import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import Auth from "./Auth";
import ItemForm from "./ItemForm";
import ItemCard from "./ItemCard";
import type { Item } from "./types";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [q, setQ] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setItems(data as Item[]);
  }, []);

  useEffect(() => { if (session) load(); else setItems([]); }, [session, load]);

  const rooms = useMemo(() => [...new Set(items.map((i) => i.room).filter(Boolean))] as string[], [items]);
  const shown = items.filter((i) =>
    (!room || i.room === room) &&
    (!q || [i.name, i.category, i.notes, i.room].some((v) => v?.toLowerCase().includes(q.toLowerCase())))
  );
  const total = items.reduce((s, i) => s + (i.purchase_price ?? 0) * i.quantity, 0);

  async function remove(item: Item) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    if (item.photo_path) await supabase.storage.from("item-photos").remove([item.photo_path]);
    const { error } = await supabase.from("items").delete().eq("id", item.id);
    if (error) setError(error.message); else load();
  }

  if (!ready) return null;
  if (!session) return <main><Auth /></main>;

  return (
    <main>
      <header>
        <h1>🏠 Home Inventory</h1>
        <button className="secondary" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </header>

      {editing ? (
        <ItemForm
          userId={session.user.id}
          item={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      ) : (
        <>
          <p className="meta">{items.length} items · est. value ${total.toFixed(2)}</p>
          <div className="row">
            <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select value={room} onChange={(e) => setRoom(e.target.value)}>
              <option value="">All rooms</option>
              {rooms.map((r) => <option key={r}>{r}</option>)}
            </select>
            <button onClick={() => setEditing("new")}>+ Add</button>
          </div>
          {error && <p className="msg">{error}</p>}
          <ul className="list">
            {shown.map((i) => <ItemCard key={i.id} item={i} onEdit={() => setEditing(i)} onDelete={() => remove(i)} />)}
          </ul>
          {!shown.length && <p className="meta">No items yet.</p>}
        </>
      )}
    </main>
  );
}
