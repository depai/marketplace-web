import { connect, connection } from 'mongoose';

class Connection {
    static async connectDB(url: string) {
        console.log(url);
        if (url !== '') {
            await this.connectMongoose(url);
        }
    }

    static async connectMongoose(url: string) {
        await connect(
            url,
            { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true },
        );
        connection.on('error', () => {
            console.error(`Mongo Db connection error-URL:${url}`);
            process.exit(1);
        });
        console.info(`Successfully connected to Mongo Db-URL:${url}`);
    }
}

export default Connection;
