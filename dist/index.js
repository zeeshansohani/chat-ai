import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
const PORT = process.env.PORT;
// server listener
connectToDatabase()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT} and connected to database`);
    });
})
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map