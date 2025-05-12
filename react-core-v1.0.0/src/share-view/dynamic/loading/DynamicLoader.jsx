import React, { lazy, Suspense } from "react";
import { Box, Skeleton } from "@mui/material";

/**
 * Hàm tạo một component được load động với hiệu ứng Skeleton
 * @param {() => Promise<React.ComponentType>} importFunc - Hàm import dynamic
 */
export default function DynamicLoader(importFunc) {
  const LazyComponent = lazy(importFunc);

  const LoaderWrapper = (props) => (
    <Suspense
      fallback={
        <Box>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Box>
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );

  return LoaderWrapper;
}

// Cách sử dụng

// MyComponent.jsx
// import React from "react";
// import { Paper, Typography } from "@mui/material";

// const MyComponent = () => {
//   return (
//     <Paper elevation={3} sx={{ p: 2 }}>
//       <Typography variant="h6">Đây là MyComponent</Typography>
//       <Typography>Nội dung đã load xong.</Typography>
//     </Paper>
//   );
// };

// export default MyComponent;

// App.jsx
// import React from "react";
// import DynamicLoader from "./DynamicLoader";

// const MyComponent = DynamicLoader(() => import("./MyComponent"));

// const App = () => {
//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Demo Dynamic Loading Skeleton</h2>
//       <MyComponent />
//     </div>
//   );
// };

// export default App;
