import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  sortConfig: {
    key: string;
    direction: string;
  };
  onSort: (key: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function Table({ columns, data, sortConfig, onSort, onEdit, onDelete }: TableProps) {
  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="ml-1" />;
    }
    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                }`}
                onClick={() => column.sortable && onSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.idPaciente} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.render ? column.render(item[column.key]) : item[column.key]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(item.idPaciente)}
                  className="text-primary hover:text-primary-dark mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item.idPaciente)}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 