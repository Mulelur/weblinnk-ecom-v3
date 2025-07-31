import React from "react";
import { ChevronLeft, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import db from "@/lib/db";
import type { Product } from "@/types/Product";
import Breadcrumbs from "@/components/breadcrumbs";
import { absoluteUrl, moneyFormatter } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User as TUser } from "@/types";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/initFirebase";
import { toast } from "sonner";
import { Footer } from "@/components/footer";
import ProductSkeleton from "@/components/ProductSkeleton";

export type RouteParams = {
  id?: string;
};

type Props = {
  user: TUser | null;
};

export default function ProductDetailPage({ user }: Props) {
  const { id } = useParams<RouteParams>();
  const [product, setProduct] = React.useState<Product>();
  const [loading, setLoading] = React.useState(true);
  const [main, setMain] = React.useState<string | null>();

  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      db.getById("weblinnk-products", id)
        .then((data) => {
          setProduct(data);
          setMain(data?.mainImage);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handelBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Logout failed", { description: err.message });
    }
  };

  return (
    <>
      {!loading && product ? (
        <>
          <div className="min-h-screen h-full flex flex-col justify-between">
            <div className="mx-auto max-w-screen-lg">
              <section className="shadow rounded-md container mt-2 flex items-center gap-6 px-2 pt-2 md:max-w-[84rem] md:py-2 lg:py-2">
                <Button variant="outline" size="icon" onClick={handelBack}>
                  <ChevronLeft className="size-4" />
                </Button>
                <div className="mx-auto px-4">
                  <Breadcrumbs
                    crumb={product.slug}
                    linkProducts={absoluteUrl(`/`)}
                    linkHome={absoluteUrl(`/`)}
                  />
                </div>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar>
                        <AvatarImage src={user.photoURL || ""} />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      {/* <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Billing
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Truck />
                      Track
                    </DropdownMenuItem>
                  </DropdownMenuGroup> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button onClick={() => navigate("/login")}>Login</Button>
                )}
              </section>
              <section className="container flex flex-col gap-4 md:max-w-[84rem] md:py-4 lg:py-6">
                <div className="container mx-auto px-4">
                  <div className="lg:col-gap-12 xl:col-gap-16 mt-4 grid grid-cols-1 gap-2 lg:mt-12 lg:grid-cols-5 lg:gap-16">
                    <div className="lg:col-span-3 lg:row-end-1">
                      <div className="lg:flex lg:items-start">
                        <div className="lg:order-2 lg:ml-5">
                          <div className="max-w-xl overflow-hidden rounded-lg">
                            <img
                              className="size-full max-w-full object-cover"
                              width={500}
                              height={500}
                              src={main || ""}
                              alt="main image"
                            />
                          </div>
                        </div>
                        <div className="mt-2 w-full px-8 lg:order-1 lg:w-32 lg:shrink-0">
                          <div className="flex flex-row gap-2 items-start lg:flex-col lg:justify-center">
                            {product.images &&
                              product.images.map((img) => {
                                return (
                                  <button
                                    key={img}
                                    onClick={() => {
                                      setMain(img || "");
                                    }}
                                    type="button"
                                    className={`mb-3 aspect-square h-20 overflow-hidden rounded-lg border-2 ${
                                      img === main
                                        ? "border-gray-900"
                                        : "border-transparent"
                                    }  text-center`}
                                  >
                                    <img
                                      className="size-full object-cover"
                                      src={img}
                                      alt="test"
                                      width={100}
                                      height={100}
                                    />
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
                      <h1 className="font-bold text-gray-900 sm:text-2xl">
                        {product.title}
                      </h1>
                      {product.compareAt && (
                        <Badge variant="destructive">Sale</Badge>
                      )}
                      {product.brand && (
                        <Button variant="link">{product.brand}</Button>
                      )}
                      {/* <Reviews /> */}
                      {/* <Details /> */}
                      <div className="flex flex-col items-start  justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-end pb-1">
                          <h1 className="text-lg font-bold">
                            {moneyFormatter.format(product.price)}
                            {product.compareAt && (
                              <span className="pl-1 text-xs text-gray-400 line-through">
                                {moneyFormatter.format(product.compareAt)}
                              </span>
                            )}
                          </h1>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => navigate(`/checkout/${product.id}`)}
                        >
                          Buy Now!
                        </Button>
                      </div>
                      {/* <div className="mb-10 mt-6 flex items-baseline border-b border-slate-200 pb-6">
              <div className="flex space-x-2 text-sm">
                <label>
                  <input
                    className="peer sr-only"
                    name="size"
                    type="radio"
                    value="xs"
                    checked
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 peer-checked:bg-slate-900 peer-checked:font-semibold peer-checked:text-white">
                    XS
                  </div>
                </label>
                <label>
                  <input
                    className="peer sr-only"
                    name="size"
                    type="radio"
                    value="s"
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 peer-checked:bg-slate-900 peer-checked:font-semibold peer-checked:text-white">
                    S
                  </div>
                </label>
                <label>
                  <input
                    className="peer sr-only"
                    name="size"
                    type="radio"
                    value="m"
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 peer-checked:bg-slate-900 peer-checked:font-semibold peer-checked:text-white">
                    M
                  </div>
                </label>
                <label>
                  <input
                    className="peer sr-only"
                    name="size"
                    type="radio"
                    value="l"
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 peer-checked:bg-slate-900 peer-checked:font-semibold peer-checked:text-white">
                    L
                  </div>
                </label>
                <label>
                  <input
                    className="peer sr-only"
                    name="size"
                    type="radio"
                    value="xl"
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 peer-checked:bg-slate-900 peer-checked:font-semibold peer-checked:text-white">
                    XL
                  </div>
                </label>
              </div>
            </div> */}

                      {/* <Perks /> */}
                    </div>
                    {product.description && (
                      <div className="pb-8 lg:col-span-3">
                        <div className="border-gray-300">
                          <nav className="flex gap-4">
                            <a
                              href="#"
                              title=""
                              className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900 hover:border-gray-400 hover:text-gray-800"
                            >
                              {" "}
                              Description{" "}
                            </a>

                            {/* <a
                    href="#"
                    title=""
                    className="inline-flex items-center border-b-2 border-transparent py-4 text-sm font-medium text-gray-600"
                  >
                    Reviews
                    <span className="ml-2 block rounded-full bg-gray-500 px-2 py-px text-xs font-bold text-gray-100">
                      {" "}
                      1,209{" "}
                    </span>
                  </a> */}
                          </nav>
                          <div
                            className="mt-8 flow-root sm:mt-12"
                            dangerouslySetInnerHTML={{
                              __html: product.description,
                            }}
                          />
                          {/* {convert(selectedProduct.description, options)} */}
                          {/* {selectedProduct.description} */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              {/* <section className="container flex flex-col  gap-6 md:max-w-[84rem] md:py-4 lg:py-12">
      <h1 className="sm: text-2xl font-bold text-gray-900 sm:text-3xl">
        Reviews
      </h1>
      <Rating />
    </section> */}
              {/* <section className="container flex flex-col  gap-6 md:max-w-[84rem] md:py-4 lg:py-12">
      <Recommended />
    </section> */}
            </div>
            <Footer />
          </div>
        </>
      ) : (
        <ProductSkeleton />
      )}
    </>
  );
}
