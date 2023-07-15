import { Metadata } from 'next';
import React from 'react';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const NotFound: React.FC = async () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User not found</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default NotFound;
