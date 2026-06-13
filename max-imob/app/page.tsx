import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LatestProperties from "./components/LatestProperties";

export default async function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <section className="container py-2">
        <div className="mb-4">
          <p className="text-uppercase text-primary fw-semibold small mb-2">Ultimele anunțuri</p>
     
        </div>
        <LatestProperties />
      </section>
      
      
      <Footer />
    </main>
  );
}
