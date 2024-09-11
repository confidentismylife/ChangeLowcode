import React from 'react';

declare function test({ text, id }: {
    text: string;
    id: number;
}): React.JSX.Element;

declare function two(): React.JSX.Element;

export { test as Test, two as Two };
