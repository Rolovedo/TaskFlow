const config = {
  apiUrl: process.env.REACT_APP_API_URL || 
          (process.env.NODE_ENV === 'production' 
            ? 'https://task-flow-f0izl64gi-acevedos-projects.vercel.app/api'
            : 'http://localhost:4000/api')
};

export default config;
