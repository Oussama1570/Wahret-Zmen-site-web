import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";

const ManageProducts = () => {
  const { data: products, isLoading, isError, refetch } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDeleteProduct = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        console.log("Deleting product with ID:", id); // Debugging log
        const response = await deleteProduct(id).unwrap();

        if (response?.success) {
          Swal.fire("Deleted!", "The product has been deleted.", "success");
          refetch();
        } else {
          throw new Error("Failed to delete product");
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error!", error.message || "Failed to delete product. Please try again.", "error");
    }
  };

  return (
    <section className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden text-gray-800 text-base">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm font-semibold">
                <th className="p-4 border">#</th>
                <th className="p-4 border">Title</th>
                <th className="p-4 border">Category</th>
                <th className="p-4 border">Price</th>
                <th className="p-4 border">Stock</th>
                <th className="p-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="6" className="text-center p-6">Loading...</td>
                </tr>
              )}
              {products && products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product._id} className="border-b">
                    <td className="p-4 border">{index + 1}</td>
                    <td className="p-4 border">{product.title}</td>
                    <td className="p-4 border capitalize">{product.category}</td>
                    <td className="p-4 border text-green-600 font-bold">${product.newPrice}</td>
                    <td className="p-4 border">
                      <span className={
                        product.stockQuantity === 0
                          ? "text-red-500 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }>
                        Stock: {product.stockQuantity}
                      </span>
                    </td>
                    <td className="p-4 border flex gap-2">
                      <Link
                        to={`/dashboard/edit-product/${product._id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 text-white rounded px-3 py-1 text-sm font-medium hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageProducts;