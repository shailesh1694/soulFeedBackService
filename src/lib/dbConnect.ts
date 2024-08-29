import mongoose, { connect, connections, } from "mongoose";


const dbConnet = async () => {

    if (connections?.[0]?.readyState) {
        console.log("dbCoonected Alredy")
        return;
    }
    try {
        const db = await connect(process.env.MONGO_URI || "", {})
        console.log("db connected at " + db.connection.host)

    } catch (error) {
        console.log("Db Connection Erro : ", error)
        process.exit(1)
    }

}
export default dbConnet;