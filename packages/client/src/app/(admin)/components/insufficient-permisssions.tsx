import React from 'react';

export const InsufficientPermissions: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">
        Insufficient permissions
      </h2>
      <p className="text-muted-foreground">
        You are not allowed to access this page
      </p>
    </div>
  );
};
