const { Sequelize, Model, DataTypes } = require('sequelize');

// Option 1: Passing a connection URI
const sequelize = new Sequelize('mysql://root:admin@localhost:3306/manageemail') // Example for mysql

try {
    sequelize.authenticate();
    console.log("Connection has been established successfully.")
} catch(e) {
    console.log("Unable to connect", e)
}

const MailAccounts = sequelize.define('MailAccounts', {
    // Model attributes are defined here
    mailaccountId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },
    owner: {
        type: DataTypes.INTEGER
    }
  }, {
    // Other model options go here
  });

const User = sequelize.define('User', {
    // Model attributes are defined here
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
      // allowNull defaults to true
    },
  }, {
    // Other model options go here
  });

  User.sync().then(err => {
      if (err) {
          console.log('Error occured while creating table', err);
      } else {
          console.log('Table created successfully');
      }
  })

  MailAccounts.belongsTo(User, {foreignKey: "owner"})

  MailAccounts.sync().then((err, tst) => {
    if (err) {
        console.log('Error occured while creating table', err, tst);
    } else {
        console.log('Table created successfully');
    }
    })
  
  // `sequelize.define` also returns the model
  console.log(User === sequelize.models.User); // true