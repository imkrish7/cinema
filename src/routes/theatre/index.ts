import { Router, type Request, type Response } from "express";
import { CinemaRequest } from "../../schema/newCinema.schema.ts";
import { prisma } from "../../config/db.ts";
import type { Seat } from "../../types/seat.ts";

const router = Router()

router.post("/new", async (req: Request, res: Response) => {
    try {
        const validatedData = CinemaRequest.safeParse(req.body);
        
        if (validatedData.error) {
            return res.status(400).json({error: "Invalid request"})
        }

        const { name, location, screenType, features, seatConfiguration, numberOfSeats } = validatedData.data;
        const { rows, totalSeats } = seatConfiguration;

        if (!rows || !totalSeats) {
            return res.status(400).json({error: "Please provide a valid seat configuration"})
        }

        let tempSeats = numberOfSeats;
        const rowSeats = [];
        for (let i = 0; i < rows.length; i++){
            if (totalSeats > tempSeats) {
                rowSeats.push(tempSeats);
            } else {
                rowSeats.push(totalSeats)
                tempSeats -= totalSeats;
            }

        }
        
        let seatList: Seat[] = [];
        
        for (let row in rows) {
            seatList = [...seatList, ...Array.from({ length: rowSeats[row]! }, (_, j) => ({ seatNumber: j + 1, row: rows[row]! }))]
            tempSeats -= totalSeats;
        }
        const cinema = await prisma.cinema.create({
            data: {
                name,
                location,
                screenType,
                features,
                seatConfiguration,
                numberOfSeats,
                seats: {
                    create: seatList
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

export {
    router
}