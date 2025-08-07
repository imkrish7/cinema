import { z } from "zod"

export const TicketSchema = z.object({
    seatNumber: z.string().min(2).max(2),
    
})