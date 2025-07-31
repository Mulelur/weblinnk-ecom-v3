import { TopBar } from "@/components/top";

export default function ConfirmationPage() {
  return (
    <>
      <div className="mx-auto max-w-screen-lg w-[375px] md:w-[495px]">
        <TopBar image="https://images.unsplash.com/photo-1650393771173-73b07d3fe9f2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        <div className="mx-auto pt-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              We received your order!
            </h1>
            <p>Your order #2939993 is completed and ready to ship</p>
          </div>
        </div>
      </div>
    </>
  );
}
