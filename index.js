const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vj9mo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("nearBazarDB");
        const usersCollecntion = database.collection("users");
        const productsCollecntion = database.collection("products");
        const categoriesCollecntion = database.collection("categories");

        app.get('/categories', async (req, res) => {
            const categories = await categoriesCollecntion.find({}).toArray();
            res.send(categories);
        })


        // USERS POST API
        // app.post('/users', async (req, res) => {
        //     const service = req.body;
        //     const result = await usersCollecntion.insertOne(service);
        //     res.json(result);
        //     console.log(service);
        //     console.log(result);
        // })

        // // USERS GET API
        // app.get('/users', async (req, res) => {
        //     const result = await usersCollecntion.find({}).toArray();
        //     res.json(result);
        // })

        // // SINGLE USERS GET API
        // app.get('/services/details/:detailsId', async (req, res) => {
        //     const id = req.params.detailsId;
        //     const query = { _id: ObjectId(id) };
        //     const result = await servicesCollecntion.findOne(query);
        //     res.json(result);
        // })

        // // PRODUCTS POST API
        // app.post('/products', async (req, res) => {
        //     const product = req.body;
        //     const result = await productsCollecntion.insertOne(product);
        //     res.json(result);
        //     console.log(product);
        //     console.log(result);
        // })

        // PRODUCTS GET API
        app.get('/products', async (req, res) => {
            const result = await productsCollecntion.find({}).toArray();
            res.json(result);
        })

        // SINGLE USERS GET API
        app.get('/products/details/:detailsId', async (req, res) => {
            const id = req.params.detailsId;
            const query = { _id: ObjectId(id) };
            const result = await productsCollecntion.findOne(query);
            res.json(result);
        })

        // const users = [
        //     { name: "tanjim", email: "tanjim@gmail.com" },
        //     { name: "tanjim & 123", email: "tanjim@gmail.com" },
        //     { name: "tanjim & 321", email: "tanjim@gmail.com" },
        //     { name: "tanjim & 321", email: "tanjim@gmail.com" },
        //     { name: "tanjim & 123", email: "tanjim@gmail.com" },
        //     { name: "tanjim & 123", email: "tanjim@gmail.com" },
        //     { name: "tanjim & 123", email: "tanjim@gmail.com" }
        // ]

        // app.get('/users', (req, res) => {
        //     const search = req.query.search;
        //     console.log(search);
        //     if (search) {
        //         const searchResult = users.filter(user => user.name.toLocaleLowerCase().includes(search));
        //         console.log(searchResult);
        //         res.send(searchResult);
        //     } else {
        //         res.send(users);
        //     }
        // })

        // app.get('/products/category', async (req, res) => {
        //     const search = req.query.search;
        //     console.log(search);
        //     if (search) {
        //         const products = productsCollecntion.toArray()
        //         const searchResult = await products.filter(result => result.parent.includes(search));
        //         console.log(searchResult);
        //         // const searchArr = await searchResult.toArray();
        //         console.log(searchArr);
        //         res.send(searchArr)
        //     }
        // })
        app.get('/products/search', async (req, res) => {
            const category = req.query.category;
            console.log(category);
            const replace = category.replace('-', ' & ');
            // console.log(query);
            const result = await productsCollecntion.find({
                $or: [
                    { 'parent': replace },
                    { 'children': replace }
                ]
            }).toArray();


            res.send(result);
        })

        // app.get('/products/relatedProducts', async (req, res) => {
        //     const related = req.query.related;
        //     const replace = related.replace('-', ' & ');
        //     const query = { parent: replace };

        //     console.log(query);

        //     const result = await productsCollecntion.find(query).toArray();

        //     res.send(result);

        // })
        // app.get('/products', async (req, res) => {
        //     const category = req.query.category;
        //     const replace = category.replace('-', ' & ');
        //     const query = { children: replace };
        //     console.log(query);
        //     const result = await productsCollecntion.find(query).toArray();


        //     res.send(result);
        // })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})