'use client';

export const TableSkeleton = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {[...Array(5)].map((_, i) => (
            <th key={i} className="px-6 py-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {[...Array(5)].map((_, rowIdx) => (
          <tr key={rowIdx}>
            {[...Array(5)].map((_, colIdx) => (
              <td key={colIdx} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-8 space-y-4">
    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-8 max-w-2xl space-y-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    ))}
    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
  </div>
);
