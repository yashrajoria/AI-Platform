"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("14d1a1bc-4375-4c60-acc8-9d2a55aefdef");
    }, []);

    return null;
};