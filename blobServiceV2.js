const { BlobServiceClient } = require('@azure/storage-blob');


class BlobService {
    containerClient;
    constructor(connectionString) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            connectionString
        );
        this.containerClient = blobServiceClient.getContainerClient("user-data");
    }

    // Convert stream to text
    async streamToText(readable) {
        readable.setEncoding('utf8');
        let data = '';
        for await (const chunk of readable) {
            data += chunk;
        }
        return data;
    }

    async createUser(userId) {
        const blockBlobClient = this.containerClient.getBlockBlobClient(`${userId}/data.json`);
        if (await blockBlobClient.exists()) {
            const data = await blockBlobClient.download();
            const textData = await this.streamToText(data.readableStreamBody);
            console.log(JSON.parse(textData));
            return JSON.parse(textData);
        }
        else {
            const data = { id: userId, visuals: [], snapshots: [] };
            await blockBlobClient.upload(JSON.stringify(data), JSON.stringify(data).length);
            return data;
        }
    };

    async getSnapshot(snapshotId, userId) {
        const blockBlobClient = this.containerClient.getBlockBlobClient(`${userId}/snapshots/${snapshotId}.json`);
        const data = await blockBlobClient.download();
        const textData = await this.streamToText(data.readableStreamBody);
        console.log(JSON.parse(textData));
        return JSON.parse(textData);
    }

    async getVisual(visualId, userId) {
        const blockBlobClient = this.containerClient.getBlockBlobClient(`${userId}/visuals/${visualId}.json`);
        const data = await blockBlobClient.download();
        const textData = await this.streamToText(data.readableStreamBody);
        console.log(JSON.parse(textData));
        return JSON.parse(textData);
    }
    async createVizdata(data, userData) {
        const blobName = data.id;
        userData.visuals.push(data.id);
        const blockBlobClient = this.containerClient.getBlockBlobClient(`${userData.id}/visuals/${blobName}.json`);
        const uploadBlobResponse = await blockBlobClient.upload(JSON.stringify(data), JSON.stringify(data).length);
        await this.updateUserData(userData);
    };

    async createSnapdata(data, userData) {
        const blobName = data.id;
        userData.snapshots.push(data.id);
        const blockBlobClient = this.containerClient.getBlockBlobClient(`${userData.id}/snapshots/${blobName}.json`);
        const uploadBlobResponse = await blockBlobClient.upload(JSON.stringify(data), JSON.stringify(data).length);
        await this.updateUserData(userData);
    };

    async updateUserData(data) {
        const blockBlobClient = this.containerClient.getBlockBlobClient(`${data.id}/data.json`);
        await blockBlobClient.upload(JSON.stringify(data), JSON.stringify(data).length);
        return data;
    };

    async updateVizData(userData) {
        const blockBlobClient = this.containerClient.getBlockBlobClient(`${userData.id}/${blobName}.json`);
        const uploadBlobResponse = await blockBlobClient.upload(JSON.stringify(data), JSON.stringify(data).length);
    }; 
}

exports.BlobService = BlobService;