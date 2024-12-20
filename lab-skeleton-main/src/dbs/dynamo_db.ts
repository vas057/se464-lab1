import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IDatabase } from "../interfaces";
import {
  GetCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Category, Order, Product, User, UserPatchRequest } from "../types";

export default class DynamoDB implements IDatabase {
  docClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.docClient = DynamoDBDocumentClient.from(client);
    console.log("DynamoDB connected!");
  }

  async queryRandomProduct() {
    ///TODO: Implement this--replace the line below
    const command = new ScanCommand({
      TableName: "Products",
    });

    const response = await this.docClient.send(command);
    const products = response.Items as Product[];
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
  }

  async queryProductById(productId: string) {
    const command = new GetCommand({
      TableName: "Products",
      Key: {
        id: productId,
      },
    });

    const response = await this.docClient.send(command);
    return response.Item as Product;
  }

  async queryAllProducts(category?: string) {
    ///TODO: Implement this--replace the line below
    if (category) {
      const command = new ScanCommand({
        TableName: "Products",
        FilterExpression: "category = :category",
        ExpressionAttributeValues: {
          ":category": category,
        },
      });

      const response = await this.docClient.send(command);
      return response.Items as Product[];
    } else {
      const command = new ScanCommand({
        TableName: "Products",
      });

      const response = await this.docClient.send(command);
      return response.Items as Product[];
    }
  }

  async queryAllCategories() {
    const command = new ScanCommand({
      TableName: "Categories",
    });

    const response = await this.docClient.send(command);
    return response.Items as Category[];
  }

  async queryAllOrders() {

    const command = new ScanCommand({
    TableName: "Orders",
    FilterExpression: 'size(products) > :zero',
    ExpressionAttributeValues: {
      ':zero': 0,
    },
  });
    const response = await this.docClient.send(command);
    return response.Items as Order[];
  }

  async queryOrdersByUser(userId) {
    const command = new ScanCommand({
      TableName: "Orders",
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });
	console.log("eeeeeee")
    const response = await this.docClient.send(command);
    return response.Items as Order[];
  }

  async queryOrderById(userId) {
    const command = new GetCommand({
      TableName: "Orders",
      Key: {
        id: userId,
      },
    });

    const response = await this.docClient.send(command);
    return response.Item as Order;
  }

  async queryUserById(userId) {
    const command = new GetCommand({
      TableName: "Users",
      Key: {
        id: userId,
      },
      ProjectionExpression: "id, #n, email",
      ExpressionAttributeNames: { "#n": "name" },
    });

    const response = await this.docClient.send(command);
    return response.Item as User;
  }

  async queryAllUsers() {
    const command = new ScanCommand({
      TableName: "Users",
      ProjectionExpression: "id, #n, email",
      ExpressionAttributeNames: { "#n": "name" },
    });

    const response = await this.docClient.send(command);
    return response.Items as User[];
  }

  async insertOrder(order: Order): Promise<void> {
    ///TODO: Implement this--replace the line below. Make sure the deleteOrder is called after insertOrder. You can use "await".
    const command = new PutCommand({
      TableName: "Orders",
      Item: order,
    });
    await this.docClient.send(command);
  }

  async updateUser(patch: UserPatchRequest): Promise<void> {
    ///TODO: Implement this--replace the line below
    const command = new UpdateCommand({
      TableName: "Users",
      Key: {
        id: patch.id,
      },
      UpdateExpression: "SET password = :p",
      ExpressionAttributeValues: {
        ":p": patch.password,
      },
    });

    await this.docClient.send(command);
  }

  // This is to delete the inserted order to avoid database data being contaminated also to make the data in database consistent with that in the json files so the comparison will return true.
  // Feel free to modify this based on your inserOrder implementation
  async deleteOrder(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: "Orders",
      Key: {
        id: id,
      },
    });
    await this.docClient.send(command);
  }
}
