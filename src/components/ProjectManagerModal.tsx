/**
 * Project Management Modal: Save/Load projects with custom names, export/import *.SNDA,
 * and persistent LocalStorage history keeping both inputs and calculation results.
 */
import React, { useState, useEffect } from 'react';
import { DesignState, FullCalculationResults, Language } from '../types/nailing';
import { DEFAULT_SYSTEM_SPECS, normalizeDesignState } from '../constants/standardsData';
import { downloadSndaFile, parseSndaFile } from '../utils/sndaFile';
import { TRANSLATIONS } from '../utils/translations';
import {
  FolderOpen,
  Save,
  Download,
  Upload,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
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
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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
      setStatusBanner(null);
      setPendingDeleteId(null);
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

  const buildUpdatedState = (): DesignState =>
    normalizeDesignState({
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
    });

  const handleSaveCurrent = (alsoDownloadSnda = false) => {
    if (!projectName.trim()) {
      setStatusBanner({
        type: 'error',
        msg: isFa ? 'لطفاً نام پروژه / سناریو را وارد نمایید.' : 'Please enter a project / scenario name.',
      });
      return;
    }

    const updatedState = buildUpdatedState();
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

    let savedFileMsg = '';
    if (alsoDownloadSnda) {
      const fileName = downloadSndaFile(updatedState, {
        fileName: projectName.trim(),
        name: projectName.trim(),
        description: projectDesc.trim(),
        lang,
      });
      savedFileMsg = isFa ? ` و فایل ${fileName} دانلود شد` : ` & downloaded ${fileName}`;
    }

    setStatusBanner({
      type: 'success',
      msg: isFa
        ? `سناریو و تمامی پارامترهای ورودی در بایگانی ذخیره شد${savedFileMsg}!`
        : `Scenario and all input parameters saved${savedFileMsg}!`,
    });
    setTimeout(() => {
      setStatusBanner(null);
      setActiveTab('load');
    }, 1100);
  };

  const handleConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projects.filter((p) => p.id !== id);
    saveProjectsToStorage(updated);
    setPendingDeleteId(null);
  };

  const handleExportSingleSnda = (record: SavedProjectRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSndaFile(record.state, {
      fileName: record.name || record.state?.metadata?.projectNumber || 'SoilNail_Scenario',
      name: record.name,
      description: record.description,
      lang,
    });
  };

  const handleImportSndaFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (event.target) event.target.value = '';
    if (!file) return;

    try {
      const parsed = await parseSndaFile(file, lang);
      const newRecord: SavedProjectRecord = {
        id: 'proj_' + Date.now(),
        name: parsed.name,
        description: parsed.description,
        savedAt: new Date().toLocaleString(isFa ? 'fa-IR' : 'en-US'),
        state: parsed.state,
        results: parsed.results,
      };
      saveProjectsToStorage([newRecord, ...projects]);
      onLoadProject(parsed.state);
      setActiveTab('load');
      setStatusBanner({
        type: 'success',
        msg: isFa
          ? `سناریو «${parsed.name}» از فایل ${parsed.fileName} با تمام پارامترها فراخوانی و بارگذاری شد.`
          : `Scenario "${parsed.name}" imported & loaded from ${parsed.fileName} with all parameters.`,
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        msg:
          err instanceof Error
            ? err.message
            : isFa
            ? 'فقط فایل‌های سناریو با پسوند *.snda مجاز هستند.'
            : 'Only *.snda scenario files are allowed.',
      });
    }
  };

  if (!isOpen) return null;

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.state?.metadata?.projectNumber && p.state.metadata.projectNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div
        dir={isFa ? 'rtl' : 'ltr'}
        className={`bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-700 text-slate-100 ${
          isFa ? 'text-right' : 'text-left'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                {isFa ? 'مدیریت و بایگانی پروژه‌های طراحی نیلینگ (*.SNDA)' : 'Soil Nail Project Archive & Manager (*.SNDA)'}
              </h2>
              <p className="text-xs text-slate-400">
                {isFa ? 'ذخیره پروژه، ثبت مشخصات شناسنامه و بارگذاری محاسبات قبلی' : 'Save project with custom title, metadata & load archived records'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="px-6 bg-slate-950/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('load');
                setStatusBanner(null);
              }}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'load'
                  ? 'border-sky-400 text-sky-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{isFa ? `پروژه‌های ذخیره شده (${projects.length})` : `Saved Projects (${projects.length})`}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('save');
                setStatusBanner(null);
              }}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'save'
                  ? 'border-sky-400 text-sky-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isFa ? 'ذخیره پروژه فعلی با نام جدید' : 'Save Current Project'}</span>
            </button>
          </div>

          <label className="cursor-pointer text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 py-2 whitespace-nowrap">
            <Upload className="w-3.5 h-3.5" />
            <span>{isFa ? 'فراخوانی سناریو (*.SNDA)' : 'Import Scenario (*.SNDA)'}</span>
            <input type="file" accept=".snda" onChange={handleImportSndaFile} className="hidden" />
          </label>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {statusBanner && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                statusBanner.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
              }`}
            >
              {statusBanner.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusBanner.msg}</span>
            </div>
          )}

          {activeTab === 'save' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isFa ? 'نام و عنوان پروژه:' : 'Project Name:'} *
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder={isFa ? 'مثال: پایدارسازی ترانشه شمالی فاز ۲' : 'e.g. North Trench Excavation'}
                    className="w-full px-3 py-2 border border-slate-700 bg-slate-950 text-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isFa ? 'شماره مدرک / پروژه:' : 'Doc / Project No:'}
                  </label>
                  <input
                    type="text"
                    value={projectNumber}
                    onChange={(e) => setProjectNumber(e.target.value)}
                    placeholder="CALC-SN-01"
                    className="w-full px-3 py-2 border border-slate-700 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isFa ? 'کارفرما:' : 'Client:'}
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder={isFa ? 'نام کارفرما' : 'Client Name'}
                    className="w-full px-3 py-2 border border-slate-700 bg-slate-950 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isFa ? 'مهندس محاسب:' : 'Designer:'}
                  </label>
                  <input
                    type="text"
                    value={designer}
                    onChange={(e) => setDesigner(e.target.value)}
                    placeholder={isFa ? 'نام محاسب' : 'Designer Name'}
                    className="w-full px-3 py-2 border border-slate-700 bg-slate-950 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isFa ? 'کنترل‌کننده فنی:' : 'Checker:'}
                  </label>
                  <input
                    type="text"
                    value={checker}
                    onChange={(e) => setChecker(e.target.value)}
                    placeholder={isFa ? 'نام کنترل‌کننده' : 'Checker Name'}
                    className="w-full px-3 py-2 border border-slate-700 bg-slate-950 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isFa ? 'توضیحات، فرضیات و یادداشت‌ها:' : 'Description & Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder={isFa ? 'توضیحات درباره ژئوتکنیک، بارگذاری و شرایط ساختگاه...' : 'Geotechnical notes...'}
                  className="w-full px-3 py-2 border border-slate-700 bg-slate-950 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                />
              </div>

              {/* Snapshot of what will be saved */}
              <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 text-xs space-y-2 text-slate-300">
                <div className="font-bold text-slate-100">
                  {isFa
                    ? 'خلاصه پارامترهای کامل سیستم و طراحی که در فایل *.SNDA ذخیره می‌شوند:'
                    : 'Complete System & Design Input Snapshot Saved in *.SNDA:'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-sky-300 tabular-nums" dir="ltr">
                  <div>H = {(currentState.system || DEFAULT_SYSTEM_SPECS).wallHeight} m</div>
                  <div>L = {(currentState.system || DEFAULT_SYSTEM_SPECS).nailLength} m</div>
                  <div>Grid = {currentState.facing.Sh}×{currentState.facing.Sv} m</div>
                  <div>Life = {currentState.corrosion.designLife}</div>
                  <div>Tmax = {currentState.tendon.Tmax} kN</div>
                  <div>Tendon = φ{currentState.tendon.barDiameter} mm</div>
                  <div>Hole = {currentState.pullout.drillholeDiameter} mm</div>
                  <div>Protection = {currentState.corrosion.selectedClass}</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveCurrent(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Save className="w-4 h-4 text-sky-400" />
                  <span>{isFa ? 'ذخیره در بایگانی برنامه' : 'Save to App Archive'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCurrent(true)}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{isFa ? 'ذخیره و دانلود فایل (*.SNDA)' : 'Save & Download (*.SNDA)'}</span>
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
                  className="w-full px-3 py-2 border border-slate-700 bg-slate-950 text-slate-100 rounded-xl text-xs mb-3 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
              )}

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs space-y-2.5">
                  <FolderOpen className="w-10 h-10 mx-auto text-slate-600" />
                  <p>{isFa ? 'هیچ پروژه‌ای در حافظه ذخیره نشده است.' : 'No saved projects found in archive.'}</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('save')}
                    className="text-sky-400 hover:underline font-semibold cursor-pointer"
                  >
                    {isFa ? 'ذخیره محاسبات جاری به عنوان پروژه جدید' : 'Save current design project'}
                  </button>
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const isPass = p.results?.isOverallPassed;
                  const isConfirmingDelete = pendingDeleteId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        onLoadProject(normalizeDesignState(p.state));
                        onClose();
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-sky-500/50 hover:bg-slate-900 cursor-pointer transition flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-slate-100 group-hover:text-sky-300 truncate">
                            {p.name}
                          </span>
                          {p.state?.metadata?.projectNumber && (
                            <span className="text-[10px] text-slate-300 font-mono bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
                              {p.state.metadata.projectNumber}
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              isPass
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                                : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                            }`}
                          >
                            {isPass ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                        {p.description && <p className="text-[11px] text-slate-400 line-clamp-1">{p.description}</p>}
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-mono tabular-nums" dir="ltr">
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
                          type="button"
                          onClick={(e) => handleExportSingleSnda(p, e)}
                          title="Download *.SNDA File"
                          className="p-2 text-slate-400 hover:text-sky-300 rounded-lg hover:bg-slate-800 cursor-pointer transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {isConfirmingDelete ? (
                          <button
                            type="button"
                            onClick={(e) => handleConfirmDelete(p.id, e)}
                            className="px-2 py-1 text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer transition"
                          >
                            {isFa ? 'تأیید حذف' : 'Confirm'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDeleteId(p.id);
                            }}
                            title="Delete Project"
                            className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 cursor-pointer transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs cursor-pointer transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
