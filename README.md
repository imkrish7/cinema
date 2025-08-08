# Cinema ticket bookings

### Assumption
Code is implemented for theatre creation and seat booking; user creation and holding user seats are not involved.

## How to run
### Create a `.env` file in the root directory with the below-mentioned values
  ```env
  DATABASE_URL=xxxxx
  PORT=5000
  ```

### Then install dependencies
Navigate to the directory and then execute the command
```cmd 
npm install
```

### Then run in dev mode
Navigate to the directory and then execute the command
```cmd 
npm run dev
```

## Endpoints
### POST `/cinema/new`
```javascript
const seatConfigurationSchema = {
    rows: string[],
    totalSeats: number // per row
}

const CinemaRequest = {
    name: string,
    location: string,
    screenType: string,
    numberOfSeats: number,
    seatConfiguration: seatConfigurationSchema,
    features: string[]
}
```

### POST `/cinema/:cinemaId/purchase/:seatNumber`
```javascript
  seatNumber // it should be like 1A, 1B
  cinemaId: string // uuid
```
### POST `/cinema/:cinemaId/purchase/consecutive`
It will book the first two available consecutive seats
