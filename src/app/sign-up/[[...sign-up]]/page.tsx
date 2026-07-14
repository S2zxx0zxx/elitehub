import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0D] p-4">
      <SignUp 
        signInUrl="/sign-in" 
        fallbackRedirectUrl="/onboarding"
        appearance={{ 
          baseTheme: dark, 
          variables: { colorPrimary: "#F5C518", colorBackground: "#0B0B0D" } 
        }} 
      />
    </div>
  );
}
