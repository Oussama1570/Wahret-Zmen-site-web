import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";

const ManageProducts = () => {
  const { data: products, isLoading, isError, refetch } = useGetAllProductsQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const handleDeleteProduct = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire("Deleted!", "The product has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire(
          "Error!",
          error?.data?.message || "Failed to delete product. Please try again.",
          "error"
        );
      }
    }
  };

  return (
    <section className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden text-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 font-semibold">
                <th className="p-4 border">#</th>
                <th className="p-4 border">Product</th>
                <th className="p-4 border">Category</th>
                <th className="p-4 border">Colors</th>
                <th className="p-4 border">Price</th>
                <th className="p-4 border">Stock</th>
                <th className="p-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="7" className="text-center p-6">
                    Loading products...
                  </td>
                </tr>
              )}

              {!isLoading && products?.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 border">{index + 1}</td>
                    
                    {/* Product with Image */}
                    <td className="p-4 border flex items-center gap-4">
                      <img
                        src={getImgUrl(product.coverImage)}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <span className="font-medium">{product.title}</span>
                    </td>

                    {/* ✅ Replace Old Categories with Only "Men, Women, Children" */}
                    <td className="p-4 border capitalize">
                      {["Men", "Women", "Children"].includes(product.category)
                        ? product.category
                        : "Uncategorized"}
                    </td>

                    {/* Display Colors with Thumbnails */}
                    <td className="p-4 border flex flex-wrap gap-2">
                      {product.colors?.length > 0 ? (
                        product.colors.map((color, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.hex || "#fff" }} />
                            <span className="text-sm">{color.colorName}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500">Default</span>
                      )}
                    </td>

                    <td className="p-4 border text-green-600 font-bold">
                      ${product.newPrice}
                    </td>

                    <td className="p-4 border">
                      <span
                        className={product.stockQuantity === 0 ? "text-red-500 font-semibold" : "text-yellow-600 font-semibold"}
                      >
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                      </span>
                    </td>

                    <td className="p-4 border flex gap-2">
                      <Link
                        to={`/dashboard/edit-product/${product._id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded font-medium hover:bg-blue-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deleting}
                        className="bg-red-500 text-white rounded px-3 py-1 font-medium hover:bg-red-700"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                !isLoading && (
                  <tr>
                    <td colSpan="7" className="text-center p-6">
                      No products found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageProducts;
