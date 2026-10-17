import { FormEvent, useState } from "react";
import { supabase } from "./supabase";
import type { Item, ItemInput } from "./types";

interface Props {
  userId: string;
  item?: Item;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ItemForm({ userId, item, onSaved, onCancel }: Props) {
  const [f, setF] = useState({
    name: item?.name ?? "",
    quantity: item?.quantity ?? 1,
    room: item?.room ?? "",
    category: item?.category ?? "",
    notes: item?.notes ?? "",
    purchase_price: item?.purchase_price?.toString() ?? "",
    purchase_date: item?.purchase_date ?? "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    let photo_path = item?.photo_path ?? null;
    if (photo) {
      const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("item-photos").upload(path, photo, { contentType: photo.type });
      if (up.error) {
        setBusy(false);
        return setErr(up.error.message);
      }
      if (photo_path) await supabase.storage.from("item-photos").remove([photo_path]);
      photo_path = path;
    }

    const row: ItemInput = {
      name: f.name.trim(),
      quantity: Number(f.quantity),
      room: f.room.trim() || null,
      category: f.category.trim() || null,
      notes: f.notes.trim() || null,
      purchase_price: f.purchase_price ? Number(f.purchase_price) : null,
      purchase_date: f.purchase_date || null,
      photo_path,
    };
    const { error } = item
      ? await supabase.from("items").update(row).eq("id", item.id)
      : await supabase.from("items").insert(row);
    setBusy(false);
    if (error) setErr(error.message);
    else onSaved();
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>{item ? "Edit item" : "Add item"}</h2>
      <label>Name<input required maxLength={200} value={f.name} onChange={set("name")} /></label>
      <div className="row">
        <label>Quantity<input type="number" min={0} required value={f.quantity} onChange={set("quantity")} /></label>
        <label>Room<input value={f.room} onChange={set("room")} placeholder="Kitchen" /></label>
        <label>Category<input value={f.category} onChange={set("category")} placeholder="Appliance" /></label>
      </div>
      <div className="row">
        <label>Price paid<input type="number" min={0} step="0.01" value={f.purchase_price} onChange={set("purchase_price")} /></label>
        <label>Purchase date<input type="date" value={f.purchase_date} onChange={set("purchase_date")} /></label>
      </div>
      <label>Notes<textarea rows={3} value={f.notes} onChange={set("notes")} /></label>
      <label>Photo (JPEG/PNG/WebP, max 5 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            if (file && file.size > 5 * 1024 * 1024) { setErr("Photo is over 5 MB"); e.target.value = ""; return; }
            setPhoto(file);
          }} />
      </label>
      {err && <p className="msg">{err}</p>}
      <div className="row">
        <button disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
