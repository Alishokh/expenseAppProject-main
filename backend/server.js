const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const quote = "`";
const nodemailer = require("nodemailer")
const app = express();
app.use(cors());
app.use(express.json());

// app.use("/signup", (req, res, next) => {
//     res.setHeader("Cache-Control", "no-store")
//     next();
// })

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "expenses_reports",
    multipleStatements: true,
})

app.post("/validateEmail", (req, res) => {

    const sql = `SELECT user_id FROM user WHERE email = "${req.body.email}"`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }
        if (result.length) {
            return res.json({ errorMessage: 'email already in use' });
        }
        return res.json({ errorMessage: null });
    })
})


const columnAmount = async (userId) => {
    let response = 3;
    const sql = `SELECT COUNT(*) AS amount FROM expenses WHERE ${quote}user_id${quote}=${userId}`;
    db.query(sql, (err, result) => {
        if (err) {
            return "error";
        }
        response = result;
        return result;
    })
}

app.get("/expenses/:userId", async (req, res) => {
    const d = new Date(req.query.date)
    const year = d.getFullYear();
    const month = d.getMonth() + 1 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    const day = d.getUTCDate() + 1
    const searchDate = `${year}-${month}-${day}`

    console.log('date: ', d ,  searchDate)
    let sql = `SELECT expense_id, title, category, type, amount, date FROM expenses WHERE user_id =${req.params.userId} ${req.query.title ? `AND title LIKE '${req.query.title}%'` : ''} ${req.query.minAmount ? `AND amount >= '${req.query.minAmount}'` : ''} ${req.query.maxAmount ? `AND amount <= '${req.query.maxAmount}'` : ''} ${req.query.type ? `AND type = '${req.query.type}'` : ''} ${req.query.category ? `AND category = '${req.query.category}'` : ''} ${req.query.date ? `AND date = '${searchDate}'`: ''} LIMIT 10 OFFSET ${(req.query.page - 1) * 3}`;
    console.log('sql: ', sql);
    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }

        return res.json({ expenses: result });
    })
})

app.get("/pdfDataExpenses/:userId", async (req, res) => {

    const d = new Date(req.query.date)
    const year = d.getFullYear();
    const month = d.getMonth() + 1 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    const day = d.getUTCDate() + 1
    const searchDate = `${year}-${month}-${day}`

    let sql = `SELECT expense_id, title, category, type, amount, date FROM expenses WHERE user_id =${req.params.userId} ${req.query.title ? `AND title LIKE '${req.query.title}%'` : ''} ${req.query.minAmount ? `AND amount >= '${req.query.minAmount}'` : ''} ${req.query.maxAmount ? `AND amount <= '${req.query.maxAmount}'` : ''} ${req.query.type ? `AND type = '${req.query.type}'` : ''} ${req.query.category ? `AND category = '${req.query.category}'` : ''} ${req.query.date ? `AND date = '${searchDate}'` : ''}`;
    console.log('SQL:', sql)
    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }

        return res.json({ expenses: result });
    })
})

app.get("/expensePages/:userId", async (req, res) => {
    
    const d = new Date(req.query.date)
    const year = d.getFullYear();
    const month = d.getMonth() + 1 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    const day = d.getUTCDate() + 1
    const searchDate = `${year}-${month}-${day}`

    let sql = `SELECT COUNT(*) AS amount FROM expenses WHERE user_id =${req.params.userId} ${req.query.title ? `AND title LIKE '${req.query.title}%'` : ''} ${req.query.minAmount ? `AND amount >= '${req.query.minAmount}'` : ''} ${req.query.maxAmount ? `AND amount <= '${req.query.maxAmount}'` : ''} ${req.query.type ? `AND type = '${req.query.type}'` : ''} ${req.query.category ? `AND category = '${req.query.category}'` : ''} ${req.query.date ? `AND date = '${searchDate}'` : ''}`;
    console.log('sql: ', sql)
    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }

        const pages = Math.ceil(result[0].amount / 3);

        return res.json({ pages });
    })
})



function generatePassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "expenseapp2024@gmail.com",
        pass: "obkv vlqm vtxc jezr",
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendPassword(email, password) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: {
            name: "Expense App",
            address: "expenseapp2024@gmail.com",
        }, // sender address
        to: [email] , // list of receivers
        subject: "Password reset", // Subject line
        text: `Hello here is your temporarily password: ${password} 
        please change it once you log in to the application next time.`, // plain text body
        html: `<p>Hello</p> <p>here is your temporarily password: ${password}</p><p>please change it once you log in to the application next time.</p>`, // html body
    });

    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

app.get("/forgotPassword/:email", async (req, res) => {


    
    const newPassword = generatePassword();
    sendPassword(req.params.email, newPassword).catch(console.error);;
    let sql = `UPDATE user SET ${quote}password${quote} = '${newPassword}' WHERE ${quote}email${quote} = "${req.params.email}"`;
   
    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }

        return res.json({ ...result, status: 'success', password: newPassword });
    })
})

