import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

let products = [];

app.use(cors());
app.use(express.json());


app.get("/get-all-products", (req, res) => {
    res.send({
        status: "success",
        products
    });
});


app.post("/add-product", (req, res) => {

    const productBody = req.body;

    if (
        !productBody?.title ||
        !productBody?.price ||
        !productBody?.description ||
        !productBody?.image
    ) {
        res.send({
            status: "error",
            message: "Required Parameter Missing"
        });
        return;
    }

    products.push({
        id: new Date().getTime(),
        ...productBody
    });

    res.send({
        status: "success",
        message: "Product Add Successfully"
    });
});


app.put("/edit-product/:id", (req, res) => {

    const productId = req.params.id;

    let targetedProductId = null;

    for (let i = 0; i < products.length; i++) {

        if (products[i].id == productId) {
            targetedProductId = i;
        }

    }

    if (targetedProductId == null) {

        res.send({
            status: "error",
            message: `Product Not Found`
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
            message: "Required Parameter Missing"
        });

        return;
    }

    products[targetedProductId].title = productBody.title;
    products[targetedProductId].price = productBody.price;
    products[targetedProductId].description = productBody.description;
    products[targetedProductId].image = productBody.image;

    res.send({
        status: "success",
        message: "Product Updated Successfully"
    });
});


app.delete("/delete-product/:id", (req, res) => {

    const productId = req.params.id;

    products = products.filter(
        (eachProduct) => eachProduct.id != productId
    );

    res.send({
        status: "success",
        message: "Product Deleted Successfully"
    });
});


app.listen(PORT, () => {
    console.log(`App is Running On Port ${PORT}`);
});