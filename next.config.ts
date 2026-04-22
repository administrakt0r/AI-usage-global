import createMDX from '@next/mdx'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true
  }
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/
})

export default withMDX(nextConfig)
