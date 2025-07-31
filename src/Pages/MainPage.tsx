import ProductList from "@/components/product-list";
import type { Shop } from "@/types/Shop";
import React from "react";
import db from "@/lib/db";
import { Footer } from "@/components/footer";

export default function MainPage() {
  const project_id = import.meta.env.VITE_WEBLINNK_PROJECT_ID;

  const [store, setStore] = React.useState<Shop | null>();

  React.useEffect(() => {
    async function fetchStore() {
      try {
        const store = await db.getById("weblinnk-shop", project_id);

        if (store) {
          setStore(store);
        }
      } catch (err) {
        console.error("Failed to fetch store:", err);
      }
    }

    fetchStore();
  }, [project_id]);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-screen-lg">
        <div
          className="relative h-56 rounded-b-lg bg-cover bg-center bg-no-repeat shadow-lg"
          style={{ backgroundImage: `url(${store.banner})` }}
        >
          <div className="px-4 pb-10 pt-8">
            <div className="absolute inset-x-0 -bottom-10 mx-auto w-36 rounded-full border-8 border-white shadow-lg">
              <img
                className="mx-auto h-auto w-full rounded-full bg-white"
                src={`${store.logo}`}
                alt="Store Logo"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-center space-y-4 p-4 sm:flex-row sm:space-y-0 md:justify-between lg:px-4">
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold text-gray-800">{store.name}</h1>
            <p>{store.bio}</p>
          </div>

          <div>
            {/* <div className="flex gap-4">
            <button className="flex whitespace-nowrap rounded-lg bg-pink-600 px-6 py-2 font-bold text-white transition hover:translate-y-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 inline h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Chat with us
            </button>
          </div> */}
            <p className="mt-4 flex items-center whitespace-nowrap text-gray-500 sm:justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 inline size-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {store.phoneNumber}
            </p>
            <p className="mt-4 flex items-center whitespace-nowrap text-gray-500 sm:justify-end">
              <svg
                className="mr-2 inline size-5"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              {store.email}
            </p>
          </div>
        </div>
        <div className="px-4">
          <ProductList id={store.id} />
        </div>
      </div>
      <Footer />
    </>
  );
}
