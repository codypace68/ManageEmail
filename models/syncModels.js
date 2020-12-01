const {
  Sequelize,
  Model,
  DataTypes
} = require('sequelize');


// Option 1: Passing a connection URI
const sequelize = new Sequelize('mysql://root:admin@localhost:3306/manageemail') // Example for mysql

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.")
} catch (e) {
  console.log("Unable to connect", e)
}

// User Table Setup
// ---------------------------------------
const User = sequelize.define('User', {
  // Model attributes are defined here
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  userFullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userUsername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

User.sync().then(err => {
  if (err) {
    console.log('Error occured while creating table', err);
  } else {
    console.log('Table created successfully');
  }
})


// Mail Acccounts Table Setup 
// -----------------------------------------------------------
const MailAccounts = sequelize.define('MailAccounts', {
  // Model attributes are defined here
  mailaccountId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  mailaccountOwner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mailaccountEmail: {
    type: DataTypes.STRING(320),// Allow room for sub folders email@domain.com/subfolder@otherdomain.com
    unique: true,
    allowNull: false,
  },
  mailaccountPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mailaccountImapHost: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mailaccountImapPort: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mailaccountTLS: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
}, {
  timestamps: false,
});

MailAccounts.belongsTo(User, {
  foreignKey: "mailaccountOwner"
})

MailAccounts.sync().then((err) => {
  if (err) {
    console.log('Error occured while creating table', err);
  } else {
    console.log('Table created successfully');
  }
});

// Mail Box Table setup 
// ---------------------------------------------------
const MailBoxes = sequelize.define('MailBoxes', {
  // Model attributes are defined here
  mailboxId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  mailboxName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mailboxOwner: {
    type: DataTypes.INTEGER, // foreign key
    allowNull: false,
  },
  mailboxAccount: {
    type: DataTypes.INTEGER, // foreign key
    allowNull: false,
  },
  mailboxAlertOnNoMatch: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  mailboxLatestUID: {
    type: DataTypes.INTEGER,
  },
  mailboxLatestSeq: {
    type: DataTypes.INTEGER,
  },
  mailboxMonitorActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  mailboxDefWebhookURL: {
    type: DataTypes.STRING(1000), // need plenty of room for a larger url
    allowNull: false,
  }
}, {
  timestamps: false,
});

MailBoxes.belongsTo(MailAccounts, {foreignKey: "mailboxAccount"});
MailBoxes.belongsTo(User, {foreignKey: "mailboxOwner"});

MailBoxes.sync().then((err) => {
  if (err) {
    console.log('Error occured while creating table', err);
  } else {
    console.log('Table created successfully');
  }
});

// Email MetaData Table setup
// -----------------------------------------------------
const EmailMetaData = sequelize.define('EmailMetaData', {
  // Model attributes are defined here
  emailMetaDataId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  emailMetaDataValue: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
});

EmailMetaData.sync().then((err) => {
  if (err) {
    console.log('Error occured while creating table', err);
  } else {
    console.log('Table created successfully');
  }
});

// Filter Group Table setup 
// ---------------------------------------------------
const FilterGroups = sequelize.define('FilterGroups', {
  // Model attributes are defined here
  filterGroupId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  filterGroupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filterGroupMailbox: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  filterGroupWebhookURL: {
    type: DataTypes.STRING(1000),
  },
  filterGroupAlertOn: {
    type: DataTypes.STRING,
    defaultValue: "ALL"
  }
}, {
  timestamps: false,
});

// Add Foreign Keys
FilterGroups.belongsTo(MailBoxes, {foreignKey: "filterGroupMailbox"});

FilterGroups.sync().then((err) => {
  if (err) {
    console.log('Error occured while creating table', err);
  } else {
    console.log('Table created successfully');
  }
});

// Filter Table setup
const Filters = sequelize.define('Filters', {
  // Model attributes are defined here
  filterId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  filterGroup: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  filterEmailMetaData: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  filterCompareValue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filterOperator: {
    type: DataTypes.STRING,
    defaultValue: "EQ"
  },
  filterSimilarityValue: {// should be between 1 and 99% if 100% is desired EQ should be used.
    type: DataTypes.INTEGER,
  },
}, {
  timestamps: false,
});

Filters.belongsTo(EmailMetaData, {foreignKey: "filterEmailMetaData"});
Filters.belongsTo(FilterGroups, {foreignKey: "filterGroup"});

Filters.sync().then((err) => {
  if (err) {
    console.log('Error occured while creating table', err);
  } else {
    console.log('Table created successfully');
  }
});




