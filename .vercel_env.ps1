$keys = @{
  "DATABASE_URL" = "postgresql://neondb_owner:npg_1twaqbRV5Agm@ep-shy-silence-aoa4hdol-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL" = "/sign-in";
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL" = "/sign-up";
  "NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL" = "/";
  "NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL" = "/";
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" = "pk_test_bGlnaHQtc2Vhc25haWwtMjAuY2xlcmsuYWNjb3VudHMuZGV2JA";
  "CLERK_SECRET_KEY" = "sk_test_fjGsWYAnp9qyNzoff13uxxxZAs6mkD7DxEyFtirkoN";
  "RAZORPAY_KEY_ID" = "rzp_test_TD1HgphiKpFIZ8";
  "RAZORPAY_KEY_SECRET" = "GHTr1VKN38o9bKp6y0lV3oRa";
}

foreach ($key in $keys.Keys) {
  Write-Host "Adding $key to Vercel..."
  npx vercel env add $key production --value $keys[$key] --yes --force
  npx vercel env add $key preview --value $keys[$key] --yes --force
  npx vercel env add $key development --value $keys[$key] --yes --force
}
