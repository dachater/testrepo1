import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Item } from "./types";

export default function ItemCard({ item, onEdit, onDelete }: { item: Item; onEdit: () => void; onDelete: () => void }) {
  const [src, setSrc] = useState<string | null>(null);

  // Photos are in a private bucket, so fetch a short-lived signed URL.
  useEffect(() => {
    if (!item.photo_path) return setSrc(null);
    supabase.storage.from("item-photos").createSignedUrl(item.photo_path, 3600)
      .then(({ data }) => setSrc(data?.signedUrl ?? null));
  }, [item.photo_path]);

  return (
    <li className="card item">
      {src && <img src={src} alt={item.name} loading="lazy" />}
      <div className="body">
        <h3>{item.name} <span className="qty">×{item.quantity}</span></h3>
        <p className="meta">{[item.room, item.category].filter(Boolean).join(" · ")}</p>
        {item.purchase_price != null && <p className="meta">${item.purchase_price.toFixed(2)}{item.purchase_date ? ` on ${item.purchase_date}` : ""}</p>}
        {item.notes && <p>{item.notes}</p>}
        <div className="row">
          <button className="secondary" onClick={onEdit}>Edit</button>
          <button className="danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </li>
  );
}
