import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Bus, ChevronRight, Loader2 } from 'lucide-react';
import { Student, BusRoute } from '../types';

interface LiveSearchProps {
  students: Student[];
  routes: BusRoute[];
  onSelectStudent: (s: Student) => void;
  onSelectRoute: (r: BusRoute) => void;
}

const LiveSearch: React.FC<LiveSearchProps> = ({ students, routes, onSelectStudent, onSelectRoute }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ students: Student[], routes: BusRoute[] }>({ students: [], routes: [] });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setQuery(''); // Close dropdown
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ students: [], routes: [] });
      return;
    }

    setIsSearching(true);
    // Simulate instant network delay for "Live" feel
    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      
      const matchedStudents = students.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) || 
        s.id.toLowerCase().includes(lowerQuery) ||
        s.school.toLowerCase().includes(lowerQuery)
      ).slice(0, 3);

      const matchedRoutes = routes.filter(r => 
        r.name.toLowerCase().includes(lowerQuery) || 
        r.busNumber.toLowerCase().includes(lowerQuery) || 
        r.driver.toLowerCase().includes(lowerQuery)
      ).slice(0, 3);

      setResults({ students: matchedStudents, routes: matchedRoutes });
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, students, routes]);

  return (
    <div className="relative hidden md:block w-72" ref={wrapperRef}>
      <div className={`flex items-center bg-slate-100 border transition-all rounded-full px-3 py-2 ${query ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white' : 'border-transparent'}`}>
        {isSearching ? (
            <Loader2 className="animate-spin text-blue-500 mr-2" size={16} />
        ) : (
            <Search className="text-slate-400 mr-2" size={16} />
        )}
        <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fleet, students..." 
            className="bg-transparent outline-none text-sm w-full placeholder:text-slate-500 text-slate-800"
        />
        {query && (
            <button onClick={() => setQuery('')} className="ml-1 text-slate-400 hover:text-slate-600">
                <span className="sr-only">Clear</span>
                &times;
            </button>
        )}
      </div>

      {query.length >= 2 && (results.students.length > 0 || results.routes.length > 0) && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-2 z-50">
              
              {results.students.length > 0 && (
                  <div className="py-2">
                      <div className="px-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students</div>
                      {results.students.map(s => (
                          <div 
                              key={s.id}
                              onClick={() => { onSelectStudent(s); setQuery(''); }}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-3 group transition-colors"
                          >
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <User size={14}/>
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800">{s.name}</p>
                                  <p className="text-[10px] text-slate-500">{s.school}</p>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
                          </div>
                      ))}
                  </div>
              )}

              {results.routes.length > 0 && (
                  <div className="py-2 border-t border-slate-100">
                      <div className="px-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Routes</div>
                      {results.routes.map(r => (
                          <div 
                              key={r.id}
                              onClick={() => { onSelectRoute(r); setQuery(''); }}
                              className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex items-center gap-3 group transition-colors"
                          >
                              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                  <Bus size={14}/>
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800">{r.busNumber}</p>
                                  <p className="text-[10px] text-slate-500">{r.name}</p>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-orange-500" />
                          </div>
                      ))}
                  </div>
              )}
          </div>
      )}
      
      {query.length >= 2 && results.students.length === 0 && results.routes.length === 0 && !isSearching && (
           <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-4 text-center z-50">
               <p className="text-sm text-slate-500">No results found for "{query}"</p>
           </div>
      )}
    </div>
  );
};

export default LiveSearch;
