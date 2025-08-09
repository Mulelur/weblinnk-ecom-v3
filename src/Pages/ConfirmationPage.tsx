/* eslint-disable react-hooks/exhaustive-deps */
import { TopBar } from "@/components/top";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/Orders";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import db from "@/lib/db";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const params = useParams() as {
    id: string;
  } | null;
  const orderId = params?.id || "";

  const [orders, setOrders] = React.useState<Order>();
  const [loading, setLoading] = React.useState(true);

  const getOrders = async () => {
    setLoading(true);
    try {
      const order = await db.getById("weblinnk-orders", orderId);
      setOrders(order);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="mx-auto max-w-screen-lg w-[375px] md:w-[499px]">
      <TopBar image="https://images.unsplash.com/photo-1650393771173-73b07d3fe9f2?q=80&w=3087&auto=format&fit=crop" />
      <div className="mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            We received your order!
          </h1>
          {loading ? (
            <Skeleton className="mt-2 h-5 w-64" />
          ) : (
            <p className="text-sm text-gray-600 py-2 text-center">
              Order <span className="font-medium">{orders?.id}</span> is
              completed and ready to ship.
            </p>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : (
            orders && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-medium mb-6">Order Summary</h2>
                {/* {orders.products.length > 0 &&
                  orders.products.map((item, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))} */}
                {orders.products && (
                  <div
                    key={orders.products.name}
                    className="flex justify-between text-md text-gray-700"
                  >
                    <img
                      src={orders.products.imageUrl}
                      alt={orders.products.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <span>
                      {orders.products.name} × {orders.products.quantity}
                    </span>
                    <span>
                      {(
                        orders.products.quantity * orders.products.price
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R {orders && orders.total}</span>
                </div>
              </div>
            )
          )}
        </div>
        <div className="text-center text-sm text-gray-500 pt-8">
          Estimated delivery: 3-5 business days
        </div>
        <div
          onClick={() => navigate("/")}
          className="text-center text-sm text-gray-500 pt-4"
        >
          <Button>Continue Shopping</Button>
        </div>
      </div>
    </div>
  );
}
