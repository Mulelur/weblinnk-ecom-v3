import { LoginForm } from "@/components/login-form";
// import { TopBar } from "@/components/top";
// import { DraftingCompass } from "lucide-react";

// import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-screen-lg w-[375px] md:w-[495px] py-8 h-full">
      {/* <TopBar image="https://images.unsplash.com/photo-1751517298236-b9150faa3dfd?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" /> */}
      <div className="flex flex-col items-center justify-center gap-6 pt-8 md:pt-8">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
