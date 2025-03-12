import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";

const AddProduct = () => {
  const { register, handleSubmit, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [addProduct, { isLoading }] = useAddProductMutation();

  // ✅ Handle Image Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };



  // ✅ Handle Form Submission
  const onSubmit = async (data) => {
    let coverImage = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const response = await axios.post(`${getBaseUrl()}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        coverImage = response.data.image;
      } catch (error) {
        console.error("Image upload failed", error);
        Swal.fire("Error!", "Failed to upload image.", "error");
        return;
      }
    }

    const newProductData = { ...data, coverImage };

    try {
      await addProduct(newProductData).unwrap();
      Swal.fire("Success!", "Product added successfully!", "success");
      reset();
      setImageFile(null);
      setPreviewURL("");
    } catch (error) {
      console.error("Failed to add product", error);
      Swal.fire("Error!", "Failed to add product.", "error");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("title")}
          className="w-full p-2 border rounded"
          placeholder="Product Name"
          required
        />

        <textarea
          {...register("description")}
          className="w-full p-2 border rounded"
          placeholder="Description"
          required
        />

        <select
          {...register("category")}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="kaftan">Kaftan</option>
          <option value="jebba">Jebba</option>
          <option value="gandoura">Gandoura</option>
          <option value="safsari">Safsari</option>
          <option value="chachia">Chachia</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            {...register("oldPrice")}
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Old Price"
            required
          />
          <input
            {...register("newPrice")}
            type="number"
            className="w-full p-2 border rounded"
            placeholder="New Price"
            required
          />
        </div>

        <input
          {...register("stockQuantity")}
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Stock Quantity"
          min="1"
          required
        />

        <label className="flex items-center">
          <input type="checkbox" {...register("trending")} className="mr-2" />
          Trending Product
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          required
        />

        {previewURL && (
          <img
            src={previewURL}
            alt="Preview"
            className="w-32 h-32 object-cover border rounded-md mt-2"
          />
        )}

        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="w-full py-2 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b] transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
