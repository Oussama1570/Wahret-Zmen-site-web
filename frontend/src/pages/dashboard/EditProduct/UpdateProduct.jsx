import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetProductByIdQuery, // ✅ Fixed Hook
  useUpdateProductMutation,
} from "../../../redux/features/products/productsApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";

const UpdateProduct = () => {
  const { id } = useParams();
  const { data: productData, isLoading, isError, refetch } = useGetProductByIdQuery(id); // ✅ Fixed Hook
  const { register, handleSubmit, setValue } = useForm();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  useEffect(() => {
    if (productData) {
      setValue("title", productData.title);
      setValue("description", productData.description);
      setValue("category", productData.category);
      setValue("trending", productData.trending);
      setValue("oldPrice", productData.oldPrice);
      setValue("newPrice", productData.newPrice);
      setValue("stockQuantity", productData.stockQuantity);
      
      setPreviewURL(
        productData.coverImage.startsWith('http') 
          ? productData.coverImage
          : `${getBaseUrl()}${productData.coverImage}`
      );
    }
  }, [productData, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    let coverImage = productData.coverImage;

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

    const updatedProductData = { ...productData, ...data, coverImage };

    try {
      await updateProduct({ id, ...updatedProductData }).unwrap();
      Swal.fire("Success!", "Product updated successfully!", "success");

      setPreviewURL(
        coverImage.startsWith("http") ? coverImage : `${getBaseUrl()}${coverImage}`
      );
      refetch();
    } catch (error) {
      console.error("Failed to update product", error);
      Swal.fire("Error!", "Failed to update product.", "error");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-500">Error fetching product data.</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Update Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("title")} className="w-full p-2 border rounded" placeholder="Product Name" required />

        <textarea {...register("description")} className="w-full p-2 border rounded" placeholder="Description" required />

        <select {...register("category")} className="w-full p-2 border rounded" required>
          <option value="">Select Category</option>
          <option value="kaftan">Kaftan</option>
          <option value="jebba">Jebba</option>
          <option value="gandoura">Gandoura</option>
          <option value="safsari">Safsari</option>
          <option value="chachia">Chachia</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input {...register("oldPrice")} type="number" className="w-full p-2 border rounded" placeholder="Old Price" required />
          <input {...register("newPrice")} type="number" className="w-full p-2 border rounded" placeholder="New Price" required />
        </div>

        <input {...register("stockQuantity")} type="number" className="w-full p-2 border rounded" placeholder="Stock Quantity" min="1" required />

        <label className="flex items-center">
          <input type="checkbox" {...register("trending")} className="mr-2" />
          Trending Product
        </label>

        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />

        {previewURL && (
          <img
            src={previewURL}
            alt="Preview"
            className="w-32 h-32 object-cover border rounded-md mt-2"
          />
        )}

        <button type="submit" className="w-full py-2 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b] transition">
          {updating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
