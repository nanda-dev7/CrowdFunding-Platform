import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import PageTransition from "../components/common/PageTransition";

export default function NotFound() {
  return (
    <PageTransition className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-extrabold text-ink">Page not found</h1>
      <p className="mt-3 text-bark/70">This AniRescue page may have moved.</p>
      <Button as={Link} to="/" className="mt-6">Back to AniRescue</Button>
    </PageTransition>
  );
}
