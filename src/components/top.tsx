export const TopBar = ({ image }: { image?: string }) => {
  return (
    <div
      className="relative h-38 rounded-b-lg bg-cover bg-center bg-no-repeat shadow-lg"
      style={{
        backgroundImage: `url(${
          image ||
          "https://plus.unsplash.com/premium_photo-1747775927955-da06b06a9826?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
        }`,
      }}
    ></div>
  );
};
