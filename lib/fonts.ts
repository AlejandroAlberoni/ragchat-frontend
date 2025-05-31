import { Roboto, Roboto_Condensed } from 'next/font/google';

export const roboto = Roboto({
    subsets: ['latin'],
    weight: ["400"]
})

export const roboto_condensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ["300", "600"]
})
