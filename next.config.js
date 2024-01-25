/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/ghost717/",
        permanent: true,
      }
      // ,
      // {
      //   source: "/deploy",
      //   destination: "https://jwba.pl",
      //   permanent: true,
      // },
    ];
  },
  env: {
    REACT_APP_ASSISTANT_ID: process.env.REACT_APP_ASSISTANT_ID,
  },
};

module.exports = nextConfig;