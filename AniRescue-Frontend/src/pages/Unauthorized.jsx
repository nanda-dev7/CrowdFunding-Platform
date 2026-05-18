import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import PageTransition from "../components/common/PageTransition";

export default function Unauthorized() {
  return (
    <PageTransition className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-extrabold text-ink">You do not have access to this area.</h1>
      <p className="mt-3 text-bark/70">Your current account role cannot open this dashboard.</p>
      <Button as={Link} to="/" className="mt-6">Go home</Button>
    </PageTransition>
  );
}
