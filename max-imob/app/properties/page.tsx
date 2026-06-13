import { Suspense } from "react";
import PropertiesBrowser from "./components/properties-browser";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PropertiesPage() {
  return (
    <main>
      <Header />
      <Suspense fallback={<div className="container py-5 text-secondary">Se incarca proprietatile...</div>}>
        <PropertiesBrowser />
      </Suspense>
      <Footer />
    </main>
  );
}
