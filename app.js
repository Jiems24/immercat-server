// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
const { connectDB } = require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// Each time a request is made, ensure DB is connected
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (e) {
        next(e);
    }
});

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

app.use("/api", require("./routes/property.routes"));

app.use("/api", require("./routes/clientlead.routes"));

app.use("/api", require("./routes/owner.routes"));

app.use("/public", require("./routes/public.routes"));

app.use("/api", require("./routes/agency.routes"));

app.use("/api", require("./routes/ai.routes"));

app.use("/api", require("./routes/linkednote.routes"));

app.use("/api", require("./routes/stats.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