const checkTheDate = (date) => {
    const arr1 = date.split('-')
    const arr2 = arr1.pop().split('T')
    const arr3 = Number(arr2.shift()) + 1 + 'T' + arr2[0]
    return arr1.join('-') + '-' + arr3
}


app.post("/editExpense", async (req, res) => {
    const sql = `UPDATE expenses SET ${quote}title${quote} = "${req.body.title}", ${quote}category${quote} = "${req.body.category}", ${quote}type${quote} = "${req.body.type}", ${quote}amount${quote} = ${req.body.amount}, ${quote}date${quote} = '${checkTheDate(req.body.date)}' WHERE ${quote}expense_id${quote} = ${req.body.expenseId}`;

    db.query(sql, (err, data) => {
        if (err) {
            return res.json(err);
        }

        return res.json({ ...data, status: "success" });
    })
})

app.post("/deleteExpense", async (req, res) => {
    const sql = `DELETE FROM expenses WHERE expense_id = ${req.body.expenseId}`

    db.query(sql, (err, data) => {
        if (err) {
            return res.json(err);
        }

        return res.json({ ...data, status: "success" });
    })
})

app.post("/signup", async (req, res) => {
    const sql = "INSERT INTO user (`name`, `email`, `password`, `logged_in`) VALUES (?)";

    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        0
    ]

    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json(err);
        }

        return res.json({ ...data, status: "success" });
    })
})


app.post("/addExpense", async (req, res) => {
    const sql = "INSERT INTO expenses (`title`, `category`, `type`, `amount`, `user_id`, `date`) VALUES (?)";

    const date = new Date(req.body.date)
    date.setDate(date.getDate())

    console.log('Date: ', req.body.date, date)
    

    const values = [
        req.body.title,
        req.body.category,
        req.body.type,
        req.body.amount,
        req.body.userId,
        date,
    ]


    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json(err);
        }

        return res.json({ status: true });
    })
})

const setUserLoggedIn = (user_id) => {
    const sql = `UPDATE user SET logged_in = 1 WHERE user_id = "${user_id}"`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }
        return true;
    })
}


app.post("/login", async (req, res) => {
    const sql = `SELECT user_id, name, email FROM user WHERE email = "${req.body.email}" 
    AND password = "${req.body.password}"`;

    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }

        if (result.length) {
            setUserLoggedIn(result[0].user_id);
            return res.json({
                userId: result[0].user_id,
                errors: null,
                name: result[0].name,
                email: result[0].email,
                isLoggedIn: true
            });
        }
        else {
            return res.json({ userId: null, error: "login or password is incorrect", name: null, isLoggedIn: false, email: null });
        }
    })
})


const getUserData = (user_id) => {
    const sql = `SELECT user_id, name, email FROM user WHERE user_id = ${user_id}`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }
        return {
            userId: result[0].user_id,
            name: result[0].name,
            email: result[0].email,
        };
    })
}

app.post("/updateUserData", async (req, res) => {
    const sql = `UPDATE user SET name = "${req.body.name}", 
    email = "${req.body.email}"  WHERE user_id = "${req.body.userId}"`;

    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }
        return { error: null, userId: req.body.userId }

    })
    return res.json({ error: null, userId: req.body.userId });
})



const changePassword = (userId, password) => {
    const sql = `UPDATE user SET ${quote}password${quote} = "${password}" 
    WHERE ${quote}user_id${quote} = "${userId}"`;


    db.query(sql, (err, result) => {
        if (err) {
            return false;
        }
        return true;
    })
    return true;
}

const PASSWORD = "`password`";
const USER_ID = "`user_id`";

function checkCurrentPassword(password, id) {
    const sql = `SELECT name FROM user WHERE ${PASSWORD} = "${password}" 
    AND ${USER_ID} = "${id}"`;

    db.query(sql, (err, result) => {
        if (err) {
            return { error: "server error" };
        }
        return { error: null, userId: id }
    });

}

app.post("/changePassword", async (req, res) => {
    const data = checkCurrentPassword(req.body.currentPassword, req.body.userId);
    const response = changePassword(req.body.userId, req.body.newPassword);
    return res.json({ error: null, userId: req.body.userId });
})

app.post("/getUserData", async (req, res) => {
    const sql = `SELECT user_id, name, email FROM user WHERE user_id = ${req.body.userId}`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }
        return res.json({
            error: null,
            userId: result[0].user_id,
            name: result[0].name,
            email: result[0].email,
        });
    })
})

app.post("/logout", async (req, res) => {
    const sql = `UPDATE user SET ${quote}logged_in${quote} = 0 
    WHERE ${quote}user_id${quote} = "${req.body.userId}"`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json("server error")
        }
        return res.json({
            error: null,
            userId: req.body.userId,
        });
    })
})

app.listen(8080, () => {
    console.log("listening")
})