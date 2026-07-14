import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0D] p-4">
      <SignIn 
        signUpUrl="/sign-up" 
        fallbackRedirectUrl="/" 
        appearance={{ 
          baseTheme: dark, 
          variables: { colorPrimary: "#F5C518", colorBackground: "#0B0B0D" } 
        }} 
      />
    </div>
  );
}
