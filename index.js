const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

var app = express();
const port = 1997;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


const conn = mysql.createConnection({
    host: 'localhost',
    user: 'saitama',
    password: 'abc123',
    database: 'hotelbertasbih',
    port: 3306
});

app.get('/', (req, res) => {
    res.send('<h1>Selamat Datang! API ANDA SUDAH AKTIF</h1>');
});

app.get('/listkamar', (req,res) => {
var sql = 'select * from tablekamar;';
conn.query(sql,(err,results) => {
if(err) throw err;

res.send({ listkamar: results});
})
})

app.get('/kamar',(req,res)=>{
    const { category } = req.query;
    var sql = `select tk.id, tk.nomorkamar, tc.namacategory,
     tk.harga from tablekamar tk
    join tablecategory tc
    on tk.categoryid = tc.id 
    where tc.namacategory like "%${category}%"`
    conn.query(sql,(err,results) => {
        if(err) throw err;
        
        res.send({ listkamar: results});
})
})



app.put('/listkamar/:id', (req,res) => {
    var { id } = req.params;
    var { nomorkamar, categoryid, harga } = req.body;
    var data = { 
        NomorKamar: nomorkamar,
        CategoryId: categoryid,
        Harga: harga
    }
    var sql = `UPDATE tablekamar SET ? WHERE Id = ${id}`;
    conn.query(sql,data,(err, results) => {
        if(err) throw err;

        if(err) res.send({err, status: 'Error'});
        else {
            var sql1 = `select * from tablekamar;`;
            conn.query(sql1, (err1, results1) => {
                if(err1) throw err1;
                
                res.send(results1);
            })
        }
    })
});


app.put('/category/:id', (req,res) => {
    var { id } = req.params;
    var { namacategory } = req.body;
    var data = {
        Name: namacategory
    }
    var sql = `UPDATE tablecategory SET ? WHERE Id = ${id}`;
    conn.query(sql, data, (err, results) => {
        if(err) throw err;

        sql = `SELECT * from tablecategory`;
        conn.query(sql, (err1, results1) => {
            if(err1) throw err1;

            res.send(results1);
        })
    })
})

app.delete('/listkamar/:id', (req,res) => {
    var { id } = req.params;

    var sql = `DELETE FROM tablekamar where id = ${id}`;
    conn.query(sql, (err, results) => {
        if(err) throw err;

        sql = `select * from tablekamar;`;
        conn.query(sql, (err1, results1) => {
            if(err1) throw err1;

            res.send(results1);
        })
    })
})

app.delete('/category/:id', (req,res) => {
    var { id } = req.params;

    var sql = `DELETE FROM tablecategory where Id = ${id}`;
    conn.query(sql, (err, results) => {
        if(err) throw err;

            sql = `SELECT * FROM category`;
            conn.query(sql, (err1, results1) => {
                if(err1) throw err1;

                res.send(results1);
            })
        })
    })


app.post('/category', (req,res) => {
    const { namacategory } = req.body;
    var data = { 
        Name: namacategory,
    };
    var sql = 'INSERT INTO tablecategory SET ?';
    conn.query(sql, data, (err, results) => {
        if(err) throw err;
        var sql1 = `select * from tablecategory;`;
        conn.query(sql1, (err1, results1) => {
            if(err1) throw err1;
            
            res.send(results1);
        })
    })
})

app.post('/listkamar', (req,res) => {
    const { nomorkamar, categoryid, harga } = req.body;
    var data = { 
        NomorKamar: nomorkamar,
        CategoryId: categoryid,
        Harga: harga
    };
    var sql = 'INSERT INTO tablekamar SET ?'
    conn.query(sql,data,(err, results) => {
        if(err) throw err;

        if(err) res.send({err, status: 'Error'});
        else {
            var sql1 = `select * from tablekamar;`;
            conn.query(sql1, (err1, results1) => {
                if(err1) throw err1;
                
                res.send(results1);
            })
        }
    })
});

app.post('/register', (req,res) => {
    const { username, email, password, role } = req.body;
    var data = { 
        Username: username,
        Email: email,
        Password: password,
        Role: role
    };
    var sql = 'INSERT INTO tableuser SET ?'
    conn.query(sql,data,(err, results) => {
        if(err) throw err;
        res.send(results);
    })
})

// app.post('/login', (req,res) => {
//     const { email, password} = req.body;
//     var data = { 
//         Email: email,
//         Password: password,
//     };

// })

app.post('/login', (req, res) => {
    var sql = `select * from tableuser where email = '${req.body.email}' and password = '${req.body.password}'`
        conn.query(sql, (err, result) => {
            if(err)
            console.log(err)
             throw err;
            res.send({status:"loggedin",result});
        })
    
    
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));