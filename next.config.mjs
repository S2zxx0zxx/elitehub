import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "elitehub",
  project: "elitehub",
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
