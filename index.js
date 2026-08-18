import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

let productData = [];

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Product Server is Running");
});


app.get("/get-products", (req, res) => {

    res.send({
        status: "success",
        message: "Products Fetched Successfully",
        products: productData
    });

});


app.post("/create-product", (req, res) => {

    const productBody = req.body;

    if (
        !productBody?.title ||
        !productBody?.price ||
        !productBody?.description ||
        !productBody?.image
    ) {

        res.send({
            status: "error",
            message: "Please Enter All Product Details"
        });

        return;
    }


    const newProduct = {
        id: new Date().getTime(),
        title: productBody.title,
        price: productBody.price,
        description: productBody.description,
        image: productBody.image
    };


    productData.push(newProduct);


    res.send({
        status: "success",
        message: "New Product Added"
    });

});


app.put("/update-product/:id", (req, res) => {

    const productId = req.params.id;

    let productIndex = null;


    for (let i = 0; i < productData.length; i++) {

        if (productData[i].id == productId) {
            productIndex = i;
            break;
        }

    }


    if (productIndex == null) {

        res.send({
            status: "error",
            message: "Product Could Not Be Found"
        });

        return;
    }


    const productBody = req.body;


    if (
        !productBody?.title ||
        !productBody?.price ||
        !productBody?.description ||
        !productBody?.image
    ) {

        res.send({
            status: "error",
            message: "Please Complete All Product Fields"
        });

        return;
    }


    productData[productIndex].title = productBody.title;
    productData[productIndex].price = productBody.price;
    productData[productIndex].description = productBody.description;
    productData[productIndex].image = productBody.image;


    res.send({
        status: "success",
        message: "Product Details Updated"
    });

});


app.delete("/remove-product/:id", (req, res) => {

    const productId = req.params.id;

    const oldLength = productData.length;


    productData = productData.filter(
        (product) => product.id != productId
    );


    if (oldLength === productData.length) {

        res.send({
            status: "error",
            message: "Product Could Not Be Found"
        });

        return;
    }


    res.send({
        status: "success",
        message: "Product Removed Successfully"
    });

});

app.listen(PORT, () => {
    console.log(`Product Server Started At Port ${PORT}`);
});

export default app;