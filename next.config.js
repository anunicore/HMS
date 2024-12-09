/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https", // Chỉ cho phép ảnh từ giao thức HTTPS
          hostname: "res.cloudinary.com", // Định nghĩa hostname
          pathname: "/**", // Cho phép tất cả các đường dẫn dưới hostname này
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  