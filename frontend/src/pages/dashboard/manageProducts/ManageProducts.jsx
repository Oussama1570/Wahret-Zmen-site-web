import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery, // ✅ Fixed Import
} from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";

const ManageProducts = () => {
  const { data: products, isLoading, isError, refetch } = useGetAllProductsQuery(); // ✅ Fixed Hook
  const [deleteProduct] = useDeleteProductMutation();

  // ✅ Handle deleting a product with confirmation
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
        await deleteProduct(id).unwrap();
        Swal.fire("Deleted!", "The product has been deleted.", "success");
        refetch();
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to delete product. Please try again.", "error");
    }
  };

  if (isLoading) return <div className="text-center text-gray-600">Loading products...</div>;
  if (isError) return <div className="text-center text-red-500">Error loading products. Try again later.</div>;

  return (
    <section className="py-10 bg-blueGray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Manage Products</h3>
            <Link to="/dashboard/add-product">
              <button className="bg-indigo-500 text-white text-sm font-bold uppercase px-4 py-2 rounded hover:bg-indigo-600">
                Add Product
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 border">#</th>
                  <th className="px-6 py-3 border">Title</th>
                  <th className="px-6 py-3 border">Category</th>
                  <th className="px-6 py-3 border">Price</th>
                  <th className="px-6 py-3 border">Stock</th>
                  <th className="px-6 py-3 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">Loading...</td>
                  </tr>
                )}

                {products && products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 border">{index + 1}</td>
                      <td className="px-6 py-4 border">{product.title}</td>
                      <td className="px-6 py-4 border capitalize">{product.category}</td>
                      <td className="px-6 py-4 border text-green-600 font-bold">${product.newPrice}</td>
                      <td className="px-6 py-4 border">
                        {product.stockQuantity > 0 ? (
                          <span className="text-yellow-600">Stock: {product.stockQuantity}</span>
                        ) : (
                          <span className="text-red-500">Out of Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4 border flex gap-2">
                        <Link
                          to={`/dashboard/edit-product/${product._id}`}
                          className="text-indigo-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageProducts;
