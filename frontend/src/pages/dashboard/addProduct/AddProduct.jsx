import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";

const AddProduct = () => {
    const { register, handleSubmit, reset } = useForm();
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverPreviewURL, setCoverPreviewURL] = useState("");
    const [colorInputs, setColorInputs] = useState([]);
    const [addProduct, { isLoading }] = useAddProductMutation();




    // ✅ Handle Cover Image Selection
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);
            setCoverPreviewURL(URL.createObjectURL(file));
        }
    };

    // ✅ Handle Color Inputs
    const handleColorInputChange = (index, field, value) => {
        const newInputs = [...colorInputs];
        if (field === "imageFile") {
            newInputs[index][field] = value;
            newInputs[index].previewURL = URL.createObjectURL(value);
        } else {
            newInputs[index][field] = value;
        }
        setColorInputs(newInputs);
    };

    const addColorInput = () => {
        setColorInputs([...colorInputs, { colorName: "", imageFile: null, previewURL: "" }]);
    };

    const deleteColorInput = (index) => {
        setColorInputs(colorInputs.filter((_, i) => i !== index));
    };

    // ✅ Upload Image Function
    const uploadImage = async (file) => {
        if (!file) return "";
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(`${getBaseUrl()}/api/upload`, formData);
        return res.data.image;
    };

    // ✅ Handle Form Submission
    const onSubmit = async (data) => {
        let coverImage = await uploadImage(coverImageFile);
    
        const colors = await Promise.all(
            colorInputs.map(async (colorInput) => {
                if (colorInput.imageFile && colorInput.colorName) {
                    const imageUrl = await uploadImage(colorInput.imageFile);
                    return { colorName: colorInput.colorName, image: imageUrl };
                }
                return null;
            })
        ).then((res) => res.filter(Boolean));
    
        // ✅ Ensure only valid categories are stored
        const allowedCategories = ["Men", "Women", "Children"];
        const finalCategory = allowedCategories.includes(data.category) ? data.category : "Men"; // Default to "Men" if empty
    
        const newProductData = { ...data, category: finalCategory, coverImage, colors };
    
        try {
            await addProduct(newProductData).unwrap();
            Swal.fire("Success!", "Product added successfully!", "success");
            reset();
            setCoverImageFile(null);
            setCoverPreviewURL("");
            setColorInputs([]);
        } catch (error) {
            Swal.fire("Error!", "Failed to add product.", "error");
        }
    };
    

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Add New Product</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input {...register("title")} className="w-full p-2 border rounded" placeholder="Product Name" required />
                <textarea {...register("description")} className="w-full p-2 border rounded" placeholder="Description" required />

                <select {...register("category")} className="w-full p-2 border rounded" required>
  <option value="">Select Category</option>
  <option value="Men">Men</option>
  <option value="Women">Women</option>
  <option value="Children">Children</option>
</select>




                <div className="grid grid-cols-2 gap-4">
                    <input {...register("oldPrice")} type="number" className="w-full p-2 border rounded" placeholder="Old Price" required />
                    <input {...register("newPrice")} type="number" className="w-full p-2 border rounded" placeholder="New Price" required />
                </div>

                <input {...register("stockQuantity")} type="number" className="w-full p-2 border rounded" placeholder="Stock Quantity" min="1" required />

                <label className="flex items-center">
                    <input type="checkbox" {...register("trending")} className="mr-2" /> Trending Product
                </label>

                {/* ✅ Cover Image Upload */}
                <label className="block font-medium">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleCoverImageChange} className="w-full p-2 border rounded" required />
                {coverPreviewURL && <img src={coverPreviewURL} alt="Cover Preview" className="w-32 h-32 mt-2" />}

                {/* ✅ Product Colors */}
                <label className="block font-medium">Product Colors (Optional)</label>
                {colorInputs.map((input, index) => (
                    <div key={index} className="space-y-2">
                        <input
                            type="text"
                            placeholder="Color Name"
                            className="w-full p-2 border rounded"
                            value={input.colorName}
                            onChange={(e) => handleColorInputChange(index, "colorName", e.target.value)}
                        />

                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleColorInputChange(index, "imageFile", e.target.files[0])}
                        />

                        {input.previewURL && <img src={input.previewURL} alt="Color Preview" className="w-20 h-20 mt-1" />}

                        <button
                            type="button"
                            onClick={() => deleteColorInput(index)}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                            Delete Color
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addColorInput} className="px-3 py-2 bg-gray-300 rounded">
                    Add Color (Optional)
                </button>

                <button type="submit" className="w-full py-2 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b]">
                    {isLoading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
