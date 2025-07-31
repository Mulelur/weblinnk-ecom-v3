import { Button } from "@/components/ui/button";

export default function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-screen-lg animate-pulse">
      {/* Header Skeleton */}
      <section className="container mt-2 flex items-center gap-6 px-2 pt-2">
        <div className="h-10 w-10 rounded-md bg-gray-200" />
        <div className="flex-1 h-6 bg-gray-200 rounded w-2/3" />
        <div className="h-10 w-10 rounded-full bg-gray-200" />
      </section>

      {/* Product Section */}
      <section className="container mt-6 flex flex-col gap-4 md:max-w-[84rem]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16">
          {/* Image section */}
          <div className="lg:col-span-3">
            <div className="lg:flex lg:items-start gap-4">
              <div className="w-full max-w-xl h-[400px] rounded-lg bg-gray-200" />
              <div className="flex lg:flex-col gap-2 mt-4 lg:mt-0 lg:w-32">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-20 w-20 rounded-lg bg-gray-200 border"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Details section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-red-300 rounded" />
            <div className="h-4 w-20 bg-gray-300 rounded" />

            <div className="h-8 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-300 rounded" />

            <Button disabled className="w-full bg-gray-300 text-transparent">
              Loading...
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="lg:col-span-3 mt-8">
          <div className="h-4 w-32 bg-gray-300 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    </div>
  );
}
