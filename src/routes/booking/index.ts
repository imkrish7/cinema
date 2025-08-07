import { Router, type Request, type Response } from "express";
import { prisma } from "../../config/db.ts";


const router = Router()

router.post("/:cinemaId/purchase/:seatNumber", async (req: Request, res: Response) => {
    try {

        const cinemaId = req.params.cinemaId;
        const seat = req.params.seatNumber?.split("");

        if (!!seat && seat.length == 2) {
            return res.status(400).json({error: "Invalid seat number"})
        }

        const bookedSeat = await prisma.$transaction(async (tx) => {
            const newSeatBook = await tx.seat.findFirst({
                where: { cinemaId, row, seatNumber },
                lock: {mode: 'PESSIMISTIC_WRITE'}
            })

            if (!newSeatBook) {
                throw new Error("Seat is not found")
            }

            if (newSeatBook.isBooked) {
                throw new Error("Seat is not available")
            }

            return await tx.seat.update({
                where: { id: newSeatBook.id },
                data: { isBooked: true}
            })

        })

        return res.status(200).json({data: bookedSeat})
        
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
})

router.post("/:cinemaId/purchase/consecutive", async (req: Request, res: Response) => {
    
})