const mongoose = require('mongoose')

//Klasa służąca do połączenia z dowolną instancją bazy danych,
class Database {
    //konstruktor przyjmuje adres bazy danych
    constructor(MONGODB_URI) {
        this.MONGODB_URI = MONGODB_URI
    }
    //metoda connect służy do połączenia z bazą na podstawie podanego w konstruktorze adresu
    connect() {
        mongoose.connect(this.MONGODB_URI, { useNewUrlParser: true }, (err) => {
            if (err) {
                console.log(err)
                process.exit(1)
            }
            console.log(`[MONGODB] Connected to instance on ${this.MONGODB_URI}`)

        });
    }
}

module.exports = Database