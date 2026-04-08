import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import availabilityRoutes from './routes/availability.routes.js';
import bookingLinkRoutes from './routes/bookingLink.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import usersRoutes from './routes/users.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();


app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
  }));


app.use("/api/auth", authRouter);
app.use("/api/availability", availabilityRoutes);
app.use("/api/booking-link", bookingLinkRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    if (res.headersSent) return next(err);
    res.status(500).json({ message: "Internal server error" });
});

export default app;