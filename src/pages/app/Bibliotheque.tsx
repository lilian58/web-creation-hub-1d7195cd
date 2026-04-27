import { Search, BookOpen as BookIcon, Star, Download } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import cover1 from "@/assets/book-cover-1.jpg";
import cover2 from "@/assets/book-cover-2.jpg";
import cover3 from "@/assets/book-cover-3.jpg";

const categories = ["Tous", "Foi", "Prière", "Spiritualité", "Témoignage", "Études"];

const books = [
  { id: "1", title: "La grâce qui transforme", author: "Pasteur Daniel K.", cover: cover2, rating: 4.8, pages: 248, downloads: "12k" },
  { id: "2", title: "Vivre dans la présence", author: "Esther Mendès", cover: cover3, rating: 4.6, pages: 192, downloads: "8.4k" },
  { id: "3", title: "Confiance & abandon", author: "Prophète Samuel", cover: cover1, rating: 4.9, pages: 320, downloads: "21k" },
  { id: "4", title: "Marcher par la foi", author: "Pasteur Daniel K.", cover: cover2, rating: 4.7, pages: 175, downloads: "6.1k" },
  { id: "5", title: "Le pouvoir de la prière", author: "Marie Dupont", cover: cover3, rating: 4.5, pages: 210, downloads: "9.8k" },
  { id: "6", title: "Lumière sur le chemin", author: "Jean Bertin", cover: cover1, rating: 4.4, pages: 156, downloads: "4.7k" },
];

export default function Bibliotheque() {
  const [cat, setCat] = useState("Tous");

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-6xl mx-auto space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          placeholder="Rechercher un livre, un auteur..."
          className="w-full h-12 pl-12 pr-4 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "shrink-0 px-5 py-2 rounded-full text-sm font-medium transition",
              cat === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured */}
      <Link to={`/app/bibliotheque/${books[0].id}`} className="block gradient-hero rounded-3xl p-6 lg:p-8 text-primary-foreground shadow-card relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
        <img src={books[0].cover} alt="" loading="lazy" width={600} height={800} className="w-32 md:w-40 aspect-[3/4] object-cover rounded-xl shadow-glow shrink-0" />
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-gold text-primary-deep rounded-full text-xs font-semibold mb-2">À la une</span>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-1">{books[0].title}</h3>
          <p className="text-primary-foreground/80 text-sm mb-3">par {books[0].author}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-gold text-gold" /> {books[0].rating}</span>
            <span className="flex items-center gap-1"><BookIcon className="w-4 h-4" /> {books[0].pages} pages</span>
            <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {books[0].downloads}</span>
          </div>
        </div>
      </Link>

      <h3 className="font-display text-xl font-semibold text-primary">Tous les livres</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {books.map((b) => (
          <Link key={b.id} to={`/app/bibliotheque/${b.id}`} className="group">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-soft group-hover:shadow-card group-hover:-translate-y-1 transition-all">
              <img src={b.cover} alt={b.title} loading="lazy" width={600} height={800} className="w-full h-full object-cover" />
            </div>
            <h4 className="mt-3 font-semibold text-foreground line-clamp-2 text-sm">{b.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{b.author}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-gold text-gold" /> {b.rating}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
