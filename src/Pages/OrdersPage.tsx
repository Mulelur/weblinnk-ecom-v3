/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/top";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/footer";
import { auth } from "@/lib/initFirebase";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>();
  const id = import.meta.env.VITE_WEBLINNK_PROJECT_ID;

  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!currentUser) {
    navigate(`/login?redirect=${window.location.pathname}&lang=en`);
    setLoading(false);
    return;
  }

  const fetchOrders = async () => {
    const token = await currentUser.getIdToken();
    setLoading(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:5001/weblinnk-project/us-central1/getOrders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shopId: id,
          }),
        }
      );

      const data = await res.json();

      setOrders(data.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handelBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="min-h-screen h-full flex flex-col justify-between">
        <div className="mx-auto max-w-screen-lg w-[375px] md:w-[549px]">
          <TopBar image="https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <div className="mx-auto pt-8 sm:px-6 lg:px-2">
            <div className="flex gap-2 items-center py-8">
              <Button variant="outline" size="icon" onClick={handelBack}>
                <ChevronLeft className="size-4" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">
                We received your order!
              </h1>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : orders && orders.length === 0 ? (
              <p className="text-gray-500">No orders yet.</p>
            ) : (
              <div className="space-y-4 pb-8">
                {orders &&
                  orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="bg-white p-4 shadow rounded-md border flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex gap-4 w-full">
                        <img
                          src={order.products.imageUrl}
                          // alt={orders.products[0].name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="mr-auto">
                          <p className="text-sm font-medium">
                            Order {order.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.products.names} × {order.products.quantity}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            R {order.total}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <Button
                            onClick={() =>
                              window.open(
                                "https://thecourierguy.co.za/tracking",
                                "_blank"
                              )
                            }
                            disabled={!order.waybill}
                          >
                            Track
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
