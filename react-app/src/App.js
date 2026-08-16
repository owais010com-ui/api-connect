import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./App.css";

function App() {

  const [allProducts, setAllProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const getAllProducts = async () => {

    try {

      const apiRes = await axios.get(
        "http://localhost:5000/get-products"
      );

      setAllProducts(apiRes.data.products);

    } catch (error) {

      console.log("Error", error);
      setError("Products Load Nahi Ho Rahe");

    }

  };


  useEffect(() => {
    getAllProducts();
  }, []);


  const formik = useFormik({

    initialValues: {
      productImage: "",
      title: "",
      price: "",
      description: "",
    },


    onSubmit: async (values) => {

      setError("");
      setSuccess("");


      if (
        !values.productImage ||
        !values.title ||
        !values.price ||
        !values.description
      ) {

        setError("Please Fill All Fields");

        return;
      }


      const productBody = {

        title: values.title,
        price: values.price,
        description: values.description,
        image: values.productImage

      };


      try {

        if (editId) {

          const apiRes = await axios.put(
            `http://localhost:5000/update-product/${editId}`,
            productBody
          );

          if (apiRes.data.status === "error") {

            setError(apiRes.data.message);

            return;
          }

          setSuccess(apiRes.data.message);

          setEditId(null);

        } else {

          const apiRes = await axios.post(
            "http://localhost:5000/create-product",
            productBody
          );

          if (apiRes.data.status === "error") {

            setError(apiRes.data.message);

            return;
          }

          setSuccess(apiRes.data.message);

        }


        formik.resetForm();
        getAllProducts();


      } catch (error) {

        console.log("Error", error);
        setError("Something Went Wrong");

      }

    }

  });


  const editProduct = (product) => {

    setError("");
    setSuccess("");

    setEditId(product.id);

    formik.setValues({

      productImage: product.image,
      title: product.title,
      price: product.price,
      description: product.description

    });

  };


  const deleteProduct = async (id) => {

    setError("");
    setSuccess("");

    try {

      const apiRes = await axios.delete(
        `http://localhost:5000/remove-product/${id}`
      );

      if (apiRes.data.status === "error") {

        setError(apiRes.data.message);

        return;
      }

      setSuccess(apiRes.data.message);

      getAllProducts();

    } catch (error) {

      console.log("Delete Error", error);
      setError("Product Delete Nahi Hua");

    }

  };


  const cancelEdit = () => {

    setEditId(null);
    setError("");
    setSuccess("");

    formik.resetForm();

  };


  return (

    <div className="App">

      <h1>Product App</h1>


      <form onSubmit={formik.handleSubmit}>

        <input
          type="url"
          placeholder="Image URL"
          name="productImage"
          onChange={formik.handleChange}
          value={formik.values.productImage}
        />


        <input
          type="text"
          placeholder="Product Title"
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title}
        />


        <input
          type="number"
          placeholder="Price"
          name="price"
          onChange={formik.handleChange}
          value={formik.values.price}
        />


        <textarea
          placeholder="Description"
          name="description"
          onChange={formik.handleChange}
          value={formik.values.description}
        />


        {error && (
          <p className="error">
            {error}
          </p>
        )}


        {success && (
          <p className="success">
            {success}
          </p>
        )}


        <button type="submit">
          {editId ? "Update Product" : "Add Product"}
        </button>


        {editId && (

          <button
            type="button"
            className="cancel"
            onClick={cancelEdit}
          >
            Cancel
          </button>

        )}

      </form>


      <div className="products">

        {allProducts.map((eachProduct) => (

          <div className="card" key={eachProduct.id}>

            <img
              src={eachProduct.image}
              alt={eachProduct.title}
            />

            <h2>{eachProduct.title}</h2>

            <h3>
              Rs. {eachProduct.price}
            </h3>

            <p>
              {eachProduct.description}
            </p>


            <button
              onClick={() => editProduct(eachProduct)}
            >
              Edit
            </button>


            <button
              onClick={() => deleteProduct(eachProduct.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default App;