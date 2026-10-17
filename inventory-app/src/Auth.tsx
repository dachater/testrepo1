import { FormEvent, useState } from "react";
import { supabase } from "./supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) setMsg(error.message);
    else if (mode === "up") setMsg("Check your email to confirm your account, then sign in.");
  }

  return (
    <form className="card auth" onSubmit={submit}>
      <h1>🏠 Home Inventory</h1>
      <label>Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" required minLength={10} autoComplete={mode === "in" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <button disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</button>
      <button type="button" className="link" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Need an account? Sign up" : "Have an account? Sign in"}
      </button>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}
