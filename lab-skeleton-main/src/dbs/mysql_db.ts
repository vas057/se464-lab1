import { Product } from "../compiled_proto/app";
import { IDatabase } from "../interfaces";
import { Category, Order, User, UserPatchRequest } from "../types";
import mysql from "mysql2/promise";

export default class MySqlDB implements IDatabase {
  connection: mysql.Connection;

  async init() {
    this.connection = await mysql.createConnection({
      host: process.env.RDS_HOSTNAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      port: parseInt(process.env.RDS_PORT), // Convert port to a number
      database: process.env.RDS_DATABASE,
    });
    console.log("MySQL connected!");
  }

  constructor() {
    this.init();
  }

  async queryProductById(productId) {
    return (
      await this.connection.query(`SELECT *
                                FROM products
                                WHERE id = "${productId}";`)
    )[0][0] as Product;
  }

  async queryRandomProduct() {
    ///TODO: Implement this
    // return this.connection.query('') as unknown as Product;
    return (
      await this.connection.query(
        "SELECT * FROM products ORDER BY RAND() LIMIT 1;"
      )
    )[0][0] as Product;
  }

  queryAllProducts = async (category?: string) => {
    ///TODO: Implement this
    // return this.connection.query("") as unknown as Product[];
    if (category) {
      return (
        await this.connection.query(
          `SELECT * FROM products WHERE category = "${category}";`
        )
      )[0] as Product[];
    } else {
      return (
        await this.connection.query("SELECT * FROM products;")
      )[0] as Product[];
    }
  };

  queryAllCategories = async () => {
    return (
      await this.connection.query("SELECT * FROM categories;")
    )[0] as Category[];
  };

  queryAllOrders = async () => {
    ///TODO: Implement this
    // return (await this.connection.query(""))[0] as Order[];
    return (await this.connection.query("SELECT * FROM orders;"))[0] as Order[];
  };

  async queryOrdersByUser(id: string) {
    ///TODO: Implement this
    // return (await this.connection.query(""))[0] as Order[]; // Not a perfect analog for NoSQL, since SQL cannot return a list.
    return (
      await this.connection.query(`SELECT *
                                FROM orders
                                WHERE userId = "${id}";`)
    )[0] as Order[];
  }

  queryOrderById = async (id: string) => {
    return (
      await this.connection.query(`SELECT *
                             FROM orders
                             WHERE id = "${id}"`)
    )[0][0];
  };

  queryUserById = async (id: string) => {
    return (
      await this.connection.query(`SELECT id, email, name
                             FROM users
                             WHERE id = "${id}";`)
    )[0][0];
  };

  queryAllUsers = async () => {
    return (
      await this.connection.query("SELECT id, name, email FROM users")
    )[0] as User[];
  };

  insertOrder = async (order: Order) => {
    await this.connection.query(
      `INSERT INTO orders (id, userId, products, totalAmount) VALUES (?, ?, ?, ?);`,
      [
        order.id,
        order.userId,
        JSON.stringify(order.products),
        order.totalAmount,
      ]
    );
  };

  updateUser = async (patch: UserPatchRequest) => {
    ///TODO: Implement this
    await this.connection.query(
      `UPDATE users SET email = ?, password = ? WHERE id = ?;`,
      [patch.email, patch.password, patch.id]
    );
  };

  // This is to delete the inserted order to avoid database data being contaminated also to make the data in database consistent with that in the json files so the comparison will return true.
  // Feel free to modify this based on your inserOrder implementation
  deleteOrder = async (id: string) => {
    await this.connection.query(`DELETE FROM order_items WHERE orderId = ?`, [
      id,
    ]);
    await this.connection.query(`DELETE FROM orders WHERE id = ?`, [id]);
  };
}
