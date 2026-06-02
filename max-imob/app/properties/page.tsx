import Link from "next/link";
import PropertiesBrowser from "./components/properties-browser";
import Header from "../components/Header";

export default function PropertiesPage() {
  return (
    <main>
       <Header />
      <PropertiesBrowser />
    </main>
  );
}
