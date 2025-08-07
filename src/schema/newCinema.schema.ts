import { z } from 'zod'

export const seatConfigurationSchema = z.object({
    rows: z.array(z.string()),
    totalSeats: z.number()
})

export const CinemaRequest = z.object({
    name: z.string().min(3),
    location: z.string().min(3),
    screenType: z.string(),
    numberOfSeats: z.number().min(10),
    seatConfiguration: seatConfigurationSchema,
    features: z.array(z.string())
})