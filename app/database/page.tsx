'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Table, 
  FileText, 
  Search, 
  RefreshCw,
  ChevronRight,
  Eye,
  BarChart3,
  Server,
  HardDrive,
  Users,
  Activity,
  Settings
} from 'lucide-react';

// ממשק הטבלה
interface TableInfo {
  name: string;
  schema: string;
  row_count: number;
  column_count: number;
  columns: Array<{
    column_name: string;
    data_type: string;
    is_nullable: string;
    column_default: string | null;
    character_maximum_length: number | null;
  }>;
}

// מפת איקונים לטבלאות
const TABLE_ICONS: Record<string, any> = {
  projects: FileText,
  users: Users,
  activities: Activity,
  configurations: Settings,
  deployments: Server,
  default: Table
};

export default function DatabasePage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // טעינת טבלאות
  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/database/tables');
      if (!response.ok) {
        throw new Error('שגיאה בטעינת טבלאות בסיס הנתונים');
      }
      
      const data = await response.json();
      setTables(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
      console.error('Error loading tables:', err);
    } finally {
      setLoading(false);
    }
  };

  // טעינה ראשונית
  useEffect(() => {
    loadTables();
  }, []);

  // פילטור טבלאות
  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTableIcon = (tableName: string) => {
    return TABLE_ICONS[tableName] || TABLE_ICONS.default;
  };

  const TableCard = ({ table }: { table: TableInfo }) => {
    const Icon = getTableIcon(table.name);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-200"
        onClick={() => setSelectedTable(table.name)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3" dir="ltr">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Icon className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800" dir="rtl">{table.name}</h3>
              <p className="text-gray-500 text-sm" dir="rtl">Schema: {table.schema}</p>
            </div>
          </div>
          <ChevronRight className="text-gray-400 w-5 h-5" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{table.row_count.toLocaleString()}</div>
            <div className="text-sm text-blue-800" dir="rtl">רשומות</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{table.column_count}</div>
            <div className="text-sm text-green-800" dir="rtl">עמודות</div>
          </div>
        </div>

        {/* Column Types Summary */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2" dir="rtl">סוגי נתונים:</h4>
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(table.columns.map(col => col.data_type))).slice(0, 3).map((type, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
              >
                {type}
              </span>
            ))}
            {Array.from(new Set(table.columns.map(col => col.data_type))).length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                +{Array.from(new Set(table.columns.map(col => col.data_type))).length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <p className="ml-4 text-gray-600 text-lg" dir="rtl">טוען נתוני בסיס הנתונים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <Database className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2" dir="rtl">שגיאה בחיבור לבסיס הנתונים</h2>
          <p className="text-gray-600 mb-4" dir="rtl">{error}</p>
          <button
            onClick={loadTables}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
            dir="ltr"
          >
            <RefreshCw className="w-4 h-4" />
            <span dir="rtl">נסה שוב</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6" dir="ltr">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Database className="text-white w-8 h-8" />
            </div>
            <div className="text-right" dir="rtl">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">ניהול בסיס הנתונים</h1>
              <p className="text-gray-600 text-lg">PostgreSQL - dev-manage-app</p>
            </div>
          </div>

          {/* Database Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4" dir="rtl">מידע על בסיס הנתונים</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Server className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-blue-800" dir="rtl">שרת</div>
                <div className="text-xs text-blue-600">64.176.175.17</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <HardDrive className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-800" dir="rtl">בסיס נתונים</div>
                <div className="text-xs text-green-600">dev-manage-app</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Table className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-purple-800" dir="rtl">טבלאות</div>
                <div className="text-xs text-purple-600">{tables.length}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-orange-800" dir="rtl">סך רשומות</div>
                <div className="text-xs text-orange-600">
                  {tables.reduce((sum, table) => sum + table.row_count, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חיפוש טבלאות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right"
                dir="rtl"
              />
            </div>
            <button
              onClick={loadTables}
              className="bg-gray-500 text-white px-4 py-3 rounded-xl hover:bg-gray-600 transition-colors flex items-center space-x-2 mr-4"
              dir="ltr"
            >
              <RefreshCw className="w-5 h-5" />
              <span dir="rtl">רענן</span>
            </button>
          </div>
        </motion.div>

        {/* Tables Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTables.map((table) => (
            <TableCard key={table.name} table={table} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredTables.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🗄️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2" dir="rtl">
              {tables.length === 0 ? 'אין טבלאות בבסיס הנתונים' : 'לא נמצאו טבלאות'}
            </h3>
            <p className="text-gray-500" dir="rtl">
              {tables.length === 0 ? 'בסיס הנתונים ריק' : 'נסה לשנות את החיפוש'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Table Viewer Modal */}
      <AnimatePresence>
        {selectedTable && (
          <TableViewer 
            tableName={selectedTable} 
            onClose={() => setSelectedTable(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// רכיב להצגת נתוני טבלה
interface TableViewerProps {
  tableName: string;
  onClose: () => void;
}

function TableViewer({ tableName, onClose }: TableViewerProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    loadTableData();
  }, [tableName, currentPage, searchTerm]);

  const loadTableData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: (currentPage * pageSize).toString(),
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await fetch(`/api/database/tables/${tableName}?${params}`);
      if (!response.ok) throw new Error('שגיאה בטעינת נתוני הטבלה');
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error loading table data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800" dir="rtl">טבלה: {tableName}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="חיפוש ברשומות..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[70vh]">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
              <p className="text-gray-600" dir="rtl">טוען נתונים...</p>
            </div>
          ) : data ? (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      {data.columns.map((column: any) => (
                        <th key={column.column_name} className="border border-gray-300 px-4 py-2 text-right text-sm font-medium text-gray-700">
                          <div dir="rtl">
                            <div>{column.column_name}</div>
                            <div className="text-xs text-gray-500">{column.data_type}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((row: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {data.columns.map((column: any) => (
                          <td key={column.column_name} className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                            <div dir="rtl">
                              {row[column.column_name] !== null ? 
                                String(row[column.column_name]) : 
                                <span className="text-gray-400 italic">null</span>
                              }
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600" dir="rtl">
                  מציג {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, data.pagination.total)} מתוך {data.pagination.total} רשומות
                </div>
                <div className="flex space-x-2" dir="ltr">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                  >
                    הקודם
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!data.pagination.has_more}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                  >
                    הבא
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500" dir="rtl">
              שגיאה בטעינת הנתונים
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
