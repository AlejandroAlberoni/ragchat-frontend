import { create } from 'zustand';

type ProcessingIdState = {
    processingId: string | null,
    setProcessingId: (id: string | null) => void,
}

export const useProcessingId = create<ProcessingIdState>((set) => ({
    processingId: null,
    setProcessingId: (id) => set({ processingId: id})
}))