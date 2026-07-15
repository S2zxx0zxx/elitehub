import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <SignUp 
        appearance={{
          variables: {
            colorPrimary: "#F5C518",
            colorBackground: "#FFFFFF",
            colorText: "#1A1A1A",
            colorTextSecondary: "#6B6B6B",
            colorInputBackground: "#FAFAF9",
            colorInputText: "#1A1A1A",
            borderRadius: "1rem",
            fontFamily: "var(--font-body)",
          },
          elements: {
            card: "shadow-glossy-lg border border-[#EBEBEB]",
            formButtonPrimary: "bg-[#F5C518] hover:bg-[#E0A800] text-black",
          },
        }}
      />
    </div>
  );
}
