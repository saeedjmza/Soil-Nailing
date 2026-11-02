/**
 * Project Management Modal: Save/Load projects with custom names, export/import JSON,
 * and persistent LocalStorage history keeping both inputs and calculation results.
 */
import React, { useState, useEffect } from 'react';
import { DesignState, FullCalculationResults, Language } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import {
  FolderOpen,
  Save,
  Download,
  Upload,
  Trash2,
  Copy,
  Clock,
  CheckCircle,
  FileText,
  Plus,
} from 'lucide-react';
import { calculateAll } from '../utils/calculations';

export interface SavedProjectRecord {
  id: string;
  name: string;
  description: string;
  savedAt: string;
  state: DesignState;
  results: FullCalculationResults;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentState: DesignState;
  currentResults: FullCalculationResults;
  onLoadProject: (state: DesignState) => void;
  lang: Language;
}

const LOCAL_STORAGE_KEY = 'soil_nail_saved_projects_v1';

export const ProjectManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentState,
  currentResults,
  onLoadProject,
  lang,
}) => {
  const [projects, setProjects] = useState<SavedProjectRecord[]>([]);
  const [projectName, setProjectName] = useState(currentState.metadata.projectName || '');
  const [projectNumber, setProjectNumber] = useState(currentState.metadata.projectNumber || '');
  const [client, setClient] = useState(currentState.metadata.client || '');
  const [designer, setDesigner] = useState(currentState.metadata.designer || '');
  const [checker, setChecker] = useState(currentState.metadata.checker || '');
  const [consultant, setConsultant] = useState(currentState.metadata.consultant || '');
  const [calcDate, setCalcDate] = useState(currentState.metadata.date || '');
  const [projectDesc, setProjectDesc] = useState(currentState.metadata.notes || '');
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('load');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  // Load projects from localStorage on open
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          setProjects(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load projects from storage', err);
      }
      setProjectName(currentState.metadata.projectName || (isFa ? 'پروژه طراحی نیلینگ دیواره' : 'Soil Nail Wall Design'));
      setProjectNumber(currentState.metadata.projectNumber || 'CALC-SN-01');
      setClient(currentState.metadata.client || '');
      setDesigner(currentState.metadata.designer || '');
      setChecker(currentState.metadata.checker || '');
      setConsultant(currentState.metadata.consultant || '');
      setCalcDate(currentState.metadata.date || new Date().toLocaleDateString(isFa ? 'fa-IR' : 'en-US'));
      setProjectDesc(currentState.metadata.notes || '');
      setSaveSuccessMsg('');
    }
  }, [isOpen, currentState, isFa]);

  const saveProjectsToStorage = (updatedList: SavedProjectRecord[]) => {
    setProjects(updatedList);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const handleSaveCurrent = () => {
    if (!projectName.trim()) {
      alert(isFa ? 'لطفاً نام پروژه را وارد نمایید.' : 'Please enter a project name.');
      return;
    }

    const updatedState: DesignState = {
      ...currentState,
      metadata: {
        ...currentState.metadata,
        projectName: projectName.trim(),
        projectNumber: projectNumber.trim(),
        client: client.trim(),
        designer: designer.trim(),
        checker: checker.trim(),
        consultant: consultant.trim(),
        date: calcDate.trim(),
        notes: projectDesc.trim(),
      },
    };

    const newRecord: SavedProjectRecord = {
      id: 'proj_' + Date.now(),
      name: projectName.trim(),
      description: projectDesc.trim(),
      savedAt: new Date().toLocaleString(isFa ? 'fa-IR' : 'en-US'),
      state: updatedState,
      results: calculateAll(updatedState),
    };

    const updated = [newRecord, ...projects];
    saveProjectsToStorage(updated);
    setSaveSuccessMsg(isFa ? 'پروژه و مشخصات شناسنامه با موفقیت ذخیره شد!' : 'Project and metadata saved successfully!');
    setTimeout(() => {
      setSaveSuccessMsg('');
      setActiveTab('load');
    }, 1200);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(isFa ? 'آیا از حذف این پروژه اطمینان دارید؟' : 'Are you sure you want to delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      saveProjectsToStorage(updated);
    }
  };

  const handleExportSingleJson = (record: SavedProjectRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const payload = {
      app: 'SoilNailDesignSuite',
      version: '1.0',
      fileFormat: 'SNDA',
      savedAt: record.savedAt,
      name: record.name,
      description: record.description,
      state: record.state,
      results: record.results,
    };
    const dataStr = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    const safeName = (record.name || record.state?.metadata?.projectNumber || 'SoilNail_Project').replace(/\s+/g, '_');
    a.download = `${safeName}.snda`;
    a.click();
    a.remove();
  };

  const handleImportJsonFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.state && parsed.state.tendon) {
          // Record format
          const newRecord: SavedProjectRecord = {
            id: 'proj_' + Date.now(),
            name: parsed.name || parsed.state?.metadata?.projectName || 'Imported Project',
            description: parsed.description || parsed.state?.metadata?.notes || '',
            savedAt: new Date().toLocaleString(isFa ? 'fa-IR' : 'en-US'),
            state: parsed.state,
            results: parsed.results || calculateAll(parsed.state),
          };
          saveProjectsToStorage([newRecord, ...projects]);
        } else if (parsed.tendon && parsed.pullout) {
          // Direct DesignState format
          const newRecord: SavedProjectRecord = {
            id: 'proj_' + Date.now(),
            name: parsed.metadata?.projectName || 'Imported Soil Nail Project',
            description: parsed.metadata?.notes || '',
            savedAt: new Date().toLocaleString(isFa ? 'fa-IR' : 'en-US'),
            state: parsed,
            results: calculateAll(parsed),
          };
          saveProjectsToStorage([newRecord, ...projects]);
        }
        alert(isFa ? 'پروژه با موفقیت از فایل *.SNDA بارگذاری گردید.' : 'Project successfully imported from *.SNDA file.');
      } catch (err) {
        alert(isFa ? 'خطا در بارگذاری فایل *.SNDA.' : 'Failed to import *.SNDA project.');
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  if (!isOpen) return null;

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.state?.metadata?.projectNumber && p.state.metadata.projectNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold">
                {isFa ? 'مدیریت و بایگانی پروژه‌های طراحی نیلینگ (*.SNDA)' : 'Soil Nail Project Archive & Manager (*.SNDA)'}
              </h2>
              <p className="text-xs text-slate-400">
                {isFa ? 'ذخیره پروژه، ثبت مشخصات شناسنامه و بارگذاری محاسبات قبلی' : 'Save project with custom title, metadata & load archived records'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl font-bold">
            &times;
          </button>
        </div>

        {/* Action Tabs */}
        <div className="px-6 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('load')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'load'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{isFa ? `پروژه‌های ذخیره شده (${projects.length})` : `Saved Projects (${projects.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('save')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'save'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isFa ? 'ذخیره پروژه فعلی با نام جدید' : 'Save Current Project'}</span>
            </button>
          </div>

          <label className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 py-2">
            <Upload className="w-3.5 h-3.5" />
            <span>{isFa ? 'ورود فایل (*.SNDA)' : 'Import (*.SNDA)'}</span>
            <input type="file" accept=".snda,.json" onChange={handleImportJsonFile} className="hidden" />
          </label>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'save' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isFa ? 'نام و عنوان پروژه:' : 'Project Name:'} *
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder={isFa ? 'مثال: پایدارسازی ترانشه شمالی فاز ۲' : 'e.g. North Trench Excavation'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isFa ? 'شماره مدرک / پروژه:' : 'Doc / Project No:'}
                  </label>
                  <input
                    type="text"
                    value={projectNumber}
                    onChange={(e) => setProjectNumber(e.target.value)}
                    placeholder="CALC-SN-01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isFa ? 'کارفرما:' : 'Client:'}
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder={isFa ? 'نام کارفرما' : 'Client Name'}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isFa ? 'مهندس محاسب:' : 'Designer:'}
                  </label>
                  <input
                    type="text"
                    value={designer}
                    onChange={(e) => setDesigner(e.target.value)}
                    placeholder={isFa ? 'نام محاسب' : 'Designer Name'}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isFa ? 'کنترل‌کننده فنی:' : 'Checker:'}
                  </label>
                  <input
                    type="text"
                    value={checker}
                    onChange={(e) => setChecker(e.target.value)}
                    placeholder={isFa ? 'نام کنترل‌کننده' : 'Checker Name'}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isFa ? 'توضیحات، فرضیات و یادداشت‌ها:' : 'Description & Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder={isFa ? 'توضیحات درباره ژئوتکنیک، بارگذاری و شرایط ساختگاه...' : 'Geotechnical notes...'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Snapshot of what will be saved */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="font-bold text-slate-800">{isFa ? 'خلاصه پارامترهای فنی نیلینگ که در فایل SNDA ذخیره می‌شوند:' : 'Technical Snapshot to be Saved in SNDA:'}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono" dir="ltr">
                  <div>Tmax = {currentState.tendon.Tmax} kN</div>
                  <div>Tendon = φ{currentState.tendon.barDiameter} mm</div>
                  <div>Hole = {currentState.pullout.drillholeDiameter} mm</div>
                  <div>Plate = {currentState.plate.plateWidth}×{currentState.plate.plateWidth} cm</div>
                  <div>Temp Facing = {currentState.facing.tempThickness} mm</div>
                  <div>Protection = {currentState.corrosion.selectedClass}</div>
                </div>
              </div>

              {saveSuccessMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={handleSaveCurrent}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isFa ? 'ذخیره در آرشیو (*.SNDA)' : 'Save to Archive (*.SNDA)'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.length > 0 && (
                <input
                  type="text"
                  placeholder={isFa ? 'جستجو در نام و توضیحات پروژه‌ها...' : 'Search projects...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs mb-3"
                />
              )}

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                  <FolderOpen className="w-10 h-10 mx-auto text-slate-300" />
                  <p>{isFa ? 'هیچ پروژه‌ای در حافظه ذخیره نشده است.' : 'No saved projects found in archive.'}</p>
                  <button
                    onClick={() => setActiveTab('save')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {isFa ? 'ذخیره محاسبات جاری به عنوان پروژه جدید' : 'Save current design project'}
                  </button>
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const isPass = p.results?.isOverallPassed;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        onLoadProject(p.state);
                        onClose();
                      }}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm cursor-pointer transition flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600">
                            {p.name}
                          </span>
                          {p.state?.metadata?.projectNumber && (
                            <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                              {p.state.metadata.projectNumber}
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              isPass ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isPass ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                        {p.description && <p className="text-[11px] text-slate-500 line-clamp-1">{p.description}</p>}
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono" dir="ltr">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {p.savedAt}
                          </span>
                          <span>Tmax={p.state?.tendon?.Tmax} kN</span>
                          <span>φ{p.state?.tendon?.barDiameter} mm</span>
                          <span>Class: {p.state?.corrosion?.selectedClass}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => handleExportSingleJson(p, e)}
                          title="Download *.SNDA File"
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(p.id, e)}
                          title="Delete Project"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-semibold text-xs">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
