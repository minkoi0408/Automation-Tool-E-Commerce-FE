import React, { useState, useEffect, useRef, useCallback } from 'react';
import apiService from '../services/api';
import type { ScrapeJob, ScrapeRequest, Platform } from '../types';
import { useLanguage } from '../context/LanguageContext';

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'RUNNING': return 'text-primary bg-primary-container/20';
    case 'COMPLETED': return 'text-secondary-fixed-dim bg-secondary-container/20';
    case 'FAILED': return 'text-error bg-error-container/20';
    case 'PENDING': return 'text-on-surface-variant bg-surface-container-highest';
    default: return 'text-on-surface bg-surface-container-highest';
  }
};

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'RUNNING': return 'autorenew';
    case 'COMPLETED': return 'check_circle';
    case 'FAILED': return 'error';
    case 'PENDING': return 'schedule';
    default: return 'help';
  }
};

const showToast = (message: string) => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className =
    'bg-surface-container-high border border-primary/30 text-on-surface px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 transform transition-all duration-300 translate-y-10 opacity-0';
  toast.innerHTML = `
    <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
      <span class="material-symbols-outlined text-[16px]">check</span>
    </div>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

export const ScrapePage: React.FC = () => {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [sessionJobIds, setSessionJobIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('current_session_scrape_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [hasRunning, setHasRunning] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Form state
  const [inputType, setInputType] = useState<'KEYWORD' | 'URL'>('KEYWORD');
  const [inputValue, setInputValue] = useState('');
  const [maxProducts, setMaxProducts] = useState(5);
  const [platform, setPlatform] = useState<Platform>('ALL');

  const saveSessionJobIds = (ids: string[]) => {
    setSessionJobIds(ids);
    try {
      sessionStorage.setItem('current_session_scrape_jobs', JSON.stringify(ids));
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchJobs = useCallback(async () => {
    try {
      const res = await apiService.getAllJobs();
      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : [];
        const currentSessionList = list.filter((j) => sessionJobIds.includes(j.id));
        const sorted = [...currentSessionList].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setJobs(sorted);
        const running = sorted.some((j) => j.status === 'RUNNING' || j.status === 'PENDING');
        setHasRunning(running);
      }
    } catch {
      console.warn('Failed to fetch jobs');
    }
  }, [sessionJobIds]);

  // Polling
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (hasRunning && !pollRef.current) {
      pollRef.current = setInterval(fetchJobs, 3000);
    } else if (!hasRunning && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [hasRunning, fetchJobs]);

  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmittingRef.current || submitting) return;

    isSubmittingRef.current = true;
    setSubmitting(true);
    try {
      const payload: ScrapeRequest = {
        inputType,
        inputValue: inputValue.trim(),
        maxProducts: inputType === 'URL' ? 1 : maxProducts,
        platform,
      };
      const res = await apiService.startScrape(payload);
      if (res.success) {
        showToast(t('jobCreatedSuccess'));
        const newJobId = res.data;
        if (newJobId) {
          const updatedIds = [newJobId, ...sessionJobIds];
          saveSessionJobIds(updatedIds);
        }
        setInputValue('');
      } else {
        showToast(`${t('errorLabel')}: ${res.message || 'Unknown error'}`);
      }
    } catch {
      showToast(t('connectionError'));
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 1000);
    }
  };

  const handleClearSession = () => {
    saveSessionJobIds([]);
    setJobs([]);
    setHasRunning(false);
  };

  return (
    <div className="flex flex-col w-full h-full p-xl gap-xl">
      {/* Title */}
      <div className="flex flex-col gap-sm">
        <h1 className="text-display text-on-surface">{t('dataAcquisitionTitle')}</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          {t('dataAcquisitionDesc')}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-xl w-full">
        {/* Form Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          <div className="bg-surface-container rounded-xl shadow-md p-lg relative overflow-hidden flex flex-col">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-sm mb-lg relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-[18px]">rocket_launch</span>
              </div>
              <h2 className="text-headline-md text-on-surface">{t('newScrapeJob')}</h2>
            </div>

            <form className="flex flex-col gap-lg flex-1 relative z-10" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-xs">
                <label className="text-label-md text-on-surface-variant uppercase">{t('inputType')}</label>
                <div className="relative">
                  <select
                    className="w-full bg-surface-container-highest text-on-surface text-body-md rounded-lg py-sm px-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                    value={inputType}
                    onChange={(e) => setInputType(e.target.value as 'KEYWORD' | 'URL')}
                  >
                    <option value="KEYWORD">{t('keywordSearch')}</option>
                    <option value="URL">{t('directUrl')}</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="text-label-md text-on-surface-variant uppercase">
                  {inputType === 'URL' ? t('productUrlLabel') : t('searchKeywordLabel')}
                </label>
                <input
                  className="w-full bg-surface-container-highest text-on-surface placeholder-on-surface-variant/50 text-body-md rounded-lg py-sm px-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder={
                    inputType === 'URL'
                      ? t('urlPlaceholder')
                      : t('keywordPlaceholder')
                  }
                  required
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputValue(val);
                    if (val.trim().startsWith('http://') || val.trim().startsWith('https://')) {
                      setInputType('URL');
                    }
                  }}
                />
              </div>

              {inputType === 'KEYWORD' ? (
                <div className="grid grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md text-on-surface-variant uppercase">{t('maxProducts')}</label>
                    <input
                      className="w-full bg-surface-container-highest text-on-surface text-body-md rounded-lg py-sm px-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      max={100}
                      min={1}
                      type="number"
                      value={maxProducts}
                      onChange={(e) => setMaxProducts(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md text-on-surface-variant uppercase">{t('platform')}</label>
                    <div className="relative">
                      <select
                        className="w-full bg-surface-container-highest text-on-surface text-body-md rounded-lg py-sm pl-md pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer truncate"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as Platform)}
                      >
                        <option value="ALL">{t('allPlatforms')}</option>
                        <option value="SHOPEE">Shopee</option>
                        <option value="LAZADA">Lazada</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-xs px-md py-sm bg-primary/10 border border-primary/20 rounded-lg text-primary text-label-md">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>{t('autoDetectBadge')}</span>
                </div>
              )}

              <div className="pt-lg">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary text-headline-md rounded-lg py-sm px-lg flex items-center justify-center gap-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                      <span>{t('starting')}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                      <span>{t('launchJob')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Jobs Panel */}
        <div className="col-span-12 lg:col-span-8 flex flex-col">
          <div className="bg-surface-container rounded-xl shadow-md p-lg flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container text-[18px]">history</span>
                </div>
                <h2 className="text-headline-md text-on-surface">{t('currentSessionTasks')}</h2>
              </div>
              <div className="flex items-center gap-md">
                {jobs.length > 0 && (
                  <button
                    onClick={handleClearSession}
                    className="text-xs text-on-surface-variant hover:text-error transition-colors flex items-center gap-xs px-sm py-xs rounded bg-surface-container-highest hover:bg-error-container/20 cursor-pointer"
                    title={t('clearSession')}
                  >
                    <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                    <span>{t('clearSession')}</span>
                  </button>
                )}
                <div className="flex items-center gap-xs">
                  <span className="relative flex h-2.5 w-2.5">
                    {hasRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${hasRunning ? 'bg-primary' : 'bg-on-surface-variant'}`} />
                  </span>
                  <span className="text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">
                    {hasRunning ? t('liveStatusRunning') : t('liveStatusReady')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto -mx-lg px-lg">
              <div className="min-w-[700px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-sm p-sm bg-surface-container-highest border-b border-surface-container-highest rounded-t-lg text-label-md text-on-surface-variant uppercase">
                  <div className="col-span-3">{t('targetUrl')}</div>
                  <div className="col-span-2">{t('platform')}</div>
                  <div className="col-span-2">{t('status')}</div>
                  <div className="col-span-4">{t('progress')}</div>
                  <div className="col-span-1 text-right">{t('action')}</div>
                </div>

                {/* Jobs List */}
                <div className="flex flex-col">
                  {jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-on-surface-variant">
                      <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-md text-primary">
                        <span className="material-symbols-outlined text-[36px]">rocket_launch</span>
                      </div>
                      <h3 className="text-headline-md text-on-surface mb-xs">{t('noSessionTasks')}</h3>
                      <p className="text-body-md text-on-surface-variant max-w-[480px] leading-relaxed mx-auto">
                        {t('noSessionTasksDesc')}
                      </p>
                    </div>
                  ) : (
                    jobs.map((job) => {
                      const isRunning = job.status === 'RUNNING';
                      const progress = job.progressPercent ?? 0;
                      const progressLabel =
                        job.totalProducts
                          ? `${job.processedProducts ?? 0} / ${job.totalProducts}`
                          : `${progress}%`;

                      const statusLabel =
                        job.status === 'COMPLETED'
                          ? t('statusCompleted')
                          : job.status === 'RUNNING'
                          ? t('statusRunning')
                          : job.status === 'FAILED'
                          ? t('statusFailed')
                          : t('statusPending');

                      return (
                        <div
                          key={job.id}
                          className="grid grid-cols-12 gap-sm p-sm items-center hover:bg-surface-container-high transition-colors group border-b border-surface-container-lowest last:border-0 rounded-sm"
                        >
                          <div className="col-span-3 flex flex-col truncate">
                            <span className="text-mono-data text-on-surface truncate">{job.id}</span>
                            <span className="text-body-md text-on-surface-variant truncate" title={job.inputValue}>
                              {job.inputValue}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="px-sm py-xs rounded text-xs text-label-md tracking-wider bg-surface-container-highest text-on-surface inline-block">
                              {job.inputType || 'ALL'}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <div className={`inline-flex items-center gap-xs px-sm py-xs rounded-full ${getStatusColor(job.status)}`}>
                              <span className={`material-symbols-outlined text-[14px] ${isRunning ? 'animate-spin' : ''}`}>
                                {getStatusIcon(job.status)}
                              </span>
                              <span className="text-label-md text-[10px] uppercase tracking-wider">{statusLabel}</span>
                            </div>
                          </div>
                          <div className="col-span-4 flex items-center gap-sm">
                            <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-mono-data text-on-surface-variant w-12 text-right">{progressLabel}</span>
                          </div>
                          <div className="col-span-1 text-right">
                            <button className="p-xs text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-full hover:bg-surface-container-highest cursor-pointer">
                              <span className="material-symbols-outlined text-[18px]">more_vert</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapePage;
