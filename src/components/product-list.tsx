/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import db from "@/lib/db";
import { limitText, moneyFormatter } from "@/lib/utils";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import type { DocumentSnapshot } from "firebase/firestore";
import ProductSearch from "./s";

type Props = {
  id: string;
};

const PAGE_SIZE = 4;

export default function ProductList({ id }: Props) {
  const [productList, setProductList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  console.log(productList);

  const lastDocRef = React.useRef<DocumentSnapshot | null>(null); // ← Track lastDoc safely
  const observerRef = React.useRef<HTMLDivElement | null>(null);

  const fetchProducts = React.useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data, lastDoc: newLastDoc } = await db.query({
        collection: "weblinnk-products",
        where: [
          ["shopId", "==", id],
          ["stockavailability", "==", true],
        ],
        limit: PAGE_SIZE,
        startAfterDoc: lastDocRef.current ?? undefined, // Use ref here
      });

      setProductList((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const filtered = data.filter((p: any) => !ids.has(p.id));
        return [...prev, ...filtered];
      });

      lastDocRef.current = newLastDoc || null; // ← update ref
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [id, loading, hasMore]);

  const handleSearchSubmit = (results: any[]) => {
    setProductList(results);
    setHasMore(false); // stop infinite scroll after filtering
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProducts();
        }
      },
      { rootMargin: "200px" }
    );

    const node = observerRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [fetchProducts, hasMore, loading]);

  return (
    <>
      <ProductSearch onSearchSubmit={handleSearchSubmit} id={id} />
      <h2 className="pb-2 text-lg">Products</h2>

      <main className="grid grid-cols-2 gap-x-6 gap-y-10 pb-10 sm:grid-cols-3 sm:px-8 lg:mt-16 lg:grid-cols-4 lg:gap-x-4 lg:px-0">
        {productList.map((product: any) => (
          <Card key={product.id} className="px-4">
            <article className="relative">
              <div className="aspect-square overflow-hidden">
                <Link to={`/s/${product.id}`}>
                  <img
                    className="size-full object-cover transition-all duration-300 group-hover:scale-125"
                    src={product.mainImage || ""}
                    alt={product.title}
                  />
                </Link>
              </div>
              <div className="absolute top-0 m-1 rounded-full bg-white">
                {product.compareAt && <Badge variant="destructive">Sale</Badge>}
              </div>
              <div className="mt-4 flex flex-col items-start justify-between">
                <h3 className="text-xs font-semibold sm:text-sm md:text-base">
                  {limitText(product.title)}
                </h3>
                <div className="flex text-right gap-2">
                  {product.compareAt && (
                    <p className="text-xs font-medium text-gray-400 line-through">
                      R{product.compareAt}
                    </p>
                  )}
                  <p className="text-xs font-normal sm:text-sm md:text-base">
                    {moneyFormatter.format(Number(product?.price))}
                  </p>
                </div>
              </div>
            </article>
          </Card>
        ))}

        {loading &&
          [...Array(PAGE_SIZE)].map((_, i) => (
            <Card
              key={`loader-${i}`}
              className="flex flex-col gap-3 px-4 py-4 animate-pulse"
            >
              <div className="aspect-square rounded-lg bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="mt-auto h-10 w-full rounded bg-gray-200" />
            </Card>
          ))}
      </main>

      {/* Infinite scroll loader trigger */}
      <div ref={observerRef} className="h-10" />

      {!hasMore && !loading && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No more products to show.
        </p>
      )}
    </>
  );
}
