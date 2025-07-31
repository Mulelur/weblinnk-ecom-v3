/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import db from "@/lib/db";
import { limitText, moneyFormatter } from "@/lib/utils";
import { Card } from "./ui/card";
import type { Product } from "@/types/Product";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

type Props = {
  id: string;
};

export default function ProductList({ id }: Props) {
  const [productList, setProductList] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);
  console.log(productList);

  React.useEffect(() => {
    db.query({
      collection: "weblinnk-products",
      where: [
        ["shopId", "==", id],
        // ["quantity", ">", 1],
      ],
      limit: 10,
    })
      .then((data) => {
        setProductList(data);
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      <h2 className="pb-2 text-lg">Products</h2>
      <main className="grid grid-cols-2 gap-x-6 gap-y-10 pb-20 sm:grid-cols-3 sm:px-8 lg:mt-16 lg:grid-cols-4 lg:gap-x-4 lg:px-0">
        {loading
          ? [...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse px-4">
                <div className="aspect-square bg-gray-200" />
                <div className="mt-4 h-4 w-3/4 bg-gray-200" />
                <div className="mt-2 h-4 w-1/2 bg-gray-200" />
                <div className="py-4">
                  <div className="h-10 w-full bg-gray-200" />
                </div>
              </Card>
            ))
          : productList.map((product: Product) => (
              <Card
                key={product.title}
                className="px-4"
                // onClick={() => dispatch(setSelectedProduct(product))}
              >
                <article className="relative">
                  <div className="aspect-square overflow-hidden">
                    <Link to={`/s/${product.id}`}>
                      <img
                        className="size-full object-cover transition-all duration-300 group-hover:scale-125"
                        src={product.mainImage || ""}
                        alt=""
                        width={1000}
                        height={1000}
                      />
                    </Link>
                  </div>
                  <div className="absolute top-0 m-1 rounded-full bg-white">
                    {product.compareAt && (
                      <Badge variant="destructive">Sale</Badge>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col items-start justify-between">
                    <h3 className="text-xs font-semibold sm:text-sm md:text-base">
                      {limitText(product.title)}
                    </h3>
                    <div className="flex text-right">
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
                  <div className="py-4">
                    {/* <CheckoutDialog product={product} /> */}
                  </div>
                </article>
              </Card>
            ))}
      </main>
    </>
  );
}
