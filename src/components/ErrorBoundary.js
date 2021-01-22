import React from "react";
import { ErrorBoundary as ReactErrorBoundry } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

export const ErrorBoundary = ({ children, ...props }) => (
  <ReactErrorBoundry FallbackComponent={ErrorFallback} {...props}>
    {children}
  </ReactErrorBoundry>
);
