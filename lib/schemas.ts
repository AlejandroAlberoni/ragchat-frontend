import * as z from 'zod';

export interface Curriculum {
    _id: string;
    name: string | undefined;
    text: string | undefined;
    processed: string | undefined;
    created_at: Date;
    active: boolean;
}

export const EditDtoSchema = z.object({
    parentId: z.string(),
    name: z.string().optional(),
    text: z.string().optional(),
    processed: z.string().optional(),
});

export type EditDto = z.infer<typeof EditDtoSchema>;