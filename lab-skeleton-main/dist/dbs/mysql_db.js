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
const promise_1 = __importDefault(require("mysql2/promise"));
class MySqlDB {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield promise_1.default.createConnection({
                host: process.env.RDS_HOSTNAME,
                user: process.env.RDS_USERNAME,
                password: process.env.RDS_PASSWORD,
                port: parseInt(process.env.RDS_PORT), // Convert port to a number
                database: process.env.RDS_DATABASE,
            });
            console.log("MySQL connected!");
        });
    }
    constructor() {
        this.queryAllProducts = (category) => __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this
            // return this.connection.query("") as unknown as Product[];
            if (category) {
                return (yield this.connection.query(`SELECT * FROM products WHERE category = "${category}";`))[0];
            }
            else {
                return (yield this.connection.query("SELECT * FROM products;"))[0];
            }
        });
        this.queryAllCategories = () => __awaiter(this, void 0, void 0, function* () {
            return (yield this.connection.query("SELECT * FROM categories;"))[0];
        });
        this.queryAllOrders = () => __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this
            // return (await this.connection.query(""))[0] as Order[];
            return (yield this.connection.query("SELECT * FROM orders;"))[0];
        });
        this.queryOrderById = (id) => __awaiter(this, void 0, void 0, function* () {
            return (yield this.connection.query(`SELECT *
                             FROM orders
                             WHERE id = "${id}"`))[0][0];
        });
        this.queryUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            return (yield this.connection.query(`SELECT id, email, name
                             FROM users
                             WHERE id = "${id}";`))[0][0];
        });
        this.queryAllUsers = () => __awaiter(this, void 0, void 0, function* () {
            return (yield this.connection.query("SELECT id, name, email FROM users"))[0];
        });
        this.insertOrder = (order) => __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this
            // return this.connection.query(
            //   `INSERT INTO orders (id, userId, products, totalAmount) VALUES (?, ?, ?, ?);`,
            //   [
            //     order.id,
            //     order.userId,
            //     JSON.stringify(order.products),
            //     order.totalAmount,
            //   ]
            // );
        });
        this.updateUser = (patch) => __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this
            // return this.connection.query(
            //   `UPDATE users SET email = ?, password = ? WHERE id = ?;`,
            //   [patch.email, patch.password, patch.id]
            // );
        });
        // This is to delete the inserted order to avoid database data being contaminated also to make the data in database consistent with that in the json files so the comparison will return true.
        // Feel free to modify this based on your inserOrder implementation
        this.deleteOrder = (id) => __awaiter(this, void 0, void 0, function* () {
            yield this.connection.query(`DELETE FROM order_items WHERE orderId = ?`, [
                id,
            ]);
            yield this.connection.query(`DELETE FROM orders WHERE id = ?`, [id]);
        });
        this.init();
    }
    queryProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.connection.query(`SELECT *
                                FROM products
                                WHERE id = "${productId}";`))[0][0];
        });
    }
    queryRandomProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this
            // return this.connection.query('') as unknown as Product;
            return (yield this.connection.query("SELECT * FROM products ORDER BY RAND() LIMIT 1;"))[0][0];
        });
    }
    queryOrdersByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this
            // return (await this.connection.query(""))[0] as Order[]; // Not a perfect analog for NoSQL, since SQL cannot return a list.
            return (yield this.connection.query(`SELECT *
                                FROM orders
                                WHERE userId = "${id}";`))[0];
        });
    }
}
exports.default = MySqlDB;
//# sourceMappingURL=mysql_db.js.map