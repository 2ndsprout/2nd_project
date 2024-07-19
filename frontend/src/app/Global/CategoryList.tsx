'use client'

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCategoryList } from "@/app/API/UserAPI";

interface Category {
  id: number;
  name: string;
}

interface CategoryListProps {
  managementMode?: boolean;
  categories?: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ managementMode = false, categories: propCategories }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const params = useParams();
  const categoryId = Array.isArray(params.categoryId) ? params.categoryId[0] : params.categoryId;

  useEffect(() => {
    if (!managementMode) {
      fetchCategories();
    }
  }, [managementMode]);

  useEffect(() => {
    if (managementMode && propCategories) {
      setCategories(propCategories);
    }
  }, [managementMode, propCategories]);

  const fetchCategories = async () => {
    try {
      const data = await getCategoryList();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('카테고리를 불러오는데 실패했습니다.');
    }
  };

  const getLinkClass = (id: number) => {
    return categoryId === String(id) ? "text-yellow-400 hover:underline" : "hover:underline";
  };

  return (
    <div className="mt-5 ml-20">
      <h2 className="text-3xl font-bold mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>게시판</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id} className="mb-2">
              <Link href={`/account/article/${category.id}`} className={getLinkClass(category.id)}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryList;