import { Link } from "react-router-dom";
import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageTransition from "../components/common/PageTransition";

export default function Login() {
  const { login, isLoading } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const submit = (event) => {
    event.preventDefault();
    login(values);
  };
  return (
    <PageTransition className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-coral">Welcome back</p>
        <h1 className="mt-3 text-5xl font-black tracking-tighter leading-tight text-ink">Continue funding urgent rescue care.</h1>
        <p className="mt-5 max-w-xl text-bark/70">Access donations, notifications, campaigner tools, and admin workflows from one calm dashboard.</p>
      </div>
      <form onSubmit={submit} className="glass rounded-[2rem] border border-white p-6 shadow-soft">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral text-white">
          <HeartHandshake />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-ink">Login</h2>
        <div className="mt-6 grid gap-4">
          <Input label="Email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required />
          <Input label="Password" type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required />
          <Button type="submit" disabled={isLoading}>Login</Button>
        </div>
        <p className="mt-5 text-center text-sm text-bark/65">
          New to AniRescue? <Link className="font-bold text-coral" to="/register">Create an account</Link>
        </p>
      </form>
    </PageTransition>
  );
}
