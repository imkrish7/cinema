import { Router, type Request, type Response } from "express";
import { prisma, type PrismaTransactionClient } from "../../config/db.ts";



const router = Router({ strict: true, caseSensitive: true, mergeParams: true })


router.post("/:cinemaId/purchase/consecutive", async (req: Request, res: Response) => {
    try {
        const cinemaId = req.params.cinemaId;
        if (!cinemaId) {
            throw new Error("No cinema found!");
        }
        const booking = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
            const seats = await tx.seat.findMany({
                where: { cinemaId },
                orderBy: [{ row: "asc" } , { seatNumber: "asc",}]
            });

            for (let i = 0; i < seats.length; i++){
                const [first, second] = [seats[i], seats[i + 1]]
                
                if (!first.isBooked && !second.isBooked && first.row == second.row && second.seatNumber == first.seatNumber + 1) {
                    const updated = await tx.seat.updateMany({
                        where: {
                            id: { in: [first.id, second.id] },
                            isBooked: false
                        },
                        data: {isBooked: true}
                    })

                    first.isBooked = true;
                    second.isBooked = true;

                    if (updated.count == 2) {
                        return [first, second]
                    }
                }
            }
        })

        return res.status(200).json({data: booking})
    } catch (error) {
        return res.status(500).json({ error: "Internal server error"})
    }
})



router.post("/:cinemaId/purchase/:seatNumber", async (req: Request, res: Response) => {
    try {

        const cinemaId = req.params.cinemaId;
        const seat = req.params.seatNumber?.split("");
        if (seat == undefined || seat.length != 2) {
            return res.status(400).json({error: "Invalid seat number"})
        }

        const [seatNumber, row] = seat;

        const bookedSeat = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
            const newSeatBook = await tx.seat.findFirst({
                where: { cinemaId, row, seatNumber: parseInt(seatNumber!) }
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
        if (error instanceof Error) {
            return res.status(400).json({error: error.message})
        }
        return res.status(500).json({ error: "Internal server error" })
    }
})

export {
    router
}

// nodemon --watch 'src/**/*.ts' --exec node --trace-warnings --experimental-loader ts-node/esm --inspect 