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
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoDB {
    constructor() {
        const client = new client_dynamodb_1.DynamoDBClient({ region: process.env.AWS_REGION });
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
        console.log("DynamoDB connected!");
    }
    queryRandomProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this--replace the line below
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Products",
            });
            const response = yield this.docClient.send(command);
            const products = response.Items;
            const randomIndex = Math.floor(Math.random() * products.length);
            return products[randomIndex];
        });
    }
    queryProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.GetCommand({
                TableName: "Products",
                Key: {
                    id: productId,
                },
            });
            const response = yield this.docClient.send(command);
            return response.Item;
        });
    }
    queryAllProducts(category) {
        return __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this--replace the line below
            if (category) {
                const command = new lib_dynamodb_1.ScanCommand({
                    TableName: "Products",
                    FilterExpression: "category = :category",
                    ExpressionAttributeValues: {
                        ":category": category,
                    },
                });
                const response = yield this.docClient.send(command);
                return response.Items;
            }
            else {
                const command = new lib_dynamodb_1.ScanCommand({
                    TableName: "Products",
                });
                const response = yield this.docClient.send(command);
                return response.Items;
            }
        });
    }
    queryAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Categories",
            });
            const response = yield this.docClient.send(command);
            return response.Items;
        });
    }
    queryAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Orders",
                FilterExpression: 'size(products) > :zero',
                ExpressionAttributeValues: {
                    ':zero': 0,
                },
            });
            const response = yield this.docClient.send(command);
            return response.Items;
        });
    }
    queryOrdersByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Orders",
                FilterExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": userId,
                },
            });
            console.log("eeeeeee");
            const response = yield this.docClient.send(command);
            return response.Items;
        });
    }
    queryOrderById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.GetCommand({
                TableName: "Orders",
                Key: {
                    id: userId,
                },
            });
            const response = yield this.docClient.send(command);
            return response.Item;
        });
    }
    queryUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.GetCommand({
                TableName: "Users",
                Key: {
                    id: userId,
                },
                ProjectionExpression: "id, #n, email",
                ExpressionAttributeNames: { "#n": "name" },
            });
            const response = yield this.docClient.send(command);
            return response.Item;
        });
    }
    queryAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: "Users",
                ProjectionExpression: "id, #n, email",
                ExpressionAttributeNames: { "#n": "name" },
            });
            const response = yield this.docClient.send(command);
            return response.Items;
        });
    }
    insertOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this--replace the line below. Make sure the deleteOrder is called after insertOrder. You can use "await".
            const command = new lib_dynamodb_1.PutCommand({
                TableName: "Orders",
                Item: order,
            });
            yield this.docClient.send(command);
        });
    }
    updateUser(patch) {
        return __awaiter(this, void 0, void 0, function* () {
            ///TODO: Implement this--replace the line below
            const command = new lib_dynamodb_1.UpdateCommand({
                TableName: "Users",
                Key: {
                    id: patch.id,
                },
                UpdateExpression: "SET password = :p",
                ExpressionAttributeValues: {
                    ":p": patch.password,
                },
            });
            yield this.docClient.send(command);
        });
    }
    // This is to delete the inserted order to avoid database data being contaminated also to make the data in database consistent with that in the json files so the comparison will return true.
    // Feel free to modify this based on your inserOrder implementation
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new lib_dynamodb_1.DeleteCommand({
                TableName: "Orders",
                Key: {
                    id: id,
                },
            });
            yield this.docClient.send(command);
        });
    }
}
exports.default = DynamoDB;
//# sourceMappingURL=dynamo_db.js.map