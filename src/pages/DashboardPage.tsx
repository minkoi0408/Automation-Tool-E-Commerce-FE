import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import type { DashboardStats, ScrapeJob } from '../types';
import { formatDate } from '../utils/format';
import { useLanguage } from '../context/LanguageContext';

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

interface StatCardData {
  title: string;
  value: number;
  icon: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardData> = ({ title, value, icon, colorClass }) => (
  <div className="flex flex-col p-lg rounded-xl bg-surface-container shadow-sm relative overflow-hidden group hover:bg-surface-container-high transition-colors">
    <div className="absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110 group-hover:opacity-10">
      <span className={`material-symbols-outlined text-[120px] ${colorClass}`}>{icon}</span>
    </div>
    <div className="flex items-center justify-between mb-lg relative z-10">
      <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider">{title}</h3>
      <span className={`material-symbols-outlined text-[20px] ${colorClass}`}>{icon}</span>
    </div>
    <div className="text-display text-on-surface relative z-10">{formatNumber(value)}</div>
  </div>
);

const getStatusBadge = (status?: string, t?: (k: string) => string) => {
  const s = status?.toUpperCase() || 'UNKNOWN';
  switch (s) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5" />
          {t ? t('statusPending') : 'PENDING'}
        </span>
      );
    case 'RUNNING':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-container/30 text-primary text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
          {t ? t('statusRunning') : 'RUNNING'}
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-container/40 text-secondary text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5" />
          {t ? t('statusCompleted') : 'COMPLETED'}
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-error-container/40 text-error text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-error mr-1.5" />
          {t ? t('statusFailed') : 'FAILED'}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-outline mr-1.5" />
          {s}
        </span>
      );
  }
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiService.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {
      console.warn('API Stats failed');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await apiService.getAllJobs();
      if (res.success && res.data) {
        setJobs(Array.isArray(res.data) ? res.data : []);
      }
    } catch {
      console.warn('API Jobs failed');
    } finally {
      setLoadingJobs(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchJobs();
    const jobsInterval = setInterval(fetchJobs, 30000);
    const statsInterval = setInterval(fetchStats, 60000);
    return () => {
      clearInterval(jobsInterval);
      clearInterval(statsInterval);
    };
  }, [fetchStats, fetchJobs]);

  return (
    <div className="flex flex-col w-full gap-xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md relative w-full overflow-hidden p-lg rounded-xl bg-surface-container shadow-sm group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125" />
        <div className="relative z-10 flex flex-col gap-xs">
          <h1 className="text-display text-on-surface tracking-tight">{t('overviewTitle')}</h1>
          <p className="text-body-lg text-on-surface-variant max-w-[600px]">
            {t('overviewDesc')}
          </p>
        </div>
        <div className="relative z-10 flex gap-md">
          <button
            onClick={() => navigate('/scrape')}
            className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {t('createNewJob')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        {loadingStats ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col p-lg rounded-xl bg-surface-container shadow-sm animate-pulse h-32" />
            ))}
          </>
        ) : (
          <>
            <StatCard title={t('totalProducts')} value={stats?.totalProducts ?? 0} icon="inventory_2" colorClass="text-primary" />
            <StatCard title={t('completedScrapes')} value={stats?.completedProducts ?? 0} icon="check_circle" colorClass="text-secondary" />
            <StatCard title={t('failedScrapes')} value={stats?.failedProducts ?? 0} icon="error" colorClass="text-error" />
            <StatCard title={t('totalJobs')} value={stats?.totalJobs ?? 0} icon="work_history" colorClass="text-tertiary" />
          </>
        )}
      </div>

      {/* Recent Jobs Table */}
      <div className="flex flex-col bg-surface-container rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-lg border-b border-surface">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">list_alt</span>
            <h2 className="text-headline-md text-on-surface">{t('recentJobs')}</h2>
          </div>
          <button
            onClick={fetchJobs}
            className={`text-on-surface-variant hover:text-primary transition-colors flex items-center cursor-pointer ${refreshing ? 'animate-spin' : ''}`}
            title="Refresh"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>

        {loadingJobs ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-high border-b border-surface">
                  <th className="p-md text-label-md text-on-surface-variant uppercase tracking-wider w-1/3">{t('targetUrl')}</th>
                  <th className="p-md text-label-md text-on-surface-variant uppercase tracking-wider w-32">{t('status')}</th>
                  <th className="p-md text-label-md text-on-surface-variant uppercase tracking-wider w-1/3">{t('progress')}</th>
                  <th className="p-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">{t('created')}</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((i) => (
                  <tr key={i} className="border-b border-surface animate-pulse">
                    <td className="p-md"><div className="h-4 bg-surface rounded w-3/4" /></td>
                    <td className="p-md"><div className="h-6 bg-surface rounded w-20" /></td>
                    <td className="p-md"><div className="h-2 bg-surface rounded w-full" /></td>
                    <td className="p-md"><div className="h-4 bg-surface rounded w-24 ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md opacity-50">search_off</span>
            <p className="text-body-lg text-on-surface">{t('noRecentJobs')}</p>
            <p className="text-body-md text-on-surface-variant mt-xs">{t('startNewJobHint')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-high border-b border-surface">
                  <th className="p-md text-label-md text-on-surface-variant uppercase tracking-wider w-1/3">{t('targetUrl')}</th>
                  <th className="p-md text-label-md text-on-surface-variant uppercase tracking-wider w-32">{t('status')}</th>
                  <th className="p-md text-label-md text-on-surface-variant uppercase tracking-wider w-1/3">{t('progress')}</th>
                  <th className="p-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">{t('created')}</th>
                </tr>
              </thead>
              <tbody className="text-body-md text-on-surface">
                {jobs.slice(0, 10).map((job) => {
                  const progress = job.progressPercent ?? 0;
                  return (
                    <tr key={job.id} className="border-b border-surface hover:bg-surface-container-high transition-colors group">
                      <td className="p-md">
                        <div className="text-mono-data text-on-surface truncate max-w-[250px] lg:max-w-md" title={job.inputValue}>
                          {job.inputValue}
                        </div>
                      </td>
                      <td className="p-md">{getStatusBadge(job.status, t)}</td>
                      <td className="p-md">
                        <div className="flex items-center gap-sm">
                          <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-mono-data text-[11px] text-on-surface-variant min-w-[3ch]">{progress}%</span>
                        </div>
                      </td>
                      <td className="p-md text-right text-[12px] text-on-surface-variant whitespace-nowrap">
                        {formatDate(job.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
