'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/shell';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.replace('/login');
			return;
		}

		setReady(true);
	}, [router]);

	if (!ready) {
		return null;
	}

	return <Shell>{children}</Shell>;
}
