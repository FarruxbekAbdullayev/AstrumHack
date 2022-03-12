import { useMemo } from 'react';
import {Row, Col, Card, Statistic } from 'antd';
import { t } from '../../utils';
import { COLORS } from '../../constants';
import { StyledStatistics } from './Payments.style';

export default function StatisticsCard({statistics={}}) {
  const {payments, sales} = statistics;
  const total = useMemo(() => (payments?.total + sales?.total) || 0, [payments, sales]);
  const expanse = useMemo(() => (payments?.expanse + sales?.expanse) || 0, [payments, sales]);
  const profit = useMemo(() => (payments?.profit + sales?.profit) || 0, [payments, sales]);
  const count = useMemo(() => (payments?.count + sales?.count) || 0, [payments, sales]);

  return (
    <StyledStatistics>
      <Row gutter={[20, 20]}>
        <Col span={12} lg={6}>
          <Card>
            <Statistic
              title={t('Total')}
              value={Number(total).toLocaleString('uz')}
              precision={4}
              valueStyle={{ color: '#5542F6' }}
            />
          </Card>
        </Col>
        <Col span={12} lg={6}>
          <Card>
          <Statistic
              title={t('Expanse')}
              value={Number(expanse).toLocaleString('uz')}
              precision={2}
              valueStyle={{ color: COLORS.danger }}
            />
          </Card>
        </Col>
        <Col span={12} lg={6}>
          <Card>
            <Statistic
              title={t('Profit')}
              value={Number(profit).toLocaleString('uz')}
              precision={2}
              valueStyle={{ color: COLORS.success }}
            />
          </Card>
        </Col>
        <Col span={12} lg={6}>
          <Card>
            <Statistic
              title={t('Count')}
              value={Number(count).toLocaleString('uz')}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </StyledStatistics>
  )
}
