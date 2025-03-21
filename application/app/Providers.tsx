import { PropsWithChildren } from 'react';

import { SWRConfig } from 'swr';

type ProvidersProps = PropsWithChildren;

export default function Providers({ children }: ProvidersProps) {
	return <SWRConfig>{children}</SWRConfig>;
}
