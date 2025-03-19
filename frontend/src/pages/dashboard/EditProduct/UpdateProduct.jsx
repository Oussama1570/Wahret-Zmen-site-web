import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery, useUpdateProductMutation } from "../../../redux/features/products/productsApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";

const UpdateProduct = () => {
  const { id } = useParams();
  const { data: productData, isLoading, isError, refetch } = useGetProductByIdQuery(id);
  const { register, handleSubmit, setValue } = useForm();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (productData) {
      setValue("title", productData.title);
      setValue("description", productData.description);
      setValue("category", productData.category);
      setValue("trending", productData.trending);
      setValue("oldPrice", productData.oldPrice);
      setValue("newPrice", productData.newPrice);
      setValue("stockQuantity", productData.stockQuantity);

      let coverImageUrl = productData.coverImage || "";
      if (coverImageUrl) {
        setPreviewURL(
          coverImageUrl.startsWith("http")
            ? coverImageUrl
            : `${getBaseUrl()}${coverImageUrl}`
        );
      }

      if (Array.isArray(productData.colors)) {
        const formattedColors = productData.colors.map((color) => ({
          colorName: color.colorName || "",
          image: color.image || "",
          imageFile: null,
          previewURL: color.image && color.image.startsWith("http") ? color.image : `${getBaseUrl()}${color.image}`,
        }));
        setColors(formattedColors);
      }
    }
  }, [productData, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...colors];
    if (field === "imageFile") {
      updatedColors[index][field] = value;
      updatedColors[index].previewURL = URL.createObjectURL(value);
    } else {
      updatedColors[index][field] = value;
    }
    setColors(updatedColors);
  };

  const addColor = () => {
    setColors([...colors, { colorName: "", imageFile: null, previewURL: "" }]);
  };

  const deleteColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${getBaseUrl()}/api/upload`, formData);
    return res.data.image;
  };

  const onSubmit = async (data) => {
    let coverImage = productData.coverImage || "";
    if (imageFile) {
        coverImage = await uploadImage(imageFile);
    }

    const updatedColors = await Promise.all(
        colors.map(async (color) => {
            let imageUrl = color.image || "";
            if (color.imageFile) {
                imageUrl = await uploadImage(color.imageFile);
            }
            return { colorName: color.colorName, image: imageUrl };
        })
    );

    // ✅ Ensure only valid categories are stored
    const allowedCategories = ["Men", "Women", "Children"];
    const finalCategory = allowedCategories.includes(data.category) ? data.category : "Men";

    const updatedProductData = {
        ...data,
        category: finalCategory,
        coverImage,
        colors: updatedColors,
    };

    try {
        await updateProduct({ id, ...updatedProductData }).unwrap();
        Swal.fire("Success!", "Product updated successfully!", "success");
        refetch();
    } catch (error) {
        Swal.fire("Error!", "Failed to update product.", "error");
    }
};


  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-500">Error fetching product data.</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Update Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input {...register("title")} className="w-full p-2 border rounded" placeholder="Product Name" required />
        <textarea {...register("description")} className="w-full p-2 border rounded" placeholder="Description" required />
        <select {...register("category")} className="w-full p-2 border rounded" required>
  <option value="">Select Category</option>
  <option value="Men">Men</option>
  <option value="Women">Women</option>
  <option value="Children">Children</option>
</select>

        <input {...register("oldPrice")} type="number" className="w-full p-2 border rounded" placeholder="Old Price" required />
        <input {...register("newPrice")} type="number" className="w-full p-2 border rounded" placeholder="New Price" required />
        <input {...register("stockQuantity")} type="number" className="w-full p-2 border rounded" placeholder="Stock Quantity" min="0" required />
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
        {previewURL && <img src={previewURL} alt="Preview" className="w-64 h-64 object-cover border rounded-md mt-4 mx-auto" />}
        {colors.map((color, index) => (
          <div key={index} className="space-y-2">
            <input type="text" value={color.colorName} onChange={(e) => handleColorChange(index, "colorName", e.target.value)} className="w-full p-2 border rounded" placeholder="Color Name" required />
            <input type="file" accept="image/*" onChange={(e) => handleColorChange(index, "imageFile", e.target.files[0])} className="w-full p-2 border rounded" />
            {color.previewURL && <img src={color.previewURL} alt="Color Preview" className="w-20 h-20 mt-1" />}
            <button type="button" onClick={() => deleteColor(index)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
        <button type="button" onClick={addColor} className="px-3 py-2 bg-gray-300 rounded">Add Color</button>
        <button type="submit" className="block mx-auto w-1/2 py-3 bg-[#A67C52] text-white rounded-md text-lg font-semibold hover:bg-[#8a5d3b]">{updating ? "Updating..." : "Update Product"}</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
