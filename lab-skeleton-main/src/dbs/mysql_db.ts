import { Product } from "../compiled_proto/app";
import { IDatabase } from "../interfaces";
import { Category, Order, OrderItem, User, UserPatchRequest } from "../types";
import { randomUUID } from "crypto";
import mysql from "mysql2/promise";
import logger from "../logger";

let queryProductByIdRequests = 0;
let queryRandomProductRequests = 0;
let queryAllProductsRequests = 0;
let queryAllCategoriesRequests = 0;
let queryAllOrdersRequests = 0;
let queryOrdersByUserRequests = 0;
let queryOrderByIdRequests = 0;
let queryUserByIdRequests = 0;
let queryAllUsersRequests = 0;
let insertOrderRequests = 0;
let updateUserRequests = 0;
let deleteOrderRequests = 0;

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
    logger.info("MySQL connected!");
  }

  constructor() {
    this.init();
  }

  async queryProductById(productId) {
    logger.info({
      message: "queryProductById",
      details: {
        productId: productId,
        requests: ++queryProductByIdRequests,
      },
    })
    return (
      await this.connection.query(`SELECT *
                                FROM products
                                WHERE id = "${productId}";`)
    )[0][0] as Product;
  }

  async queryRandomProduct() {
    ///TODO: Implement this
    logger.info({
      message: "queryRandomProduct",
      details: {
        requests: ++queryRandomProductRequests,
      },
    })
    return (
      await this.connection.query(
        "SELECT * FROM products ORDER BY RAND() LIMIT 1;"
      )
    )[0][0] as Product;
  }

  queryAllProducts = async (category?: string) => {
    ///TODO: Implement this
    // return this.connection.query("") as unknown as Product[];
    logger.info({
      message: "queryAllProducts",
      details: {
        category: category,
        requests: ++queryAllProductsRequests,
      },
    })
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
    logger.info({
      message: "queryAllCategories",
      details: {
        requests: ++queryAllCategoriesRequests,
      },
    })
    return (
      await this.connection.query("SELECT * FROM categories;")
    )[0] as Category[];
  };

  queryAllOrders = async () => {
    ///TODO: Implement this
    logger.info({
      message: "queryAllOrders",
      details: {
        requests: ++queryAllOrdersRequests,
      },
    })
    const orders: Order[] = (await this.connection.query("SELECT * from orders"))[0] as Order[];
    const items: OrderItem[] = (await this.connection.query("SELECT * FROM order_items"))[0] as OrderItem[];

    const map = new Map<string, Order>();
    for (const order of orders) {
      map.set(order.id, order);
      order.products = [];
    }

    for (const item of items) {
      const order = map.get(item.orderId);
      if (order) {
        order.products.push({productId: item.productId, quantity: item.quantity});
      }
    }

    return orders.filter(order => order.products.length > 0);
  };

  async queryOrdersByUser(id: string) {
    ///TODO: Implement this
    // return (await this.connection.query(""))[0] as Order[]; // Not a perfect analog for NoSQL, since SQL cannot return a list.
    logger.info({
      message: "queryOrdersByUser",
      details: {
        id: id,
        requests: ++queryOrdersByUserRequests,
      },
    })
    return (
      await this.connection.query(`SELECT *
                                FROM orders
                                WHERE userId = "${id}";`)
    )[0] as Order[];
  }

  queryOrderById = async (id: string) => {
    logger.info({
      message: "queryOrderById",
      details: {
        id: id,
        requests: ++queryOrderByIdRequests,
      },
    })
    return (
      await this.connection.query(`SELECT *
                             FROM orders
                             WHERE id = "${id}"`)
    )[0][0];
  };

  queryUserById = async (id: string) => {
    logger.info({
      message: "queryUserById",
      details: {
        id: id,
        requests: ++queryUserByIdRequests,
      },
    })
    return (
      await this.connection.query(`SELECT id, email, name
                             FROM users
                             WHERE id = "${id}";`)
    )[0][0];
  };

  queryAllUsers = async () => {
    logger.info({
      message: "queryAllUsers",
      details: {
        requests: ++queryAllUsersRequests,
      },
    })
    return (
      await this.connection.query("SELECT id, name, email FROM users")
    )[0] as User[];
  };

  insertOrder = async (order: Order) => {
    logger.info({
      message: "insertOrder",
      details: {
        order: order,
        requests: ++insertOrderRequests,
      },
    })
    await this.connection.query(
      `INSERT INTO orders (id, userId, totalAmount) VALUES (?, ?, ?);`,
      [order.id, order.userId, order.totalAmount]
    );

    for (const item of order.products) {
      await this.connection.query(
        `INSERT INTO order_items (id, orderId, productId, quantity) VALUES (?, ?, ?, ?);`,
        [randomUUID(), order.id, item.productId, item.quantity]
      );
    }
  };

  updateUser = async (patch: UserPatchRequest) => {
    ///TODO: Implement this
    logger.info({
      message: "updateUser",
      details: {
        patch: patch,
        requests: ++updateUserRequests,
      },
    })
    await this.connection.query(
      `UPDATE users SET email = ?, password = ? WHERE id = ?;`,
      [patch.email, patch.password, patch.id]
    );
  };

  // This is to delete the inserted order to avoid database data being contaminated also to make the data in database consistent with that in the json files so the comparison will return true.
  // Feel free to modify this based on your inserOrder implementation
  deleteOrder = async (id: string) => {
    logger.info({
      message: "deleteOrder",
      details: {
        id: id,
        requests: ++deleteOrderRequests,
      },
    })
    await this.connection.query(`DELETE FROM order_items WHERE orderId = ?`, [
      id,
    ]);
    await this.connection.query(`DELETE FROM orders WHERE id = ?`, [id]);
  };
}
