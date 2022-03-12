import { memo } from 'react';
import { t } from '../../utils';

function StatisticsItem({statistics={}}) {
  const {total, expanse, profit, count} = statistics;
  return (
    <div className="tab__statistic">
      <div className="tab__statistic__card">
        <p className="tab__statistic-title">{t("Total")}</p>
        <h2 className="tab__statistic-text">{Number(total || 0).toLocaleString('uz')}</h2>
      </div>
      <div className="tab__statistic__card">
        <p className="tab__statistic-title">{t("Profit")}</p>
        <h2 className="tab__statistic-text">{Number(profit || 0).toLocaleString('uz')}</h2>
      </div>
      <div className="tab__statistic__card">
        <p className="tab__statistic-title">{t("Expense")}</p>
        <h2 className="tab__statistic-text">{Number(expanse || 0).toLocaleString('uz')}</h2>
      </div>
      <div className="tab__statistic__card">
        <p className="tab__statistic-title">{t("Count")}</p>
        <h2 className="tab__statistic-text">{Number(count || 0).toLocaleString('uz')}</h2>
      </div>
    </div>
  )
}

export default StatisticsItem;