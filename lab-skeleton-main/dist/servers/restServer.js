"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
let queryProductByIdRequests = 0;
let queryRandomProductRequests = 0;
let queryAllProductsRequests = 0;
let queryAllCategoriesRequests = 0;
let queryAllOrdersRequests = 0;
let queryOrderByIdRequests = 0;
let queryUserByIdRequests = 0;
let queryAllUsersRequests = 0;
let insertOrderRequests = 0;
let updateUserRequests = 0;
let deleteOrderRequests = 0;
let queryOrdersByUserRequests = 0;
class RestServer {
    constructor(db) {
        this.db = db;
        this.server = (0, express_1.default)();
    }
    start() {
        const port = 3000;
        this.server.use((0, cors_1.default)());
        this.server.use((0, morgan_1.default)("tiny"));
        this.server.use(body_parser_1.default.json());
        this.server.get("/", (req, res) => res.send("Hello, World!"));
        this.server.get("/product/:productId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            if (!productId) {
                res.status(400).send("No product id provided");
                return;
            }
            logger.info({
                message: 'Querying product by id',
                details: {
                    productId,
                    requestCount: ++queryProductByIdRequests
                }
            });
            const product = yield this.db.queryProductById(productId);
            res.send(product);
        })); // Gets a product by product id
        this.server.get("/randomproduct", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const randProd = yield this.db.queryRandomProduct();
            logger.info({
                message: 'Querying random product',
                details: {
                    requestCount: ++queryRandomProductRequests
                }
            });
            res.send(randProd);
        })); // I'm feeling lucky type
        this.server.get("/products", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { categoryId } = req.query;
            const products = yield this.db.queryAllProducts(categoryId);
            logger.info({
                message: 'Querying all products',
                details: {
                    categoryId: categoryId
                        ? categoryId
                        : 'all',
                    requestCount: ++queryAllProductsRequests
                }
            });
            res.send(products);
        })); // Gets all products, or by category
        this.server.get("/categories", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.db.queryAllCategories();
            logger.info({
                message: 'Querying all categories',
                details: {
                    requestCount: ++queryAllCategoriesRequests
                }
            });
            res.send(categories);
        })); // Gets all categories
        this.server.get("/allorders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.db.queryAllOrders();
            logger.info({
                message: 'Querying all orders',
                details: {
                    requestCount: ++queryAllOrdersRequests
                }
            });
            res.send(orders);
        })); // Gets all orders
        this.server.get("/orders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            if (!id) {
                res.status(400).send("No user id provided");
                return;
            }
            logger.info({
                message: 'Querying orders by user',
                details: {
                    userId: id,
                    requestCount: ++queryOrdersByUserRequests
                }
            });
            const orders = yield this.db.queryOrdersByUser(id);
            res.send(orders);
        })); // Gets all of a single user's orders
        this.server.get("/order/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(400).send("No order id provided");
                return;
            }
            logger.info({
                message: 'Querying order by id',
                details: {
                    id,
                    requestCount: ++queryOrderByIdRequests
                }
            });
            const order = yield this.db.queryOrderById(id);
            res.send(order);
        })); // Gets more details on a specific order by id
        this.server.get("/user/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(400).send("No user id provided");
                return;
            }
            logger.info({
                message: 'Querying user by id',
                details: {
                    id,
                    requestCount: ++queryUserByIdRequests
                }
            });
            const user = yield this.db.queryUserById(id);
            res.send(user);
        })); // Gets details on a specific user by username
        this.server.get("/users", (_req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.db.queryAllUsers();
            logger.info({
                message: 'Querying all users',
                details: {
                    requestCount: ++queryAllUsersRequests
                }
            });
            res.send(users);
        })); // Gets all users
        this.server.post("/orders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const order = req.body;
            const response = yield this.db.insertOrder(order);
            logger.info({
                message: 'Inserting order',
                details: {
                    order,
                    requestCount: ++insertOrderRequests
                }
            });
            res.send(response);
        })); // Creates a new order
        this.server.patch("/user/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const updates = req.body;
            const userId = req.params.id;
            const patch = Object.assign(Object.assign({}, updates), { id: userId });
            logger.info({
                message: 'Updating user',
                details: {
                    patch,
                    requestCount: ++updateUserRequests
                }
            });
            const response = yield this.db.updateUser(patch);
            res.send(response);
        })); // Updates a user's email or password
        this.server.delete("/order/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(400).send("No order id provided");
                return;
            }
            try {
                yield this.db.deleteOrder(id);
                logger.info({
                    message: 'Deleting order',
                    details: {
                        id,
                        requestCount: ++deleteOrderRequests
                    }
                });
                res.status(204).send(); // No Content
            }
            catch (error) {
                logger.info(`Error deleting order with id ${id}:`, error);
                console.error(`Error deleting order with id ${id}:`, error);
                res.status(500).send({ error: 'Failed to delete order' });
            }
        })); // Deletes an order by id
        this.server.listen(port, () => {
            logger.info(`REST server listening on port ${port}`);
            console.log(`REST server listening on port ${port}`);
        });
    }
}
exports.default = RestServer;
//# sourceMappingURL=restServer.js.map