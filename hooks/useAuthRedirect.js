/** @format */

// hooks/useTokenChecker.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useTokenChecker() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        }
    }, []);
}
