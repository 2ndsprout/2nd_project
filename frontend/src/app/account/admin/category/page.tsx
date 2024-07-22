'use client'

import React, { useState, useEffect } from 'react';
import { postCategory, getCategoryList, getArticleList, updateCategory, deleteCategory } from '@/app/API/UserAPI';
import { getProfile, getUser } from '@/app/API/UserAPI';
import { redirect } from "next/navigation";
import Link from 'next/link';
import CategoryList from "@/app/Global/CategoryList";
import Main from "@/app/Global/layout/MainLayout";

interface Category {
  id: number;
  name: string;
  articleCount?: number;
}

const CreateCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [sidebarCategories, setSidebarCategories] = useState<Category[]>([]);
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');

  useEffect(() => {
    if (ACCESS_TOKEN) {
        getUser()
            .then(r => {
                setUser(r);
            })
            .catch(e => console.log(e));
        if (PROFILE_ID)
            getProfile()
                .then(r => {
                    setProfile(r);
                })
                .catch(e => console.log(e));
        else
            redirect('/account/profile');
    }
    else
        redirect('/account/login');
}, [ACCESS_TOKEN, PROFILE_ID]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoryData = await getCategoryList();
      const categoriesWithCounts = await Promise.all(
        categoryData.map(async (category: Category) => {
          const articleData = await getArticleList({ Page: 0, CategoryId: category.id });
          return { ...category, articleCount: articleData.totalElements };
        })
      );
      setCategories(categoriesWithCounts);
      setSidebarCategories(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('카테고리 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!categoryName.trim()) {
      setError('카테고리 이름을 입력해주세요.');
      return;
    }

    if (editingCategory) {
      setShowEditConfirm(true);
    } else {
      try {
        await postCategory({ id: 0, name: categoryName });
        alert('카테고리가 성공적으로 생성되었습니다.');
        setCategoryName('');
        fetchCategories();
      } catch (error) {
        console.error('Error creating category:', error);
        setError('카테고리 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const confirmEdit = async () => {
    try {
      await updateCategory({ id: editingCategory!.id, name: categoryName });
      alert('카테고리가 성공적으로 수정되었습니다.');
      setCategoryName('');
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      setError('카테고리 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    setShowEditConfirm(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
        alert('카테고리가 성공적으로 삭제되었습니다.');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('카테고리 삭제 중 오류가 발생했습니다.');
      }
    }
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  return (
    <Main user={user} profile={profile} categories={categories}>
    <div className="bg-black w-full min-h-screen text-white flex">
      <aside className="w-1/6 p-6 bg-gray-800">
      <CategoryList managementMode={true} categories={sidebarCategories} />
      </aside>
      <div className="flex-1 max-w-7xl p-10">
        <h1 className="text-2xl font-bold mb-4">카테고리 관리</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {editingCategory ? '카테고리 수정' : '새 카테고리 생성'}
          </h2>
          <form onSubmit={handleSubmit} className="max-w-md">
            <div className="mb-4">
              <label htmlFor="categoryName" className="block mb-2">카테고리 이름</label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-400">
              {editingCategory ? '수정' : '생성'}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryName('');
                }}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
              >
                취소
              </button>
            )}
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">카테고리 목록</h2>
          {categories.length > 0 ? (
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="w-1/2 p-4 text-left">카테고리 이름</th>
                  <th className="w-1/4 p-4 text-right">게시물 수</th>
                  <th className="w-1/4 p-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-700">
                    <td className="p-4 text-left">
                      <Link href={`/account/article/${category.id}`} className="text-blue-400 hover:underline">
                        {category.name}
                      </Link>
                    </td>
                    <td className="p-4 text-right">{category.articleCount || 0}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400 mr-2"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">카테고리가 없습니다.</p>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded shadow-lg">
            <div className="text-lg font-semibold text-white">삭제 확인</div>
            <p className="text-gray-400">이 카테고리를 삭제하시겠습니까?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="mr-2 p-2 bg-gray-600 rounded text-white hover:bg-gray-500">취소</button>
              <button onClick={confirmDelete} className="p-2 bg-red-600 rounded text-white hover:bg-red-500">삭제</button>
            </div>
          </div>
        </div>
      )}

      {showEditConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded shadow-lg">
            <div className="text-lg font-semibold text-white">수정 확인</div>
            <p className="text-gray-400">이 카테고리를 수정하시겠습니까?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowEditConfirm(false)} className="mr-2 p-2 bg-gray-600 rounded text-white hover:bg-gray-500">취소</button>
              <button onClick={confirmEdit} className="p-2 bg-blue-600 rounded text-white hover:bg-blue-500">수정</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Main>
  );
};

export default CreateCategory;