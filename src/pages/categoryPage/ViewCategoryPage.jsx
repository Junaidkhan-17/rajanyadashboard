import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getCategoryById } from "../../services/categoryService";

// import api from "../../services/api";

import VCategoryInformation from "../../components/viewCategoryPage/VCategoryInformation";
import VCategoryPreview from "../../components/viewCategoryPage/VCategoryPreview";
import VCategoryDescription from "../../components/viewCategoryPage/VCategoryDescription";
import VCategoryStatus from "../../components/viewCategoryPage/VCategoryStatus";
import VCategorySettings from "../../components/viewCategoryPage/VCategorySettings";
import VCategoryMetaCard from "../../components/viewCategoryPage/VCategoryMetaCard";
import VCategoryAction from "../../components/viewCategoryPage/VCategoryAction";


const ViewCategoryPage = () => {
  const { id } = useParams();

  const [category, setCategory] = useState(null);

  const [loading, setLoading] = useState(false);

  // ================= API =================

  /*
  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/categories/${id}`);

      setCategory(res.data.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  */

  

  useEffect(() => {
  const fetchCategory = async () => {
    try {
      setLoading(true);

      const response = await getCategoryById(id);

      if (response.success) {
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

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Category Not Found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-5">
        <div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <NavLink
              to="/"
              className="text-slate-400 hover:text-black"
            >
              Dashboard
            </NavLink>

            <span>›</span>

            <NavLink
              to="/categories"
              className="text-slate-400 hover:text-black"
            >
              Categories
            </NavLink>

            <span>›</span>

            <span className="font-semibold">
              View Category
            </span>
          </div>

          <h1 className="text-3xl font-bold">
            View Category
          </h1>

          <p className="text-slate-500 mt-1">
            View complete details of the selected category.
          </p>
        </div>

        <NavLink
          to="/categories"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-black text-white"
        >
          <ArrowLeft size={18} />
          Back to Categories
        </NavLink>
      </div>

      {/* Row 1 */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VCategoryInformation category={category} />

        <VCategoryPreview category={category} />
      </div>

      {/* Row 2 */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VCategoryDescription category={category} />

        <VCategoryStatus category={category} />
      </div>

      {/* Row 3 */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VCategorySettings category={category} />

        <VCategoryMetaCard category={category} />
      </div>

      {/* Bottom */}

      <VCategoryAction category={category} />
    </div>
  );
};

export default ViewCategoryPage;