const config = {
  apiUrl: process.env.REACT_APP_API_URL || 
          (process.env.NODE_ENV === 'production' 
            ? 'https://task-flow-a9wzhp4jo-acevedos-projects.vercel.app/api'
            : 'http://localhost:4000/api')
};

export default config;
