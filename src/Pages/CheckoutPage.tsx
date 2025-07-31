import { CheckoutForm } from "@/components/checkout-form";
import { Footer } from "@/components/footer";
import { TopBar } from "@/components/top";
import { Button } from "@/components/ui/button";
import { ChevronLeft, HandCoins } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type RouteParams = {
  id?: string;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const handelBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="mx-auto max-w-screen-lg w-[375px] md:w-[495px]">
        <TopBar image="https://images.unsplash.com/photo-1677645445065-77a68a5601d9?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        <div className="flex gap-2 items-center py-8">
          <Button variant="outline" size="icon" onClick={handelBack}>
            <ChevronLeft className="size-4" />
          </Button>
          <h1 className="text-3xl">Checkout</h1>
          <HandCoins />
        </div>
        <CheckoutForm />
      </div>
      <Footer />
    </>
  );
}
