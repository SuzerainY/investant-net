import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BlogRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [router]);

    return null;
}

export async function getServerSideProps({ res }) {
    res.setHeader('Location', '/');
    res.statusCode = 308;
    res.end();

    return { props: {} };
};