// // components/CategorySpecificLayout.tsx
// import React from 'react';
// import { Article } from '@/app/account/article/[categoryId]/page';
// import Link from 'next/link';

// interface CategorySpecificLayoutProps {
//   articles: Article[];
//   categoryId: number;
// }

// const CategorySpecificLayout: React.FC<CategorySpecificLayoutProps> = ({ articles, categoryId }) => {
//   if (categoryId === 3) {
//     // 중고거래 게시판 (categoryId가 3인 경우)
//     return (
//       <div className="grid grid-cols-4 gap-4">
//         {articles.map(article => (
//           <div key={article.articleId} className="border p-4">
//             <img src={article.thumbnail || '/default-thumbnail.png'} alt={article.title} className="w-full h-32 object-cover" />
//             <h2 className="mt-2">{article.title}</h2>
//             <p className="text-sm text-gray-500">{article.profileResponseDTO.name}</p>
//             <p className="text-sm text-gray-500">{new Date(article.createDate).toLocaleDateString()}</p>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // 기본 게시판 (categoryId가 3이 아닌 경우)
//   return (
//     <table className="w-full table-auto">
//       <thead>
//         <tr className="border-b border-gray-700">
//           <th className="w-1/2 p-4 text-left">제목</th>
//           <th className="w-1/6 p-4 text-center"><span className="invisible">댓글,좋아요수</span></th>
//           <th className="w-1/6 p-4 text-left">작성자</th>
//           <th className="w-1/6 p-4 text-right">작성일자</th>
//         </tr>
//       </thead>
//       <tbody>
//         {articles.map(article => (
//           <tr key={article.articleId} className="border-b border-gray-700">
//             <td className="p-4 text-left">
//               <Link href={`/account/article/${categoryId}/detail/${article.articleId}`} className="hover:underline">
//                 {article.title}
//               </Link>
//             </td>
//             <td className="flex p-4 text-center">
//               {(article.loveCount ?? 0) > 0 && (
//                 <div className="text-sm text-gray-400 flex items-center mr-4">
//                   <img src="/full-like.png" alt="좋아요 아이콘" className="w-4 mr-1" />
//                   [{article.loveCount}]
//                 </div>
//               )}
//               {(article.commentCount ?? 0) > 0 && (
//                 <div className="text-sm text-gray-400 flex items-center justify-center">
//                   <img src="/icon-comment.png" alt="댓글 아이콘" className="w-4 h-4 mr-1" />
//                   [{article.commentCount}]
//                 </div>
//               )}
//             </td>
//             <td className="p-4 text-left">{article.profileResponseDTO.name}</td>
//             <td className="p-4 text-right text-gray-400">{new Date(article.createDate).toLocaleDateString()}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default CategorySpecificLayout;
