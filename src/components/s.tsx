/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import db from "@/lib/db";
import { Link } from "react-router-dom";
import { moneyFormatter, limitText } from "@/lib/utils";

type Props = {
  onSearchSubmit: (results: any[]) => void;
  id: string;
};

export default function ProductSearch({ onSearchSubmit, id }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      try {
        const data = await db.queryAll({
          collection: "weblinnk-products",
          where: [
            ["shopId", "==", id],
            ["stockavailability", "==", true],
            ["title", ">=", query],
            ["title", "<=", query + "\uf8ff"],
          ],
          limit: 10,
        });
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSearch, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  // Handle Enter key to submit search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && results.length) {
      onSearchSubmit(results);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Floating Search Icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90"
      >
        <Search size={20} />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-sm rounded-2xl bg-white shadow-xl p-6 relative"
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              {/* Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products..."
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>

              {/* Results */}
              {loading && <p className="text-sm text-gray-400">Searching...</p>}
              {!loading && results.length === 0 && query && (
                <p className="text-sm text-gray-500">No products found.</p>
              )}

              <ul className="divide-y divide-gray-100">
                {results.map((product) => (
                  <li key={product.id} className="py-2">
                    <Link
                      to={`/s/${product.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg"
                    >
                      <img
                        src={product.mainImage || ""}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {limitText(product.title)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {moneyFormatter.format(Number(product.price))}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
