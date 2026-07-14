import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@sentry/nextjs"]
  }
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "elitehub",
  project: "elitehub",
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
