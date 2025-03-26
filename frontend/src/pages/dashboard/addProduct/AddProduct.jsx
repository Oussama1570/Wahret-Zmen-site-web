import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../../../redux/features/products/productsApi";
import { useDispatch, useSelector } from "react-redux"; // ✅ Fixed!
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";
import "../../../Styles/StylesAddProduct.css"

const AddProduct = () => {
    const { register, handleSubmit, reset } = useForm();
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverPreviewURL, setCoverPreviewURL] = useState("");
    const [colorInputs, setColorInputs] = useState([]);
    const [addProduct, { isLoading }] = useAddProductMutation();
    
    const dispatch = useDispatch();

    // ✅ Gérer la sélection de l'image principale
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);
            setCoverPreviewURL(URL.createObjectURL(file));
        }
    };

    // ✅ Gérer les entrées de couleur
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

    // ✅ Fonction d'upload d'image
    const uploadImage = async (file) => {
        if (!file) return "";
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(`${getBaseUrl()}/api/upload`, formData);
        return res.data.image;
    };

    // ✅ Gérer la soumission du formulaire
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
    
        const allowedCategories = ["Men", "Women", "Children"];
        const finalCategory = allowedCategories.includes(data.category) ? data.category : "Men";
    
        const newProductData = { ...data, category: finalCategory, coverImage, colors };
    
        try {
            await addProduct(newProductData).unwrap();
    
            Swal.fire("Succès!", "Produit ajouté avec succès!", "success");
    
            // ✅ Réinitialiser l'état du formulaire
            reset();
            setCoverImageFile(null);
            setCoverPreviewURL("");
            setColorInputs([]);
    
            // ✅ Déclencher une nouvelle récupération pour mettre à jour Products.jsx
           
        } catch (error) {
            Swal.fire("Erreur!", "Échec de l'ajout du produit.", "error");
        }
    };

    

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md w-full ">


            <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Ajouter un Nouveau Produit</h2>
    
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-x-auto">
                <input {...register("title")} className="w-full p-2 border rounded" placeholder="Nom du Produit" required />
                <textarea {...register("description")} className="w-full p-2 border rounded" placeholder="Description" required />
    
                <select {...register("category")} className="w-full p-2 border rounded" required>
                    <option value="">Sélectionner une Catégorie</option>
                    <option value="Men">Homme</option>
                    <option value="Women">Femme</option>
                    <option value="Children">Enfants</option>
                </select>
    
                <div className="grid grid-cols-2 gap-4">
                    <input {...register("oldPrice")} type="number" className="w-full p-2 border rounded" placeholder="Ancien Prix" required />
                    <input {...register("newPrice")} type="number" className="w-full p-2 border rounded" placeholder="Nouveau Prix" required />
                </div>
    
                <input {...register("stockQuantity")} type="number" className="w-full p-2 border rounded" placeholder="Quantité en Stock" min="1" required />
    
                <label className="flex items-center">
                    <input type="checkbox" {...register("trending")} className="mr-2" /> Produit Tendance
                </label>
    
                {/* ✅ Téléchargement de l'image principale */}
                <label className="block font-medium">Image Principale</label>
                <input type="file" accept="image/*" onChange={handleCoverImageChange} className="w-full p-2 border rounded" required />
                {coverPreviewURL && <img src={coverPreviewURL} alt="Aperçu de l'Image" className="w-32 h-32 mt-2" />}
    
                {/* ✅ Couleurs du produit */}
                <label className="block font-medium">Couleurs du Produit (Optionnel)</label>
                {colorInputs.map((input, index) => (
                    <div key={index} className="space-y-2">
                        <input
                            type="text"
                            placeholder="Nom de la Couleur"
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
    
                        {input.previewURL && <img src={input.previewURL} alt="Aperçu de la Couleur" className="w-20 h-20 mt-1" />}
    
                        <button
                            type="button"
                            onClick={() => deleteColorInput(index)}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                            Supprimer la Couleur
                        </button>
                    </div>
                ))}
    
                <button type="button" onClick={addColorInput} className="px-3 py-2 bg-gray-300 rounded">
                    Ajouter une Couleur (Optionnel)
                </button>
    
                <button type="submit" className="w-full py-2 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b]">
                    {isLoading ? "Ajout en cours..." : "Ajouter le Produit"}
                </button>
            </form>
        </div>
    );
    
};

export default AddProduct;
