// @ts-check

const { withPlausibleProxy } = require('next-plausible')

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = withPlausibleProxy({customDomain: "http://localhost:8000"})(nextConfig)