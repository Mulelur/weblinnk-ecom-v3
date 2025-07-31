import React, { useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { auth } from "@/lib/initFirebase";
import { absoluteUrl, moneyFormatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "@/types/Product";
import db from "@/lib/db";

export type RouteParams = {
  id?: string;
};

export function CheckoutForm() {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();

  const [product, setProduct] = React.useState<Product>();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && inputRef.current) {
      inputRef.current.value = place.formatted_address || "";
    }
  };

  const [loading, setLoading] = useState(false);
  // const { push } = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const street = formData.get("street") as string;
    const postalCode = formData.get("postalCode") as string;
    const city = formData.get("city") as string;
    const country = formData.get("country") as string;
    const province = formData.get("province") as string;

    const currentUser = auth.currentUser;

    if (!currentUser) {
      //   alert("You need to be logged in.");
      console.log("hello");
      navigate(`/login?redirect=${window.location.pathname}&lang=en`);
      setLoading(false);
      return;
    }

    const token = await currentUser.getIdToken();

    // 👉 Open blank tab immediately to avoid popup blocker

    if (!product) return;

    try {
      const res = await fetch(
        "https://us-central1-weblinnk-project.cloudfunctions.net/yocoCheckout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            shopId: product.shopId,
            storeUId: "12345",
            successUrl: absoluteUrl(`/confirmation`),
            cancelUrl: absoluteUrl(`/`),
            failureUrl: absoluteUrl(`/`),
            customer: {
              name,
              email,
              phone,
            },
            address: {
              street,
              city,
              country,
              postalCode,
              province,
            },
          }),
        }
      );

      const data = await res.json();
      if (data?.data?.redirectUrl) {
        window.location.href = data.data.redirectUrl;

        form.reset();
        if (inputRef.current) inputRef.current.value = "";

        document.activeElement?.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape" })
        );
      } else {
        alert("Failed to create Yoco checkout session.");
        console.error("Unexpected response:", data);
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert("Error initiating payment. Please try again.");
      // newTab?.close()
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      db.getById("weblinnk-products", id)
        .then((data) => {
          setProduct(data);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  console.log(product, "product");

  return (
    <div className="mx-auto max-w-screen-lg pt-6 pb-8 ">
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Number Phone</Label>
            <Input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Phone number"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="street">Shipping Address</Label>
            {isLoaded ? (
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <Input
                  id="street"
                  name="street"
                  placeholder="Start typing..."
                  required
                  ref={inputRef}
                />
              </Autocomplete>
            ) : (
              <Input
                id="street"
                name="street"
                placeholder="Loading..."
                required
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="Cape Town" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Select name="country">
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="south_africa">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="province">Province</Label>
              <Select name="province">
                <SelectTrigger>
                  <SelectValue placeholder="Select a province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gauteng">Gauteng</SelectItem>
                  <SelectItem value="kwaZulu_natal">KwaZulu-Natal</SelectItem>
                  <SelectItem value="limpopo">Limpopo</SelectItem>
                  <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                  <SelectItem value="northern_cape">Northern Cape</SelectItem>
                  <SelectItem value="western_cape">Western Cape</SelectItem>
                  <SelectItem value="eastern_cape">Eatern Cap</SelectItem>
                  <SelectItem value="free_state">Free State</SelectItem>
                  <SelectItem value="north_west">North West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input placeholder="Postal Code" name="postalCode" />
            </div>
          </div>
        </div>
        {product && (
          <div>
            <dl className="space-y-6 pt-4 sm:px-2">
              <div className="flex items-center justify-between">
                <dt className="text-xl">{product.title}</dt>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.Shipping === 0
                    ? "Free"
                    : moneyFormatter.format(product.Shipping)}
                </dd>
              </div>
              {/* <div className="flex items-center justify-between">
                <dt className="text-sm">Taxes</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {moneyFormatter.format(product.VAT)}
                </dd>
              </div> */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base font-medium">Total</dt>
                <dd className="text-base font-medium text-gray-900">
                  {moneyFormatter.format(
                    product.price + product.VAT + product.Shipping
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Confirm Payment"}
        </Button>
      </form>
    </div>
  );
}
