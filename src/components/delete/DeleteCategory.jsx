import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, TriangleAlert, X } from "lucide-react";
import {
  getCategoryById,
  deleteCategory,
} from "../../services/categoryService";



const DeleteCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  //api
  // const [category,setCategory]=useState(null)
  //
  // useEffect(()=>{
  //   fetchCategory();
  // },[])
  //
  // const fetchCategory = async()=>{
  //   const res = await api.get(`/categories/${id}`);
  //   setCategory(res.data.data);
  // }
  //

  const [category, setCategory] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCategory = async () => {
    try {
      setLoading(true);

      const response = await getCategoryById(id);

      if (response.success && response.category) {
        setCategory(response.category);
      } else {
        setCategory(null);
      }
    } catch (error) {
      console.error("Failed to fetch category:", error);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  fetchCategory();
}, [id]);

  const [checked, setChecked] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-slate-500">
        Loading category...
      </p>
    </div>
  );
}

  if (!category) {
    return (
      <div className="h-screen flex items-center justify-center">
        Category Not Found
      </div>
    );
  }

  const handleDelete = async () => {
  if (!checked || deleting) return;

  try {
    setDeleting(true);

    const response = await deleteCategory(id);

    if (response.success) {
      alert("Category Deleted Successfully");
      navigate("/categories");
    } else {
      alert(response.message || "Failed to delete category.");
    }
  } catch (error) {
    console.error("Failed to delete category:", error);

    alert(
      error.response?.data?.message ||
        "Failed to delete category."
    );
  } finally {
    setDeleting(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl relative">
        {/* Close */}

        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 text-slate-400 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Header */}

        <div className="flex flex-col items-center pt-6 px-6">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Trash2 className="text-red-500" size={28} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Delete Category</h2>

          <p className="text-red-500 font-semibold mt-4 text-center">
            Are you sure you want to delete this category?
          </p>

          <p className="text-sm text-slate-500 text-center leading-6 mt-2">
            Deleting this category will remove it from your platform. Products
            assigned to this category may need to be reassigned before deletion.
          </p>
        </div>

        {/* Info Card */}

        <div className="mx-6 mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Parent Category</span>

            <span className="font-semibold">{category.parentCategory}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Category Name</span>

            <span className="font-semibold">{category.name}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Category Slug</span>

            <span className="font-semibold">{category.slug}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Products Assigned</span>

            <span className="font-semibold">{category.productsCount}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Created On</span>

            <span className="font-semibold">{category.createdAt}</span>
          </div>
        </div>

        {/* Warning */}

        <div className="mx-6 mt-4 rounded-2xl bg-yellow-50 border border-yellow-200 p-3 flex gap-3">
          <TriangleAlert className="text-yellow-600 mt-1" size={20} />

          <div>
            <p className="font-semibold text-yellow-700">
              This action cannot be undone.
            </p>

            <p className="text-sm text-yellow-700 mt-1">
              All category settings and assignments may be affected after
              deletion.
            </p>
          </div>
        </div>

        {/* Checkbox */}

        <div className="px-6 mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="w-4 h-4"
            />

            <span className="text-sm text-slate-700">
              I understand that this action is permanent.
            </span>
          </label>
        </div>

        {/* Buttons */}

        <div className="grid grid-cols-2 gap-4 px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="h-12 rounded-xl border border-slate-300 font-semibold hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
  disabled={!checked || deleting}
  onClick={handleDelete}
  className={`h-12 rounded-xl font-semibold text-white transition
  ${
    checked && !deleting
      ? "bg-red-600 hover:bg-red-700"
      : "bg-red-300 cursor-not-allowed"
  }`}
>
  {deleting ? "Deleting..." : "Delete Category"}
</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategory;
