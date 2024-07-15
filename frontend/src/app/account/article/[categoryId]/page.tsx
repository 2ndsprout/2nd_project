// 'use client'

// import { getArticleList } from "@/app/API/UserAPI";
// import { getDate } from "@/app/Global/Method";
// import Pagination from "@/app/Global/Pagination";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface Article {
//     id?: number;
//     title: string;
//     content: string;
//     categoryId: number;
//     createDate: string;
//     authorName: string;
// }

// export default function ArticleListPage() {
//     const [articleList, setArticleList] = useState<Article[]>([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [filteredArticles, setFilteredArticles] = useState<Article[]>([]); // 검색
//     const { categoryId } = useParams();
//     //페이징 함수
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10; // 페이지당 게시물 수
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const displayedArticles = filteredArticles.slice(startIndex, endIndex);  // .map으로 나열하기 전 받아온 JSON데이터 리스트(우측).slice의 결과물을 좌측((displayedArticles).map)에 선언.

//     useEffect(() => {
//         const fetchArticles = async () => {
//             const data = await getArticleList(Number(categoryId));
//             setArticleList(data);
//             setFilteredArticles(data); // 초기 로딩 시 모든 게시물을 설정
//         };

//         fetchArticles();
//     }, [categoryId]);

//     const handleSearch = () => {
//         const results = articleList.filter(article =>
//             article.title.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setFilteredArticles(results);
//     };

//     const getLinkClass = (id: number) => {
//         return categoryId === String(id) ? "text-yellow-400 hover:underline" : "hover:underline";
//     };

//     return (
//       <div className="bg-black w-full min-h-screen text-white flex">
//       <aside className="w-1/6 p-6 bg-gray-800">
//         <div className="mt-5 ml-20">
//           <h2 className="text-3xl font-bold mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>게시판</h2>
//           <ul>
//             <li className="mb-2">
//               <Link href="/account/article/1" className={getLinkClass(1)}>자유게시판</Link>
//             </li>
//             <li className="mb-2">
//               <Link href="/account/article/2" className={getLinkClass(2)}>공지사항</Link>
//             </li>
//             <li className="mb-2">
//               <Link href="/account/article/3" className={getLinkClass(3)}>중고거래 게시판</Link>
//             </li>
//           </ul>
//         </div>
//       </aside>
//       <div className="flex-1 max-w-7xl p-10">
//         {displayedArticles.length === 0 ? (
//           <p className="text-gray-400">게시물이 없습니다.</p>
//         ) : (
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="border-b border-gray-700">
//                 <th className="w-3/4 p-4 text-center">제목</th>
//                 <th className="w-1/4 p-4 text-left">작성자</th>
//                 <th className="w-1/4 p-4 text-right">작성일자</th>
//               </tr>
//             </thead>
//             <tbody>
//               {displayedArticles.map((article) => (
//                 <tr key={article.id} className="border-b border-gray-700">
//                   <td className="p-4 text-left">
//                     <Link href={`/account/article/detail/${article.id}`} className="hover:underline">
//                       {article.title}
//                     </Link>
//                   </td>
//                   <td className="p-4 text-left">{article.authorName}</td>
//                   <td className="p-4 text-right text-gray-400">{getDate(article.createDate)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
        
//         <div className="mt-6 flex justify-between items-center">
//           <div>
//             <input
//               type="text"
//               placeholder="검색..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="p-2 bg-gray-700 rounded text-white"
//             />
//             <button
//               onClick={handleSearch}
//               className="p-2 bg-yellow-600 rounded hover:bg-yellow-400 text-white"
//             >
//               검색
//             </button>
//           </div>
//           <Link href={`/account/article/${categoryId}/create`} className="p-2.5 bg-yellow-600 rounded hover:bg-yellow-400 text-white">
//             등록
//           </Link>
//         </div>
//         <div className="flex justify-center mt-6">
//         <Pagination
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           viewPageList={Array.from(
//             { length: Math.ceil(filteredArticles.length / itemsPerPage) }, // map으로 나열하기 이전에 받아온 json데이터.length
//             (_, i) => i + 1
//           )}
//         />
//         </div>
//       </div>
//     </div>
//     );
// }
