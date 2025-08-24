import React, { createContext, useState, useEffect } from "react";

type ImageGenerationStatus = "pre-generating" | "generating" | "completed" | "error";

interface TrendOffContextType {
    todayPrompt: string;
    productIds: string[];
    setProductIds: (ids: string[]) => void;
    imageGenerationStatus: ImageGenerationStatus;
    setImageGenerationStatus: (status: ImageGenerationStatus) => void;
    // potential future additions: canvas_src, generated_img_src, 
}

export const TrendOffContext = createContext<TrendOffContextType>({
    todayPrompt: "",
    productIds: [],
    setProductIds: () => {},
    imageGenerationStatus: "pre-generating",
    setImageGenerationStatus: () => {},
});

export const TrendOffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [todayPrompt, setTodayPrompt] = useState<string>("");
    const [productIds, setProductIds] = useState<string[]>([]);
    const [imageGenerationStatus, setImageGenerationStatus] = useState<ImageGenerationStatus>("pre-generating");

    useEffect(() => {
        const getPrompt = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_TREND_OFF_ENDPOINT}/api/getPrompt`);
                const { data } = await response.json();
                setTodayPrompt(data.prompt || "");
            } catch (error) {
                console.error('Error fetching prompt:', error);
            }
        };
        getPrompt();
    }, []);

    return (
        <TrendOffContext.Provider value={{ todayPrompt, productIds, setProductIds, imageGenerationStatus, setImageGenerationStatus}}>
            {children}
        </TrendOffContext.Provider>
    );
};