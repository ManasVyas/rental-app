import App from "./libs/app";
import { AllowCrossDomain } from "./middlewares/cors";
import { ErrorHandler } from "./middlewares/errorhandler";
import { AddUserId } from "./middlewares/system";

import { UserRouter } from "./routes/user";
import { ProductRouter } from "./routes/product";
import { CategoryRouter } from "./routes/category";
import { OrderRouter } from "./routes/order";
import { LocationRouter } from "./routes/location";
import { PhoneRouter } from "./routes/phone";

const PORT = process.env.PORT || "8080";

App.server.use(AllowCrossDomain);
App.server.use(AddUserId);

App.server.use("/user", UserRouter);
App.server.use("/product", ProductRouter);
App.server.use("/category", CategoryRouter);
App.server.use("/order", OrderRouter);
App.server.use("/location", LocationRouter);
App.server.use("/phone", PhoneRouter);

App.server.use(AllowCrossDomain);
App.server.use(ErrorHandler);

App.start(PORT);
