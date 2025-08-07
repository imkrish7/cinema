import { Router, type Request, type Response } from "express";
import { CinemaRequest } from "../../schema/newCinema.schema.ts";
import { prisma } from "../../config/db.ts";


const router = Router()

router.post("/new", async (req: Request, res: Response) => {
    try {
        const validatedData = CinemaRequest.safeParse(req.body);

        if (validatedData.error) {
            return res.status(400).json({error: "Invalid request"})
        }

        const { name, location, screenType, features, seatConfiguration, numberOfSeats } = validatedData.data;
        const { rows, totalSeats } = seatConfiguration;
        const cinema = await prisma.cinema.create({
            data: {
                name,
                location,
                screenType,
                features,
                seatConfiguration,
                numberOfSeats,
                seats: {
                    create: Array.from({length: rows.length}, (_, i)=> Array.from({length: totalSeats}, (_, j)=>({seatNumber: j+1, row: rows[i]})))
                },
            },
            include: {seats: true}
        })

        return res.status(201).json({
            message: "New cinema created", data: {
            cinemaId: cinema.id
        }})
    } catch (error) {
        return res.status(500).json({error: "Internal server error!"})
    }
})