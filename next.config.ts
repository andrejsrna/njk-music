import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'admin.nocopyrightgamingmusic.com', pathname: '**' },
      { protocol: 'http', hostname: 'admin.nocopyrightgamingmusic.com', pathname: '**' },
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '**' },
      { protocol: 'https', hostname: 'localhost', port: '1337', pathname: '**' },
      { protocol: 'https', hostname: 'cdn.nocopyrightgamingmusic.com', pathname: '**' },
      { protocol: 'https', hostname: 'cdn.fitdoplnky.sk', pathname: '**' },
      { protocol: 'https', hostname: 'cdn.najsilnejsiaklbovavyziva.sk', pathname: '**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '**' },
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '**' },
      { protocol: 'https', hostname: 's3.amazonaws.com', pathname: '**' },
      { protocol: 'https', hostname: 'geo-media.beatport.com', pathname: '**' },
    ],
    unoptimized: false,
  },
  //output: "export",

};


export default nextConfig;
