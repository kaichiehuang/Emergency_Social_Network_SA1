const mongoose = require('mongoose');

class TestDataBase{
  static setupDB () {
    // Connect to Mongoose
    beforeAll(async () => {
      await mongoose.connect(
          //global.__MONGO_URI__,
          process.env.MONGO_URL,
          { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
          err => {
            if (err) {
              process.exit(1)
            }
          }
      )
    })

    // Disconnect Mongoose
    afterAll(async () => {
      await mongoose.connection.close()
    })
  }

}
module.exports= TestDataBase;

// module.exports = {
//   setupDB () {
//     // Connect to Mongoose
//     beforeAll(async () => {
//       await mongoose.connect(
//           global.__MONGO_URI__,
//           { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
//           err => {
//             if (err) {
//               process.exit(1)
//             }
//           }
//       )
//     })
//
//     // Disconnect Mongoose
//     afterAll(async () => {
//       await mongoose.connection.close()
//     })
//   }
//
//
// }
