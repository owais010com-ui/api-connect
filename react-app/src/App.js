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
        "http://localhost:5000/get-all-products"
      );

      setAllProducts(apiRes.data.products);

    } catch (error) {

      console.log("Error", error);
      setError("Products load nahi ho rahe");

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


      // EMPTY FIELD CHECK

      if (
        !values.productImage ||
        !values.title ||
        !values.price ||
        !values.description
      ) {

        setError("Please fill all fields");

        return;
      }


      try {

        const productData = {

          title: values.title,
          price: values.price,
          description: values.description,
          image: values.productImage

        };


        // EDIT PRODUCT

        if (editId) {

          const apiRes = await axios.put(
            `http://localhost:5000/edit-product/${editId}`,
            productData
          );

          if (apiRes.data.status === "error") {

            setError(apiRes.data.message);

            return;
          }

          setSuccess("Product Updated Successfully");

          setEditId(null);

        }


        // ADD PRODUCT

        else {

          const apiRes = await axios.post(
            "http://localhost:5000/add-product",
            productData
          );

          if (apiRes.data.status === "error") {

            setError(apiRes.data.message);

            return;
          }

          setSuccess("Product Added Successfully");

        }


        formik.resetForm();

        getAllProducts();


      } catch (error) {

        console.log("Error", error);

        setError("Something went wrong");

      }

    }

  });


  // EDIT PRODUCT

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


  // DELETE PRODUCT

  const deleteProduct = async (id) => {

    setError("");
    setSuccess("");

    try {

      const apiRes = await axios.delete(
        `http://localhost:5000/delete-product/${id}`
      );


      if (apiRes.data.status === "error") {

        setError(apiRes.data.message);

        return;
      }


      setSuccess("Product Deleted Successfully");

      getAllProducts();


    } catch (error) {

      console.log("Delete Error", error);

      setError("Product delete nahi hua");

    }

  };


  // CANCEL EDIT

  const cancelEdit = () => {

    setEditId(null);

    setError("");
    setSuccess("");

    formik.resetForm();

  };


  return (

    <div className="App">


      <h1>Product App</h1>


      {/* FORM */}

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


        {/* ERROR */}

        {error && (
          <p className="error">
            {error}
          </p>
        )}


        {/* SUCCESS */}

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


      {/* PRODUCTS */}

      <div className="products">


        {allProducts.map((eachProduct) => (

          <div
            className="card"
            key={eachProduct.id}
          >


            <img
              src={eachProduct.image}
              alt={eachProduct.title}
            />


            <h2>
              {eachProduct.title}
            </h2>


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