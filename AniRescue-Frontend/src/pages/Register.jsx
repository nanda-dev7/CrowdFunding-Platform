import { Link } from "react-router-dom";
import { useState } from "react";
import { PawPrint } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageTransition from "../components/common/PageTransition";

export default function Register() {
  const { register, isLoading } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const submit = (event) => {
    event.preventDefault();
    register(values);
  };
  return (
    <PageTransition className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="order-2 lg:order-1">
        <form onSubmit={submit} className="glass rounded-[2rem] border border-white p-6 shadow-soft">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-moss">
            <PawPrint />
          </div>
          <h2 className="text-2xl font-extrabold text-ink">Create account</h2>
          <div className="mt-6 grid gap-4">
            <Input label="Full name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} required />
            <Input label="Email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required />
            <Input label="Password" type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required />
            <Button type="submit" disabled={isLoading}>Register</Button>
          </div>
          <p className="mt-5 text-sm text-bark/65">
            Already have an account? <Link className="font-bold text-moss" to="/login">Login</Link>
          </p>
        </form>
      </div>
      <div className="order-1 lg:order-2">
        <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-moss">Join the rescue circle</p>
        <h1 className="mt-3 text-5xl font-extrabold leading-tight text-ink">Small donations can become surgery, medicine, and a safe recovery.</h1>
        <p className="mt-5 max-w-xl text-bark/70">Donor accounts can track giving history, urgent alerts, and campaign updates.</p>
      </div>
    </PageTransition>
  );
}
